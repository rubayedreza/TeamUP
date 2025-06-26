        // Smooth scrolling for navigation
        function scrollToSection(sectionId) {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        // Search and filter functionality
        const searchInput = document.getElementById('searchInput');
        const skillFilter = document.getElementById('skillFilter');
        const cardContainer = document.getElementById('cardContainer');
        const projectCards = document.querySelectorAll('.project-card');

        function filterProjects() {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedSkill = skillFilter.value.toLowerCase();

            projectCards.forEach(card => {
                const cardText = card.textContent.toLowerCase();
                const cardSkills = card.getAttribute('data-skills') || '';
                
                const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
                const matchesSkill = selectedSkill === '' || cardSkills.includes(selectedSkill);
                
                if (matchesSearch && matchesSkill) {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        searchInput.addEventListener('input', filterProjects);
        skillFilter.addEventListener('change', filterProjects);

        // Modal functionality
        const modal = document.getElementById('interestModal');
        const closeBtn = document.querySelector('.close');
        const projectOwnerSpan = document.getElementById('projectOwner');

        function showInterestModal(ownerName) {
            projectOwnerSpan.textContent = ownerName;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }

        closeBtn.addEventListener('click', closeModal);

        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeModal();
            }
        });

        // View profile functionality
        function viewProfile(userId) {
            alert(`Profile viewing for ${userId} would be implemented here. This would navigate to a detailed profile page.`);
        }

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.querySelector('.nav-links');

        mobileMenuToggle.addEventListener('click', function() {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });

        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0.2s';
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        document.addEventListener('DOMContentLoaded', function() {
            const animatableElements = document.querySelectorAll('.feature-card, .project-card');
            animatableElements.forEach(el => {
                observer.observe(el);
            });

            // Add staggered animation delays
            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.2}s`;
            });

            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach((card, index) => {
                card.style.animationDelay = `${index * 0.15}s`;
            });
        });

        // Header scroll effect
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.style.background = 'rgba(15, 15, 35, 0.98)';
                header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
            } else {
                header.style.background = 'rgba(15, 15, 35, 0.95)';
                header.style.boxShadow = 'none';
            }
        });

        // Add some interactive effects
        document.addEventListener('DOMContentLoaded', function() {
            // Add hover effect to floating shapes
            const shapes = document.querySelectorAll('.shape');
            shapes.forEach(shape => {
                shape.addEventListener('mouseenter', function() {
                    this.style.animationPlayState = 'paused';
                    this.style.transform = 'scale(1.1)';
                });
                
                shape.addEventListener('mouseleave', function() {
                    this.style.animationPlayState = 'running';
                    this.style.transform = 'scale(1)';
                });
            });

            // Add click effects to buttons
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(button => {
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    ripple.style.position = 'absolute';
                    ripple.style.borderRadius = '50%';
                    ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                    ripple.style.transform = 'scale(0)';
                    ripple.style.animation = 'ripple 0.6s linear';
                    ripple.style.left = e.offsetX + 'px';
                    ripple.style.top = e.offsetY + 'px';
                    ripple.style.width = ripple.style.height = '20px';
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            });
        });

        // Add CSS for ripple effect
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
