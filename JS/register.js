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
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const universityInput = document.getElementById('university');

    let currentStep = 1;
    let skills = [];

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

    // Validation helpers
    function validateName(name) {
        return /^[A-Za-z]{4,}$/.test(name);
    }
    function validatePassword(pw) {
        return (
            pw.length >= 8 &&
            pw.length <= 32 &&
            /[A-Z]/.test(pw) &&
            /[a-z]/.test(pw) &&
            /[^A-Za-z0-9]/.test(pw)
        );
    }

    function validateStep1() {
        let isValid = true;
        if (!firstNameInput?.value.trim() || !validateName(firstNameInput.value.trim())) {
            showError(firstNameInput, 'First name must be at least 4 letters, no numbers.');
            isValid = false;
        } else {
            showSuccess(firstNameInput);
        }
        if (!lastNameInput?.value.trim() || !validateName(lastNameInput.value.trim())) {
            showError(lastNameInput, 'Last name must be at least 4 letters, no numbers.');
            isValid = false;
        } else {
            showSuccess(lastNameInput);
        }
        if (!universityInput?.value.trim()) {
            showError(universityInput, 'University name is required.');
            isValid = false;
        } else {
            showSuccess(universityInput);
        }
        if (!studentIdInput?.value.trim() || !validateStudentId(studentIdInput.value.trim())) { showError(studentIdInput, 'Valid Student ID required (e.g., XXX-XX-XXXX)'); isValid = false; } else { showSuccess(studentIdInput); }
        if (!departmentInput?.value) { showError(departmentInput, 'Department is required'); isValid = false; } else { showSuccess(departmentInput); }
        if (!semesterInput?.value) { showError(semesterInput, 'Semester is required'); isValid = false; } else { showSuccess(semesterInput); }
        return isValid;
    }

    function validateStep2() {
        let isValid = true;
        clearGeneralError();
        if (!emailInput?.value.trim() || !validateEmail(emailInput.value.trim())) { showError(emailInput, 'Valid email is required'); isValid = false; } else { showSuccess(emailInput); }
        
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!validatePassword(password)) {
            showError(passwordInput, 'Password must be 8-32 chars, 1 special, 1 capital, 1 small letter.');
            isValid = false;
        } else {
            showSuccess(passwordInput);
        }

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
    firstNameInput?.addEventListener('input', () => {
        if (!validateName(firstNameInput.value.trim())) {
            showError(firstNameInput, 'First name must be at least 4 letters, only letters allowed.');
        } else {
            showSuccess(firstNameInput);
        }
    });
    lastNameInput?.addEventListener('input', () => {
        if (!validateName(lastNameInput.value.trim())) {
            showError(lastNameInput, 'Last name must be at least 4 letters, only letters allowed.');
        } else {
            showSuccess(lastNameInput);
        }
    });
    universityInput?.addEventListener('input', () => {
        if (!universityInput.value.trim()) {
            showError(universityInput, 'University name is required.');
        } else {
            showSuccess(universityInput);
        }
    });
    studentIdInput?.addEventListener('input', () => {
        if (!validateStudentId(studentIdInput.value.trim())) {
            showError(studentIdInput, 'Student ID must be in format 000-00-0000.');
        } else {
            showSuccess(studentIdInput);
        }
    });
    departmentInput?.addEventListener('change', () => {
        if (!departmentInput.value) {
            showError(departmentInput, 'Please select your department.');
        } else {
            showSuccess(departmentInput);
        }
    });
    semesterInput?.addEventListener('change', () => {
        if (!semesterInput.value) {
            showError(semesterInput, 'Please select your semester.');
        } else {
            showSuccess(semesterInput);
        }
    });
    emailInput?.addEventListener('input', () => {
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Enter a valid email address.');
        } else {
            showSuccess(emailInput);
        }
    });
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
    firstNameInput?.addEventListener('input', () => {
        if (!validateName(firstNameInput.value.trim())) {
            showError(firstNameInput, 'First name must be at least 4 letters, only letters allowed.');
        } else {
            showSuccess(firstNameInput);
        }
    });
    lastNameInput?.addEventListener('input', () => {
        if (!validateName(lastNameInput.value.trim())) {
            showError(lastNameInput, 'Last name must be at least 4 letters, only letters allowed.');
        } else {
            showSuccess(lastNameInput);
        }
    });
    universityInput?.addEventListener('input', () => {
        if (!universityInput.value.trim()) {
            showError(universityInput, 'University name is required.');
        } else {
            showSuccess(universityInput);
        }
    });
    studentIdInput?.addEventListener('input', () => {
        if (!validateStudentId(studentIdInput.value.trim())) {
            showError(studentIdInput, 'Student ID must be in format 000-00-0000.');
        } else {
            showSuccess(studentIdInput);
        }
    });
    departmentInput?.addEventListener('change', () => {
        if (!departmentInput.value) {
            showError(departmentInput, 'Please select your department.');
        } else {
            showSuccess(departmentInput);
        }
    });
    semesterInput?.addEventListener('change', () => {
        if (!semesterInput.value) {
            showError(semesterInput, 'Please select your semester.');
        } else {
            showSuccess(semesterInput);
        }
    });
    emailInput?.addEventListener('input', () => {
        if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, 'Enter a valid email address.');
        } else {
            showSuccess(emailInput);
        }
    });
    passwordInput?.addEventListener('input', () => {
        if (!validatePassword(passwordInput.value)) {
            showError(passwordInput, 'Password must be 8-32 chars, 1 special, 1 capital, 1 small letter.');
        } else {
            showSuccess(passwordInput);
        }
    });
    confirmPasswordInput?.addEventListener('input', () => {
        if (confirmPasswordInput.value !== passwordInput.value || confirmPasswordInput.value === '') {
            showError(confirmPasswordInput, 'Passwords do not match.');
        } else {
            showSuccess(confirmPasswordInput);
        }
    });
    agreeTermsInput?.addEventListener('change', () => {
        if (!agreeTermsInput.checked) {
            showError(agreeTermsInput, 'You must agree to the terms.');
        } else {
            showSuccess(agreeTermsInput);
        }
    });


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

    skillInput?.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && skillInput.value.trim()) {
            e.preventDefault();
            const skill = skillInput.value.trim();
            if (!skills.includes(skill)) {
                skills.push(skill);
                const tag = document.createElement('span');
                tag.className = 'skill-tag';
                tag.textContent = skill;
                const removeBtn = document.createElement('button');
                removeBtn.className = 'skill-remove';
                removeBtn.textContent = '×';
                removeBtn.onclick = function() {
                    skills = skills.filter(s => s !== skill);
                    tag.remove();
                    // Trigger validation
                    skillsList.dispatchEvent(new Event('DOMSubtreeModified'));
                };
                tag.appendChild(removeBtn);
                skillsList.appendChild(tag);
                skillInput.value = '';
                // Trigger validation
                skillsList.dispatchEvent(new Event('DOMSubtreeModified'));
            } else {
                showError(skillInput, 'Skill already added.');
            }
        }
    });

    const congratsModal = document.getElementById('congratsModal');
    const goToLoginBtn = document.getElementById('goToLoginBtn');

    

    goToLoginBtn?.addEventListener('click', () => {
        window.location.href = 'login.html';
    });

    // Initial setup
    if (step1 && step2 && progressFill && progressText) {
       updateProgress();
    }
    if (skillsList && skillsHidden) { // Also render skills if elements exist
        renderSkills();
    }
});

