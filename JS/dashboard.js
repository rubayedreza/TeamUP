// Profile photo upload
document.getElementById('profilePhotoInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            document.getElementById('profilePhoto').src = evt.target.result;
        };
        reader.readAsDataURL(file);
    }
});

// Logout button
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('loggedIn');
    window.location.href = 'login.html';
});