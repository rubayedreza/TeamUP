// js/index.js
import { createRipple, debounce, throttle } from './utils.js'; // Assuming utils.js is in the same directory

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation (already good)
    const navLinksForScroll = document.querySelectorAll('.nav-main-link[href^="#"], .footer-link[href^="#"]');
    navLinksForScroll.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            scrollToSection(sectionId);
            // If mobile menu is open, close it
            if (mainNavLinks.classList.contains('active')) {
                mainNavLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });

    initializeSearchAndFilter();
    initializeModal();
    initializeMobileMenu();
    initializeIntersectionObserver();
    initializeHeaderScrollEffect();
    initializeInteractiveEffects();
    updateCopyrightYear();
});



function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function initializeSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const skillFilter = document.getElementById('skillFilter');
    const cardContainer = document.getElementById('cardContainer'); // Assuming this is the UL
    const projectCards = cardContainer ? Array.from(cardContainer.getElementsByClassName('project-card')) : [];

    function filterProjects() {
        if (!cardContainer) return;
        const searchTerm = searchInput.value.toLowerCase();
        const selectedSkill = skillFilter.value.toLowerCase();

        projectCards.forEach(card => {
            const cardText = card.textContent.toLowerCase();
            const cardSkills = card.dataset.skills ? card.dataset.skills.toLowerCase() : '';

            const matchesSearch = searchTerm === '' || cardText.includes(searchTerm);
            const matchesSkill = selectedSkill === '' || cardSkills.includes(selectedSkill);

            if (matchesSearch && matchesSkill) {
                card.style.display = 'flex'; // Assuming cards are flex items
                card.classList.remove('hidden-by-filter');
            } else {
                // card.style.display = 'none'; // Avoid direct style manipulation for display if possible
                card.classList.add('hidden-by-filter'); // Add a class to hide
            }
        });
    }
    // Add a CSS rule for .hidden-by-filter { display: none !important; } in index.css

    if (searchInput) searchInput.addEventListener('input', debounce(filterProjects, 300));
    if (skillFilter) skillFilter.addEventListener('change', filterProjects);
    if (projectCards.length > 0) filterProjects(); // Initial filter
}

// Add this to your index.js inside the DOMContentLoaded listener

function initializeNavLinkActiveState() {
    const navLinks = document.querySelectorAll('#mainNavLinks .nav-main-link'); // Target links in main nav

    // Function to remove 'active' class from all nav links
    function clearActiveStates() {
        navLinks.forEach(link => link.classList.remove('active'));
    }

    navLinks.forEach(link => {
        // For direct clicks on nav items that don't just scroll to section
        if (!link.getAttribute('href').startsWith('#')) {
             // Check if the link's href matches the current page URL for initial active state
            if (window.location.pathname.includes(link.getAttribute('href'))) {
                link.classList.add('active');
            }
        }

        link.addEventListener('click', function(e) {
            // If it's a link to another page, the active state will be set on page load.
            // If it's an anchor link for the same page (handled by scrollToSection):
            if (this.getAttribute('href').startsWith('#')) {
                clearActiveStates(); // Remove active from others
                this.classList.add('active'); // Add active to the clicked one
                // Note: Closing mobile menu is already handled in your scrollToSection listener
            }
        });
    });

    // Optional: Scrollspy-like behavior to update active link on scroll
    // This is more complex and might require checking section visibility.
    // For now, click-based activation is simpler.
}

// Call it:
initializeNavLinkActiveState();

function initializeModal() {
    const modalBackdrop = document.getElementById('interestModalBackdrop');
    const modal = document.getElementById('interestModal');
    const closeBtn = modal ? modal.querySelector('.modal-close-btn') : null;
    const projectOwnerSpan = document.getElementById('projectOwner');

    // Function to be called by project card buttons
    window.showInterestModal = function(ownerName) { // Expose to global scope for inline onclick
        if (!modalBackdrop || !projectOwnerSpan) return;
        projectOwnerSpan.textContent = ownerName;
        modalBackdrop.classList.add('active');
        document.body.style.overflow = 'hidden'; // Keep for modal
    }

    function closeModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function(event) {
            if (event.target === modalBackdrop) {
                closeModal();
            }
        });
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('active')) {
            closeModal();
        }
    });
}

// View profile functionality (placeholder)
window.viewProfile = function(userId) { // Expose to global scope for inline onclick
    alert(`Profile viewing for ${userId} would be implemented here. This would navigate to a detailed profile page.`);
}

function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNavLinks = document.getElementById('mainNavLinks');

    if (mobileMenuToggle && mainNavLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNavLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active'); // For animating the hamburger to X
            const isExpanded = mainNavLinks.classList.contains('active');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }
}

function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add 'visible' class to trigger animation
                obs.unobserve(entry.target); // Optional: unobserve after animation
            }
        });
    }, observerOptions);

    const animatableElements = document.querySelectorAll('.fade-in-up'); // Ensure this class is on elements
    animatableElements.forEach(el => {
        observer.observe(el);
    });

    // Staggered animation delays can be set directly in CSS using :nth-child or similar
    // Or if dynamic, can be done here. For simplicity, CSS is often cleaner.
    // Example:
    // const featureCards = document.querySelectorAll('.feature-card.fade-in-up');
    // featureCards.forEach((card, index) => {
    //     card.style.animationDelay = `${index * 0.15}s`;
    // });
}


function initializeHeaderScrollEffect() {
    const header = document.querySelector('.header-main');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    // Throttle scroll event
    window.addEventListener('scroll', throttle(handleScroll, 100));
}

function initializeInteractiveEffects() {
    // Floating shapes hover effect (pause/play animation)
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach(shape => {
        shape.addEventListener('mouseenter', function() {
            this.style.animationPlayState = 'paused';
            // this.style.transform = 'scale(1.1)'; // This can be CSS :hover
        });
        shape.addEventListener('mouseleave', function() {
            this.style.animationPlayState = 'running';
            // this.style.transform = 'scale(1)'; // This can be CSS :hover
        });
    });

    // Add ripple effect to all buttons with class .btn
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// CSS for .hidden-by-filter (add to index.css or components.css)
// .hidden-by-filter { display: none !important; }

// CSS for header.scrolled (add to index.css or components.css)
// .header-main.scrolled {
//    background: rgba(15, 15, 35, 0.98); /* var(--bg-dark-primary) with more opacity */
//    box-shadow: 0 4px 20px var(--shadow-color-dark);
// }