// main/static/main/js/script.js

// Replace 'YOUR_TMDB_API_KEY' with your actual TMDB API key
const apiKey = 'd8fb378b6567392adbfae7049c722249';
const popularMoviesUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;

// Function to fetch and display popular movies
function fetchPopularMovies() {
    fetch(popularMoviesUrl)
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const moviesContainer = document.getElementById('movies');
            moviesContainer.innerHTML = ''; // Clear any existing content

            movies.forEach(movie => {
                // Create movie card elements
                const movieCard = document.createElement('div');
                movieCard.classList.add('movie-card');
                movieCard.dataset.movieId = movie.id; // Store movie ID for later use

                const moviePoster = document.createElement('img');
                moviePoster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
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
                    console.log("Movie clicked:", movie.title)
                    const movieId = movieCard.dataset.movieId;
                    fetchMovieDetails(movieId);
                });
            });
        })
        .catch(error => console.error('Error fetching popular movies:', error));
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
            movieImage.src = `https://image.tmdb.org/t/p/w780${backdropPath}`;
            movieImage.alt = `${movie.title} Image`;

            const movieTitle = document.createElement('h2');
            movieTitle.textContent = movie.title;

            const movieOverview = document.createElement('p');
            movieOverview.textContent = movie.overview;

            const genresContainer = document.createElement('div');
            genresContainer.classList.add('genres');
            movie.genres.forEach(genre => {
                const genreSpan = document.createElement('span');
                genreSpan.textContent = genre.name;
                genresContainer.appendChild(genreSpan);
            });

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
            modalBody.appendChild(genresContainer);
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
const closeModalBtn = document.getElementById('close-modal');
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

// Close modal when clicking outside of modal content
window.addEventListener('click', function(event) {
    const modal = document.getElementById('movie-detail-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Function to handle authentication modals and messages
function handleAuthModalsAndMessages() {
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const signupBtn = document.getElementById('signup-button');
    const loginBtn = document.getElementById('login-button');
    const closeSignup = document.getElementById('close-signup');
    const closeLogin = document.getElementById('close-login');
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');

    // Open Signup Modal
    if (signupBtn) {
        signupBtn.onclick = function () {
            signupModal.style.display = 'block';
        };
    }

    // Open Login Modal
    if (loginBtn) {
        loginBtn.onclick = function () {
            loginModal.style.display = 'block';
        };
    }

    // Close Signup Modal
    if (closeSignup) {
        closeSignup.onclick = function () {
            signupModal.style.display = 'none';
        };
    }

    // Close Login Modal
    if (closeLogin) {
        closeLogin.onclick = function () {
            loginModal.style.display = 'none';
        };
    }

    // Switch to Signup Modal from Login Modal
    if (goToSignup) {
        goToSignup.onclick = function () {
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        };
    }

    // Switch to Login Modal from Signup Modal
    if (goToLogin) {
        goToLogin.onclick = function () {
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        };
    }

    // Close modals when clicking outside of them
    window.onclick = function (event) {
        if (event.target == signupModal) {
            signupModal.style.display = 'none';
        }
        if (event.target == loginModal) {
            loginModal.style.display = 'none';
        }
    };

    // Handle search input
    const searchBar = document.getElementById('search-bar');
    const movieList = document.getElementById('movies');

    if (searchBar && movieList) {
        searchBar.addEventListener('input', function () {
            const query = searchBar.value.toLowerCase();
            if (query) {
                movieList.innerHTML = `<p>Searching for "${query}"...</p>`;
            } else {
                movieList.innerHTML = '';
            }
        });
    }

    // Chatbot functionality
    const chatbotButton = document.getElementById('chatbot-button');
    if (chatbotButton) {
        chatbotButton.addEventListener('click', function() {
            const width = 300;
            const height = 600;
            const left = screen.width - width;
            const top = (screen.height / 2) - (height / 2);

            window.open(
                'https://mediafiles.botpress.cloud/7d8c96e0-f4bf-4924-9274-f6fe28185ead/webchat/bot.html', 
                'CineBot', 
                `width=${width},height=${height},top=${top},left=${left}`
            );
        });
    }

    // Handle automatic modal closing/opening based on messages
    const messages = document.querySelectorAll('.message');

    messages.forEach(function(message) {
        // Listen for the end of the fadeout animation to remove the message
        message.addEventListener('animationend', function(event) {
            if (event.animationName === 'fadeout') {
                message.remove();
            }
        });

        // Automatically close any open modal upon success
        if (message.classList.contains('success')) {
            signupModal.style.display = 'none';
            loginModal.style.display = 'none';
        }

        // Reopen the respective modal if there's an error related to signup or login
        if (message.classList.contains('danger') || message.classList.contains('error')) {  // 'danger' corresponds to 'error' in MESSAGE_TAGS
            const errorText = message.textContent.toLowerCase();

            if (errorText.includes('signup')) {
                signupModal.style.display = 'block';
            } else if (errorText.includes('login')) {
                loginModal.style.display = 'block';
            }
        }
    });
}

// Initialize all functionalities once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    fetchPopularMovies();
    handleAuthModalsAndMessages();
});
