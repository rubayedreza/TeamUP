document.addEventListener('DOMContentLoaded', () => {
    const profilePhotoInput = document.getElementById('profilePhotoInput');
    const profilePhoto = document.getElementById('profilePhoto');
    const logoutBtn = document.getElementById('logoutBtn');

    if (profilePhotoInput && profilePhoto) {
        profilePhoto.addEventListener('click', () => profilePhotoInput.click());

        profilePhotoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(evt) {
                    profilePhoto.src = evt.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = '../PHP/logout.php';
        });
    }

    const chatFab = document.getElementById('chatFab');
    const chatWidget = document.getElementById('chatWidget');
    const closeChatBtn = document.getElementById('closeChatBtn');

    if (chatFab && chatWidget) {
        chatFab.addEventListener('click', () => {
            chatWidget.classList.toggle('active');
        });
    }

    if (closeChatBtn && chatWidget) {
        closeChatBtn.addEventListener('click', () => {
            chatWidget.classList.remove('active');
        });
    }
});
