document.addEventListener('DOMContentLoaded', function() {
    // ... (all your other existing code at the top of the file remains the same)

    document.querySelectorAll('a.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const browseProjectsBtn = document.getElementById('browseProjectsBtn');
    if (browseProjectsBtn) {
        browseProjectsBtn.addEventListener('click', () => {
             const featuredSection = document.getElementById('featured');
             if (featuredSection) {
                 featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
             }
        });
    }

    const searchInput = document.getElementById('searchInput');
    const skillFilter = document.getElementById('skillFilter');
    const projectCards = document.querySelectorAll('.project-card');

    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSkill = skillFilter.value.toLowerCase();

        projectCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardSkills = card.dataset.skills || '';
            
            const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
            const matchesSkill = selectedSkill === '' || cardSkills.includes(selectedSkill);
            
            if (matchesSearch && matchesSkill) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
    if(searchInput) searchInput.addEventListener('input', filterProjects);
    if(skillFilter) skillFilter.addEventListener('change', filterProjects);

    const modal = document.getElementById('interestModal');
    const closeBtn = modal.querySelector('.close');
    const projectOwnerSpan = document.getElementById('projectOwner');

    function showInterestModal(ownerName) {
        if (projectOwnerSpan) projectOwnerSpan.textContent = ownerName;
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);

    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    const modalSignInBtn = document.getElementById('modalSignInBtn');
    if(modalSignInBtn) modalSignInBtn.addEventListener('click', () => { window.location.href='HTML/login.html' });
    
    const modalCreateAccountBtn = document.getElementById('modalCreateAccountBtn');
    if(modalCreateAccountBtn) modalCreateAccountBtn.addEventListener('click', () => { window.location.href='HTML/register.html' });

    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNavLinks = document.getElementById('mainNavLinks');

    if (mobileMenuToggle && mainNavLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            const isExpanded = mobileMenuToggle.getAttribute('aria-expanded') === 'true';
            mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
            mainNavLinks.classList.toggle('active');
        });
    }

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.fade-in-up');
    animatableElements.forEach(el => observer.observe(el));

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const allProjectCards = document.querySelectorAll('.project-card');
    allProjectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });

    const header = document.querySelector('.header');
    if(header){
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(15, 15, 35, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(15, 15, 35, 0.95)';
                header.style.boxShadow = 'none';
            }
        });
    }
    
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const loginBtn = document.getElementById('loginBtn');
    const dashboardLink = document.getElementById('dashboardLink');

    if (isLoggedIn === 'true') {
        if (loginBtn) {
            loginBtn.textContent = 'Logout';
            loginBtn.href = 'PHP/logout.php'; // Point directly to logout script
            loginBtn.addEventListener('click', function(e) {
                sessionStorage.removeItem('isLoggedIn');
            });
        }
    }

    if (dashboardLink) {
        dashboardLink.addEventListener('click', function(event) {
            const isLoggedInOnClick = sessionStorage.getItem('isLoggedIn');
            if (isLoggedInOnClick !== 'true') {
                event.preventDefault(); 
                alert('Please sign in to access the dashboard.');
            }
        });
    }

    document.querySelectorAll('.btn-view-profile').forEach(button => {
        button.addEventListener('click', () => {
            const profileId = button.dataset.profileId;
            window.location.href = `HTML/profile.php?id=${profileId}`;
        });
    });

    // === CORRECTED "SHOW INTEREST" LOGIC ===
    document.querySelectorAll('.btn-show-interest').forEach(button => {
        button.addEventListener('click', function() {
            const isLoggedInOnClick = sessionStorage.getItem('isLoggedIn');
            
            if (isLoggedInOnClick === 'true') {
                const postId = this.dataset.postId;

                // CORRECTED PATH: The 'fetch' path is relative to the HTML file (index.php),
                // so we go directly into the PHP folder.
                fetch('PHP/like_post.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ post_id: postId })
                })
                .then(response => {
                    if (!response.ok) {
                        // If the server response is not OK (e.g., 404, 500), throw an error
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        // Toggle the 'liked' class based on the server's response
                        if (data.liked) {
                            this.classList.add('liked');
                        } else {
                            this.classList.remove('liked');
                        }
                    } else {
                        // This alert is for application-level errors (e.g., database query failed)
                        alert('Something went wrong. Please try again.');
                    }
                })
                .catch(error => {
                    // This 'catch' block handles network errors or issues with the fetch itself
                    console.error('Error:', error);
                    alert('An error occurred while processing your request.');
                });

            } else {
                // If the user is NOT logged in, show the sign-in modal.
                const ownerName = this.dataset.owner;
                showInterestModal(ownerName);
            }
        });
    });
});
