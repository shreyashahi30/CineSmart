document.getElementById('chatbot-button').addEventListener('click', function() {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer.style.display === 'none' || chatContainer.style.display === '') {
        chatContainer.style.display = 'block';
    } else {
        chatContainer.style.display = 'none';
    }
});
// Get modals
var signupModal = document.getElementById("signup-modal");
var loginModal = document.getElementById("login-modal");

// Get buttons that open the modals
var signupBtn = document.getElementById("signup-button");
var loginBtn = document.getElementById("login-button");

// Get <span> elements that close the modals
var closeSignup = document.getElementById("close-signup");
var closeLogin = document.getElementById("close-login");

// Get <a> elements to switch modals
var goToLogin = document.getElementById("go-to-login");
var goToSignup = document.getElementById("go-to-signup");

// When the user clicks the signup button, open the modal
signupBtn.onclick = function() {
    signupModal.style.display = "block";
}

// When the user clicks the login button, open the modal
loginBtn.onclick = function() {
    loginModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
closeSignup.onclick = function() {
    signupModal.style.display = "none";
}

closeLogin.onclick = function() {
    loginModal.style.display = "none";
}

// Switch to login modal
goToLogin.onclick = function() {
    signupModal.style.display = "none";
    loginModal.style.display = "block";
}

// Switch to signup modal
goToSignup.onclick = function() {
    loginModal.style.display = "none";
    signupModal.style.display = "block";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == signupModal) {
        signupModal.style.display = "none";
    }
    if (event.target == loginModal) {
        loginModal.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const chatbotButton = document.getElementById('chatbot-button');

    chatbotButton.addEventListener('click', function() {
        window.open('https://mediafiles.botpress.cloud/7d8c96e0-f4bf-4924-9274-f6fe28185ead/webchat/bot.html', 'CineBot', 'width=400,height=600');
    });
});