// Email live validation
emailInput?.addEventListener('input', () => {
    if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, 'Enter a valid email address.');
    } else {
        showSuccess(emailInput);
    }
});

// Password live validation
passwordInput?.addEventListener('input', () => {
    if (!validatePassword(passwordInput.value)) {
        showError(passwordInput, 'Password must be 8-32 chars, 1 special, 1 capital, 1 small letter.');
    } else {
        showSuccess(passwordInput);
    }
    // Also check confirm password if user is typing password
    if (confirmPasswordInput.value) {
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError(confirmPasswordInput, 'Passwords do not match.');
        } else {
            showSuccess(confirmPasswordInput);
        }
    }
});

// Confirm Password live validation
confirmPasswordInput?.addEventListener('input', () => {
    if (confirmPasswordInput.value !== passwordInput.value || confirmPasswordInput.value === '') {
        showError(confirmPasswordInput, 'Passwords do not match.');
    } else {
        showSuccess(confirmPasswordInput);
    }
});

// Skills & Interests live validation (require at least one skill)
skillsList?.addEventListener('DOMSubtreeModified', () => {
    if (!skillsList.textContent.trim()) {
        showError(skillInput, 'Please add at least one skill.');
    } else {
        showSuccess(skillInput);
    }
});

// Agreement to Terms live validation
agreeTermsInput?.addEventListener('change', () => {
    if (!agreeTermsInput.checked) {
        showError(agreeTermsInput, 'You must agree to the terms.');
    } else {
        showSuccess(agreeTermsInput);
    }
});

const skillCheckboxes = document.querySelectorAll('input[name="skills"]');
const otherSkillInput = document.getElementById('otherSkill');
const skillsError = document.getElementById('skillsError');

function validateSkills() {
    const checked = Array.from(skillCheckboxes).some(cb => cb.checked);
    const other = otherSkillInput.value.trim();
    if (!checked && !other) {
        skillsError.textContent = 'Please select at least one skill or enter another.';
        return false;
    } else {
        skillsError.textContent = '';
        return true;
    }
}

// Live validation
skillCheckboxes.forEach(cb => {
    cb.addEventListener('change', validateSkills);
});
otherSkillInput?.addEventListener('input', validateSkills);
