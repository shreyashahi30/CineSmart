document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const movieList = document.getElementById('movies');
    
    const apiKey = 'd8fb378b6567392adbfae7049c722249'; // Use a secure method for API keys in production

    // Function to display movies on the page
    function displayMovies(movies) {
        movieList.innerHTML = ''; // Clear any existing content

        movies.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');
            movieCard.dataset.movieId = movie.id;

            const moviePoster = document.createElement('img');
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            moviePoster.alt = `${movie.title} Poster`;

            const movieTitle = document.createElement('h3');
            movieTitle.textContent = movie.title;

            const movieRating = document.createElement('p');
            movieRating.textContent = `Rating: ${movie.vote_average}`;

            const genresContainer = document.createElement('div');
            genresContainer.classList.add('genres');
            const genreNames = movie.genre_ids.map(getGenreName).join(', ');
            genresContainer.textContent = genreNames;

            movieCard.appendChild(moviePoster);
            movieCard.appendChild(movieTitle);
            movieCard.appendChild(movieRating);
            movieCard.appendChild(genresContainer);

            movieList.appendChild(movieCard);

            movieCard.addEventListener('click', () => {
                fetchMovieDetails(movie.id);
            });
        });
    }

    // Function to get genre names from their IDs
    function getGenreName(genreId) {
        const genreMapping = {
            28: 'Action',
            12: 'Adventure',
            16: 'Animation',
            35: 'Comedy',
            80: 'Crime',
            99: 'Documentary',
            18: 'Drama',
            14: 'Fantasy',
            27: 'Horror',
            10402: 'Music',
            9648: 'Mystery',
            10749: 'Romance',
            878: 'Science Fiction',
            10770: 'TV Movie',
            53: 'Thriller',
            10752: 'War',
            37: 'Western',
        };
        return genreMapping[genreId] || 'Unknown Genre'; // Added 'Unknown Genre' fallback
    }

    // Fetch movie details from TMDB by movie ID
    function fetchMovieDetails(movieId) {
        const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

        fetch(movieDetailsUrl)
            .then(response => response.json())
            .then(movie => {
                const modalBody = document.getElementById('modal-body');
                modalBody.innerHTML = ''; // Clear previous content

                const backdropPath = movie.backdrop_path || movie.poster_path;
                const movieImage = document.createElement('img');
                movieImage.src = `https://image.tmdb.org/t/p/w780${backdropPath}`;
                movieImage.alt = `${movie.title} Image`;

                const movieTitle = document.createElement('h2');
                movieTitle.textContent = movie.title;

                const movieOverview = document.createElement('p');
                movieOverview.textContent = movie.overview;

                modalBody.appendChild(movieImage);
                modalBody.appendChild(movieTitle);
                modalBody.appendChild(movieOverview);

                // Show modal logic goes here
                const modal = document.getElementById('movieModal'); // Ensure you have a modal element in your HTML
                modal.style.display = 'block'; // Show the modal
            })
            .catch(error => {
                console.error('Error fetching movie details:', error);
            });
    }

    // Event listener for search bar input
    searchBar.addEventListener('input', function () {
        const query = searchBar.value.toLowerCase();
        
        if (query) {
            fetch(`/search?query=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(data => {
                    if (data.length > 0) {
                        displayMovies(data);
                    } else {
                        movieList.innerHTML = '<p>No movies found.</p>';
                    }
                })
                .catch(error => {
                    console.error('Error fetching movies:', error);
                    movieList.innerHTML = '<p>Error fetching movies. Please try again later.</p>';
                });
        } else {
            movieList.innerHTML = ''; // Clear results if no query
        }
    });
});
