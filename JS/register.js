// js/register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const buttonText = submitBtn ? submitBtn.querySelector('.button-text') : null;
    const buttonLoading = submitBtn ? submitBtn.querySelector('.button-loading') : null;

    const fullNameInput = document.getElementById('fullName');
    const studentIdInput = document.getElementById('studentId');
    const departmentInput = document.getElementById('department');
    const semesterInput = document.getElementById('semester');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordStrengthIndicator = document.getElementById('passwordStrength');
    const agreeTermsInput = document.getElementById('agreeTerms');
    const skillInput = document.getElementById('skillInput');
    const skillsList = document.getElementById('skillsList');
    const skillsHidden = document.getElementById('skills'); // For UI, not sent to backend yet

    let currentStep = 1;
    let skills = []; // For UI, not sent to backend yet

    // Create a general error message element if it doesn't exist in HTML
    let generalErrorMessageElement = document.getElementById('generalRegisterError');
    if (!generalErrorMessageElement && registerForm) {
        generalErrorMessageElement = document.createElement('p');
        generalErrorMessageElement.id = 'generalRegisterError';
        generalErrorMessageElement.className = 'error-message general-error';
        generalErrorMessageElement.style.textAlign = 'center';
        generalErrorMessageElement.style.marginTop = '1rem';
        // Insert before the form buttons in step 2, or another suitable place
        const formButtonsStep2 = step2 ? step2.querySelector('.form-buttons') : null;
        if (formButtonsStep2) {
            step2.insertBefore(generalErrorMessageElement, formButtonsStep2);
        } else if (submitBtn && submitBtn.parentElement) {
             submitBtn.parentElement.insertBefore(generalErrorMessageElement, submitBtn);
        } else if (registerForm) {
            registerForm.appendChild(generalErrorMessageElement);
        }
    }


    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            this.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
            this.innerHTML = isPassword ?
                `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>` :
                `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        });
    }

    function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
    function validateStudentId(id) { return /^\d{3}-\d{2}-\d{4}$/.test(id); } // UI validation only

    function getPasswordStrength(password) {
        let score = 0;
        if (password.length >= 6) score++; // Match backend User model minlength
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z\d\s]/.test(password)) score++;
        if (score === 5) return { strength: 'strong', text: 'Strong password' };
        if (score >= 3) return { strength: 'medium', text: 'Medium password' };
        return { strength: 'weak', text: 'Weak password' };
    }

    function showError(input, message) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) errorElement.textContent = message;
        if (input) { input.classList.add('error'); input.classList.remove('success'); }
    }

    function showSuccess(input) {
        const errorElement = document.getElementById(input.id + 'Error');
        if (errorElement) errorElement.textContent = '';
        if (input) { input.classList.remove('error'); input.classList.add('success'); }
    }
    
    function clearGeneralError() {
        if (generalErrorMessageElement) generalErrorMessageElement.textContent = '';
    }

    function showGeneralError(message) {
        if (generalErrorMessageElement) generalErrorMessageElement.textContent = message;
    }

    function validateStep1() {
        let isValid = true;
        if (!fullNameInput?.value.trim()) { showError(fullNameInput, 'Full name is required'); isValid = false; } else { showSuccess(fullNameInput); }
        if (!studentIdInput?.value.trim() || !validateStudentId(studentIdInput.value.trim())) { showError(studentIdInput, 'Valid Student ID required (e.g., XXX-XX-XXXX)'); isValid = false; } else { showSuccess(studentIdInput); }
        if (!departmentInput?.value) { showError(departmentInput, 'Department is required'); isValid = false; } else { showSuccess(departmentInput); }
        if (!semesterInput?.value) { showError(semesterInput, 'Semester is required'); isValid = false; } else { showSuccess(semesterInput); }
        return isValid;
    }

    function validateStep2() {
        let isValid = true;
        clearGeneralError(); // Clear previous general errors
        if (!emailInput?.value.trim() || !validateEmail(emailInput.value.trim())) { showError(emailInput, 'Valid email is required'); isValid = false; } else { showSuccess(emailInput); }
        
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password.length < 6) { showError(passwordInput, 'Password must be at least 6 characters'); isValid = false; }
        else if (getPasswordStrength(password).strength === 'weak') { showError(passwordInput, 'Please create a stronger password'); isValid = false;}
        else { showSuccess(passwordInput); }

        if (confirmPassword === '') { showError(confirmPasswordInput, 'Please confirm your password'); isValid = false; }
        else if (password !== confirmPassword) { showError(confirmPasswordInput, 'Passwords do not match'); isValid = false; }
        else { showSuccess(confirmPasswordInput); }

        if (!agreeTermsInput?.checked) { showError(agreeTermsInput, 'You must agree to the terms'); isValid = false; } else { showSuccess(agreeTermsInput); }
        return isValid;
    }
    
    // Simplified real-time validation listeners
    fullNameInput?.addEventListener('input', () => { if (fullNameInput.value.trim()) showSuccess(fullNameInput); });
    studentIdInput?.addEventListener('input', () => { if (validateStudentId(studentIdInput.value.trim())) showSuccess(studentIdInput); });
    departmentInput?.addEventListener('change', () => { if (departmentInput.value) showSuccess(departmentInput); });
    semesterInput?.addEventListener('change', () => { if (semesterInput.value) showSuccess(semesterInput); });
    emailInput?.addEventListener('input', () => { if (validateEmail(emailInput.value.trim())) showSuccess(emailInput); });
    passwordInput?.addEventListener('input', () => {
        const strength = getPasswordStrength(passwordInput.value);
        if(passwordStrengthIndicator) passwordStrengthIndicator.textContent = strength.text;
        if(passwordStrengthIndicator) passwordStrengthIndicator.className = 'password-strength ' + strength.strength;
        if (passwordInput.value.length >= 6 && strength.strength !== 'weak') showSuccess(passwordInput);
        if (confirmPasswordInput.value) validateConfirmPasswordRealtime();
    });
    confirmPasswordInput?.addEventListener('input', validateConfirmPasswordRealtime);
    function validateConfirmPasswordRealtime() {
        if (confirmPasswordInput.value === passwordInput.value && confirmPasswordInput.value) showSuccess(confirmPasswordInput);
        else if (confirmPasswordInput.value) showError(confirmPasswordInput, 'Passwords do not match');
    }
    agreeTermsInput?.addEventListener('change', () => { if (agreeTermsInput.checked) showSuccess(agreeTermsInput); });


    function updateProgress() {
        if (!step1 || !step2 || !progressFill || !progressText) return;
        if (currentStep === 1) {
            progressFill.style.width = '50%';
            progressText.textContent = 'Step 1 of 2: Personal Information';
            step1.classList.add('active');
            step2.classList.remove('active');
        } else {
            progressFill.style.width = '100%';
            progressText.textContent = 'Step 2 of 2: Account & Skills';
            step1.classList.remove('active');
            step2.classList.add('active');
        }
    }

    nextBtn?.addEventListener('click', () => {
        if (currentStep === 1 && validateStep1()) {
            currentStep = 2;
            updateProgress();
        }
    });

    prevBtn?.addEventListener('click', () => {
        currentStep = 1;
        updateProgress();
    });

    skillInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && skillInput.value.trim() !== '') {
            e.preventDefault();
            const skill = skillInput.value.trim();
            if (!skills.includes(skill) && skills.length < 10) { // Limit number of skills
                skills.push(skill);
                renderSkills();
                skillInput.value = '';
            } else if (skills.length >= 10) {
                alert('You can add a maximum of 10 skills.');
            }
        }
    });

    function renderSkills() {
        if (!skillsList || !skillsHidden) return;
        skillsList.innerHTML = '';
        skills.forEach((skill, index) => {
            const skillTag = document.createElement('span');
            skillTag.className = 'skill-tag';
            skillTag.innerHTML = `${skill} <button type="button" class="skill-remove" data-index="${index}" aria-label="Remove skill ${skill}">&times;</button>`;
            skillsList.appendChild(skillTag);
        });
        skillsHidden.value = JSON.stringify(skills); // For UI, not sent to backend yet
    }

    skillsList?.addEventListener('click', (e) => {
        if (e.target.classList.contains('skill-remove')) {
            const indexToRemove = parseInt(e.target.dataset.index);
            skills.splice(indexToRemove, 1);
            renderSkills();
        }
    });

    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            // If on step 1 and submit is triggered (e.g. by pressing Enter in a field),
            // behave like "Next" button.
            if (currentStep === 1) {
                if (validateStep1()) {
                    currentStep = 2;
                    updateProgress();
                }
                return; 
            }

            // Only proceed to API call if on step 2 and step 2 is valid
            if (currentStep === 2 && !validateStep2()) {
                 return;
            }


            if (buttonText) buttonText.style.display = 'none';
            if (buttonLoading) buttonLoading.classList.remove('hidden');
            if (submitBtn) submitBtn.disabled = true;
            clearGeneralError();

            // IMPORTANT: Add a 'Username' input field to your register.html (Step 2).
            // For now, deriving a simple username. This needs to be replaced.
            const derivedUsername = emailInput.value.trim().split('@')[0] + Math.floor(Math.random() * 1000);

            const backendPayload = {
                fullName: fullNameInput.value.trim(),
                username: derivedUsername, // REPLACE THIS with value from your new Username input field
                email: emailInput.value.trim(),
                password: passwordInput.value
                // Student ID, Department, Semester, Skills are NOT sent to the current backend User model.
                // To include them, you'd need to:
                // 1. Add these fields to your Mongoose User schema on the backend.
                // 2. Update the backend /api/users/register route to accept and save them.
                // 3. Add them to this backendPayload.
            };

            try {
                const response = await fetch('http://localhost:3001/api/users/register', { // YOUR BACKEND REGISTER URL
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(backendPayload)
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    // Registration successful, token received for auto-login
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('userData', JSON.stringify(data.user));
                    // alert('Registration successful! You are now logged in.'); // Optional alert
                    window.location.href = 'dashboard.html'; // Redirect to dashboard
                } else {
                    // Show error message from backend
                    showGeneralError(data.message || 'Registration failed. Please try again.');
                }

            } catch (error) {
                console.error('Registration error:', error);
                showGeneralError('Registration failed. Please check your connection and try again.');
            } finally {
                if (buttonText) buttonText.style.display = 'block';
                if (buttonLoading) buttonLoading.classList.add('hidden');
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

    // Initial setup
    if (step1 && step2 && progressFill && progressText) {
       updateProgress();
    }
    if (skillsList && skillsHidden) { // Also render skills if elements exist
        renderSkills();
    }
});
