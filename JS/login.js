// js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const buttonText = submitBtn ? submitBtn.querySelector('.button-text') : null;
    const buttonLoading = submitBtn ? submitBtn.querySelector('.button-loading') : null;
    
    // Create a general error message element if it doesn't exist in HTML
    let generalErrorMessageElement = document.getElementById('generalLoginError');
    if (!generalErrorMessageElement && loginForm) {
        generalErrorMessageElement = document.createElement('p');
        generalErrorMessageElement.id = 'generalLoginError';
        generalErrorMessageElement.className = 'error-message general-error'; // For styling
        generalErrorMessageElement.style.textAlign = 'center';
        generalErrorMessageElement.style.marginTop = '1rem';
        // Insert it before the social sign-in buttons or after the main sign-in button
        const dividerSection = loginForm.querySelector('.divider-section');
        if (dividerSection) {
            loginForm.insertBefore(generalErrorMessageElement, dividerSection);
        } else if (submitBtn) {
            submitBtn.parentNode.insertBefore(generalErrorMessageElement, submitBtn.nextSibling);
        } else {
            loginForm.appendChild(generalErrorMessageElement);
        }
    }


    // Password visibility toggle
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.innerHTML = isPassword ?
                `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` :
                `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        });
    }

    // Form validation functions
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) errorElement.textContent = message;
        input.classList.add('error');
        input.classList.remove('success');
    }

    function showSuccess(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) errorElement.textContent = '';
        input.classList.remove('error');
        input.classList.add('success');
    }
    
    function clearGeneralError() {
        if (generalErrorMessageElement) generalErrorMessageElement.textContent = '';
    }

    function showGeneralError(message) {
        if (generalErrorMessageElement) generalErrorMessageElement.textContent = message;
    }


    function validateForm() {
        let isValid = true;
        clearGeneralError(); // Clear previous general errors

        const email = emailInput.value.trim();
        if (!email) {
            showError(emailInput, 'Please enter your email address');
            isValid = false;
        } else if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            isValid = false;
        } else {
            showSuccess(emailInput);
        }

        const password = passwordInput.value;
        if (!password) {
            showError(passwordInput, 'Please enter your password');
            isValid = false;
        } else if (password.length < 6) { // Match backend User model minlength
            showError(passwordInput, 'Password must be at least 6 characters long');
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }
        return isValid;
    }

    // Real-time validation (simplified)
    emailInput?.addEventListener('input', () => { if (emailInput.value.trim() && validateEmail(emailInput.value.trim())) showSuccess(emailInput); });
    passwordInput?.addEventListener('input', () => { if (passwordInput.value.length >= 6) showSuccess(passwordInput); });

   
});
