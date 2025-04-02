// DOM Elements
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberMeCheckbox = document.getElementById('rememberMe');
const togglePasswordBtn = document.getElementById('togglePassword');
const authAlert = document.getElementById('authAlert');

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Check if user is already logged in
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (isLoggedIn && rememberMe === 'true') {
        // Redirect to exam results page
        window.location.href = 'exam.html';
    }
}

// Toggle password visibility
togglePasswordBtn.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Toggle eye icon
    const icon = togglePasswordBtn.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Handle login form submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Reset previous alerts
    authAlert.className = 'auth-alert';
    authAlert.textContent = '';
    authAlert.style.display = 'none';
    
    // Basic validation
    if (!email || !password) {
        showAlert('Please enter both email and password.', 'error');
        return;
    }
    
    // Email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showAlert('Please enter a valid email address.', 'error');
        return;
    }
    
    // For demo purposes, we'll use a mock authentication
    // In a real application, this would be handled by a server
    if (mockAuthenticate(email, password)) {
        // Store login state if remember me is checked
        if (rememberMe) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('userEmail', email);
        } else {
            // For session only
            sessionStorage.setItem('isLoggedIn', 'true');
            sessionStorage.setItem('userEmail', email);
            
            // Clear any previous local storage
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userEmail');
        }
        
        showAlert('Login successful! Redirecting...', 'success');
        
        // Redirect to exam results page after a brief delay
        setTimeout(() => {
            window.location.href = 'exam.html';
        }, 1500);
    } else {
        showAlert('Invalid email or password. Please try again.', 'error');
    }
});

// Show alert message
function showAlert(message, type) {
    authAlert.textContent = message;
    authAlert.className = 'auth-alert ' + type;
    authAlert.style.display = 'block';
}

// Mock authentication function
function mockAuthenticate(email, password) {
    // In a real application, this would validate against a server
    // For demo purposes, we'll accept any email with a password length of at least 6 characters
    return password.length >= 6;
}

// Load saved email if remember me was checked
function loadSavedCredentials() {
    const savedEmail = localStorage.getItem('userEmail');
    const rememberMe = localStorage.getItem('rememberMe');
    
    if (savedEmail && rememberMe === 'true') {
        emailInput.value = savedEmail;
        rememberMeCheckbox.checked = true;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    loadSavedCredentials();
}); 