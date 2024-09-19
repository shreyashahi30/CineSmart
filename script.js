// script.js

// Replace 'YOUR_TMDB_API_KEY' with your actual TMDB API key
const apiKey = 'd8fb378b6567392adbfae7049c722249';

// Base URLs for different categories
const baseUrl = 'https://api.themoviedb.org/3/movie';
const categoryUrls = {
    popular: `${baseUrl}/popular?api_key=${apiKey}`,
    topRated: `${baseUrl}/top_rated?api_key=${apiKey}`,
    upcoming: `${baseUrl}/upcoming?api_key=${apiKey}`
};

// Function to fetch and display movies based on category
function fetchMoviesByCategory(category) {
    const url = categoryUrls[category];
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
            updateCategoryTitle(category);
            setActiveLink(category);
        })
        .catch(error => console.error(`Error fetching ${category} movies:`, error));
}

// Function to update the category title
function updateCategoryTitle(category) {
    const categoryTitle = document.getElementById('category-title');
    let titleText = '';
    switch (category) {
        case 'popular':
            titleText = 'Popular Movies';
            break;
        case 'topRated':
            titleText = 'Top Rated Movies';
            break;
        case 'upcoming':
            titleText = 'Upcoming Movies';
            break;
        default:
            titleText = 'Movies';
    }
    categoryTitle.textContent = titleText;
}

// Function to set the active link in the sidebar
function setActiveLink(activeCategory) {
    // Remove 'active' class from all links
    const links = document.querySelectorAll('.categories ul li a');
    links.forEach(link => link.classList.remove('active'));

    // Map category names to link IDs
    const categoryToLinkId = {
        popular: 'popular-link',
        topRated: 'top-rated-link',
        upcoming: 'upcoming-link',
    };

    const linkId = categoryToLinkId[activeCategory];
    const activeLink = document.getElementById(linkId);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}


// Update the displayMovies function if needed
function displayMovies(movies) {
    const moviesContainer = document.getElementById('movies');
    moviesContainer.innerHTML = ''; // Clear any existing content

    if (movies.length === 0) {
        moviesContainer.innerHTML = '<p>No movies found.</p>';
        return;
    }

    movies.forEach(movie => {
        // Create movie card elements
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.dataset.movieId = movie.id; // Store movie ID for later use

        const moviePoster = document.createElement('img');
        if (movie.poster_path) {
            moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
        } else {
            moviePoster.src = 'placeholder.jpg'; // Provide a placeholder image if poster not available
        }
        moviePoster.alt = `${movie.title} Poster`;

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = movie.title;

        const movieRating = document.createElement('p');
        movieRating.textContent = `Rating: ${movie.vote_average}`;

        // Append elements to movie card
        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieRating);

        // Append movie card to container
        moviesContainer.appendChild(movieCard);

        // Add click event listener to the movie card
        movieCard.addEventListener('click', () => {
            console.log("Movie clicked:", movie.title);
            const movieId = movieCard.dataset.movieId;
            fetchMovieDetails(movieId);
        });
    });
}

// Function to fetch and display movie details in a modal
function fetchMovieDetails(movieId) {
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    fetch(movieDetailsUrl)
        .then(response => response.json())
        .then(movie => {
            // Populate modal with movie details
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = ''; // Clear previous content

            // Create elements for movie details
            const backdropPath = movie.backdrop_path || movie.poster_path;
            const movieImage = document.createElement('img');
            if (backdropPath) {
                movieImage.src = `https://image.tmdb.org/t/p/w780${backdropPath}`;
            } else {
                movieImage.src = 'placeholder.jpg'; // Provide a placeholder image if backdrop not available
            }
            movieImage.alt = `${movie.title} Image`;

            const movieTitle = document.createElement('h2');
            movieTitle.textContent = movie.title;

            const movieOverview = document.createElement('p');
            movieOverview.textContent = movie.overview;

            const genresContainer = document.createElement('div');
            genresContainer.classList.add('genres');
            if (movie.genres && movie.genres.length > 0) {
                movie.genres.forEach(genre => {
                    const genreSpan = document.createElement('span');
                    genreSpan.textContent = genre.name;
                    genresContainer.appendChild(genreSpan);
                });
            }

            const rating = document.createElement('p');
            rating.classList.add('rating');
            rating.textContent = `Rating: ${movie.vote_average} / 10`;

            const releaseDate = document.createElement('p');
            releaseDate.classList.add('release-date');
            releaseDate.textContent = `Release Date: ${movie.release_date}`;

            // Append elements to modal body
            modalBody.appendChild(movieImage);
            modalBody.appendChild(movieTitle);
            modalBody.appendChild(rating);
            modalBody.appendChild(releaseDate);
            if (movie.genres && movie.genres.length > 0) {
                modalBody.appendChild(genresContainer);
            }
            modalBody.appendChild(movieOverview);

            // Show the modal
            const modal = document.getElementById('movie-detail-modal');
            modal.style.display = 'block';
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('movie-detail-modal');
    modal.style.display = 'none';
}

// Event listener for closing the modal
document.getElementById('close-modal').addEventListener('click', closeModal);

// Close modal when clicking outside of modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('movie-detail-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Event listeners for sidebar category links
document.getElementById('popular-link').addEventListener('click', function(event) {
    event.preventDefault();
    fetchMoviesByCategory('popular');
});

document.getElementById('top-rated-link').addEventListener('click', function(event) {
    event.preventDefault();
    fetchMoviesByCategory('topRated');
});

document.getElementById('upcoming-link').addEventListener('click', function(event) {
    event.preventDefault();
    fetchMoviesByCategory('upcoming');
});

// Single DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    fetchMoviesByCategory('popular'); // Load popular movies on page load

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keyup', function(event) {
        const query = searchBar.value.trim();
        if (query.length > 0) {
            searchMovies(query);
            updateCategoryTitle('Search Results');
            setActiveLink(null); // Remove active class from category links
        } else {
            fetchMoviesByCategory('popular');
        }
    });
});

// Function to fetch and display movies based on a search query
function searchMovies(query) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`;

    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            displayMovies(data.results);
        })
        .catch(error => console.error('Error searching movies:', error));
}
