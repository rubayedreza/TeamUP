document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    let currentStep = 1;

    // Validation helpers
    function showError(input, message) {
        const errorSpan = document.getElementById(input.id + "Error");
        if (errorSpan) errorSpan.textContent = message;
        input.classList.add('error');
    }

    function showSuccess(input) {
        const errorSpan = document.getElementById(input.id + "Error");
        if (errorSpan) errorSpan.textContent = "";
        input.classList.remove('error');
        input.classList.add('success');
    }

    function validateName(name) {
        return /^[A-Za-z]{4,}$/.test(name.trim());
    }

    function validateStudentId(id) {
        return /^\d{3}-\d{2}-\d{4}$/.test(id.trim());
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    }

    function validatePassword(pw) {
        return (
            pw.length >= 8 &&
            /[A-Z]/.test(pw) &&
            /[a-z]/.test(pw) &&
            /\d/.test(pw) &&
            /[^A-Za-z0-9]/.test(pw)
        );
    }

    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');

    togglePassword?.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.textContent = type === 'password' ? '👁' : '🙈'; // eye / closed eye
    });

    // Toggle confirm password visibility
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    toggleConfirmPassword?.addEventListener('click', () => {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        toggleConfirmPassword.textContent = type === 'password' ? '👁' : '🙈';
    });


    // Step 1 validation
    function validateStep1() {
        let valid = true;
        const firstName = document.getElementById('firstName');
        if (!validateName(firstName.value)) {
            showError(firstName, "First name must be more than 3 letters");
            valid = false;
        } else showSuccess(firstName);

        const lastName = document.getElementById('lastName');
        if (!validateName(lastName.value)) {
            showError(lastName, "Last name must be more than 3 letters");
            valid = false;
        } else showSuccess(lastName);

        const university = document.getElementById('university');
        if (!university.value.trim()) {
            showError(university, "University is required");
            valid = false;
        } else showSuccess(university);

        const studentId = document.getElementById('studentId');
        if (!validateStudentId(studentId.value)) {
            showError(studentId, "Student ID must be in format 221-15-4869");
            valid = false;
        } else showSuccess(studentId);

        const department = document.getElementById('department');
        if (!department.value) {
            showError(department, "Select a department");
            valid = false;
        } else showSuccess(department);

        const semester = document.getElementById('semester');
        if (!semester.value) {
            showError(semester, "Select a semester");
            valid = false;
        } else showSuccess(semester);

        return valid;
    }

    // Step 2 validation
    function validateStep2() {
        let valid = true;

        const email = document.getElementById('email');
        if (!validateEmail(email.value)) {
            showError(email, "Enter a valid email address");
            valid = false;
        } else showSuccess(email);

        const password = document.getElementById('password');
        if (!validatePassword(password.value)) {
            showError(password, "Password must be 8+ chars with uppercase, lowercase, number, special char");
            valid = false;
        } else showSuccess(password);

        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword.value !== password.value || confirmPassword.value === "") {
            showError(confirmPassword, "Passwords do not match");
            valid = false;
        } else showSuccess(confirmPassword);

        const agreeTerms = document.getElementById('agreeTerms');
        if (!agreeTerms.checked) {
            showError(agreeTerms, "You must agree to the terms");
            valid = false;
        } else showSuccess(agreeTerms);

        return valid;
    }

    // Live validation events
    document.getElementById('firstName').addEventListener('input', (e) => {
        validateName(e.target.value) ? showSuccess(e.target) : showError(e.target, "First name must be more than 3 letters");
    });

    document.getElementById('lastName').addEventListener('input', (e) => {
        validateName(e.target.value) ? showSuccess(e.target) : showError(e.target, "Last name must be more than 3 letters");
    });

    document.getElementById('university').addEventListener('input', (e) => {
        e.target.value.trim() ? showSuccess(e.target) : showError(e.target, "University is required");
    });

    document.getElementById('studentId').addEventListener('input', (e) => {
        validateStudentId(e.target.value) ? showSuccess(e.target) : showError(e.target, "Format: 221-15-4869");
    });

    document.getElementById('department').addEventListener('change', (e) => {
        e.target.value ? showSuccess(e.target) : showError(e.target, "Select a department");
    });

    document.getElementById('semester').addEventListener('change', (e) => {
        e.target.value ? showSuccess(e.target) : showError(e.target, "Select a semester");
    });

    document.getElementById('email').addEventListener('input', (e) => {
        validateEmail(e.target.value) ? showSuccess(e.target) : showError(e.target, "Enter a valid email address");
    });

    document.getElementById('password').addEventListener('input', (e) => {
        validatePassword(e.target.value) ? showSuccess(e.target) : showError(e.target, "Password must be 8+ chars, uppercase, lowercase, number, special char");
    });

    document.getElementById('confirmPassword').addEventListener('input', (e) => {
        e.target.value === document.getElementById('password').value && e.target.value !== "" 
            ? showSuccess(e.target) 
            : showError(e.target, "Passwords do not match");
    });

    document.getElementById('agreeTerms').addEventListener('change', (e) => {
        e.target.checked ? showSuccess(e.target) : showError(e.target, "You must agree to the terms");
    });

    // Progress bar update
    function updateProgress() {
        if (currentStep === 1) {
            progressFill.style.width = "50%";
            progressText.textContent = "Step 1 of 2: Personal Information";
            step1.classList.add('active');
            step2.classList.remove('active');
        } else {
            progressFill.style.width = "100%";
            progressText.textContent = "Step 2 of 2: Account & Skills";
            step1.classList.remove('active');
            step2.classList.add('active');
        }
    }

    // Button handlers
    nextBtn.addEventListener('click', () => {
        if (validateStep1()) {
            currentStep = 2;
            updateProgress();
        }
    });

    prevBtn.addEventListener('click', () => {
        currentStep = 1;
        updateProgress();
    });

    // Final form submit
    form.addEventListener('submit', (e) => {
        if (!validateStep2()) {
            e.preventDefault();
        }
    });

    // Initial load
    updateProgress();
});
