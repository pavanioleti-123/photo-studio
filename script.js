/*
================================================================
ROYAL VISION PHOTO STUDIO - JAVASCRIPT CONTROLLER (script.js)
Interactive UI Elements, Custom Lightbox, Masonry Filter, Scroll reveals
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------------------
    // 1. STICKY HEADER & SCROLL CONTROL
    // ---------------------------------------------------------
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once in case page starts scrolled

    // ---------------------------------------------------------
    // 2. MOBILE MENU DRAWER
    // ---------------------------------------------------------
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Prevent body scroll when menu is active
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // ---------------------------------------------------------
    // 3. PARALLAX EFFECT FOR HERO BANNERS
    // ---------------------------------------------------------
    const heroBgWrap = document.querySelector('.hero-bg-wrap');
    if (heroBgWrap) {
        window.addEventListener('scroll', () => {
            const scrollVal = window.scrollY;
            // Shift background slightly slower than scrolling speed (parallax)
            heroBgWrap.style.transform = `translateY(${scrollVal * 0.4}px)`;
        });
    }

    // ---------------------------------------------------------
    // 4. SCROLL REVEAL ANIMATIONS (Intersection Observer)
    // ---------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, {
        threshold: 0.1, // Reveal when 10% is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before entering viewport
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // ---------------------------------------------------------
    // 5. STATISTICS COUNTER ANIMATION
    // ---------------------------------------------------------
    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');

    if (statNumbers.length > 0) {
        let counted = false;

        const countUp = (element) => {
            const target = +element.getAttribute('data-target');
            const duration = 2000; // 2 seconds total count time
            const increment = target / (duration / 16); // ~60fps
            let current = 0;

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    element.innerText = Math.floor(current);
                    requestAnimationFrame(updateCount);
                } else {
                    element.innerText = target;
                }
            };
            updateCount();
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !counted) {
                    statNumbers.forEach(num => countUp(num));
                    counted = true;
                }
            });
        }, { threshold: 0.3 });

        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    }

    // ---------------------------------------------------------
    // 6. GALLERY CATEGORY FILTERING
    // ---------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Toggle active class on buttons
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === 'all' || itemCategory === filterValue) {
                        item.classList.remove('hide');
                        // Small timeout to allow transition display to register
                        setTimeout(() => {
                            item.style.transform = 'scale(1)';
                            item.style.opacity = '1';
                        }, 50);
                    } else {
                        item.style.transform = 'scale(0.8)';
                        item.style.opacity = '0';
                        // Add hide class after transition completes
                        setTimeout(() => {
                            item.classList.add('hide');
                        }, 400);
                    }
                });
            });
        });
    }

    // ---------------------------------------------------------
    // 7. LIGHTBOX IMAGE VIEWER
    // ---------------------------------------------------------
    const galleryContainer = document.querySelector('.gallery-grid');
    const lightbox = document.getElementById('lightbox');
    
    if (lightbox) {
        const lightboxImg = lightbox.querySelector('.lightbox-img');
        const lightboxTitle = lightbox.querySelector('.lightbox-title');
        const lightboxCategory = lightbox.querySelector('.lightbox-category');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let activeItems = []; // Keeps track of currently active (visible) items
        let currentIndex = 0;

        // Function to update active visible items list based on current filter
        function updateActiveItems() {
            activeItems = Array.from(galleryItems).filter(item => !item.classList.contains('hide'));
        }

        // Open Lightbox
        galleryItems.forEach((item) => {
            item.addEventListener('click', () => {
                updateActiveItems();
                currentIndex = activeItems.indexOf(item);
                showImage(item);
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        // Show specific image inside lightbox
        function showImage(item) {
            const img = item.querySelector('.gallery-img');
            const title = item.querySelector('.gallery-item-title').innerText;
            const category = item.querySelector('.gallery-item-tag').innerText;

            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxTitle.innerText = title;
            lightboxCategory.innerText = category;
        }

        // Next image
        function nextImage() {
            if (activeItems.length <= 1) return;
            currentIndex = (currentIndex + 1) % activeItems.length;
            showImage(activeItems[currentIndex]);
        }

        // Previous image
        function prevImage() {
            if (activeItems.length <= 1) return;
            currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
            showImage(activeItems[currentIndex]);
        }

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }

        // Event listeners for lightbox controls
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);

        // Click outside image to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrap')) {
                closeLightbox();
            }
        });

        // Keyboard Controls
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        });
    }

    // ---------------------------------------------------------
    // 8. FAQ ACCORDION INTERACTIVITY
    // ---------------------------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isOpen = faqItem.classList.contains('active');

            // Close all open FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = null;
            });

            // If it wasn't open, open it
            if (!isOpen) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ---------------------------------------------------------
    // 9. CONTACT FORM VALIDATION & MOCK SUCCESS TOAST
    // ---------------------------------------------------------
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;

            // Form inputs
            const nameInput = document.getElementById('formName');
            const emailInput = document.getElementById('formEmail');
            const phoneInput = document.getElementById('formPhone');
            const messageInput = document.getElementById('formMessage');

            // Helper to toggle invalid state
            const validateField = (input, validationFn) => {
                const group = input.parentElement;
                if (validationFn(input.value.trim())) {
                    group.classList.remove('invalid');
                } else {
                    group.classList.add('invalid');
                    isFormValid = false;
                }
            };

            // Validators
            validateField(nameInput, val => val.length >= 2);
            validateField(emailInput, val => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(val);
            });
            validateField(phoneInput, val => {
                // Accepts digits, spaces, hyphens, plus sign, min 7 chars
                const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
                return phoneRegex.test(val.replace(/\s/g, ''));
            });
            validateField(messageInput, val => val.length >= 10);

            // If valid, submit form
            if (isFormValid) {
                // Show Success Toast
                if (toast) {
                    toast.classList.add('show');
                    
                    // Hide after 4 seconds
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 4000);
                }

                // Reset Form
                contactForm.reset();
            }
        });

        // Live validation indicators on focus out
        const inputs = contactForm.querySelectorAll('.form-control');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                const group = input.parentElement;
                
                if (input.id === 'formName') {
                    if (input.value.trim().length >= 2) group.classList.remove('invalid');
                } else if (input.id === 'formEmail') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(input.value.trim())) group.classList.remove('invalid');
                } else if (input.id === 'formPhone') {
                    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$/;
                    if (phoneRegex.test(input.value.replace(/\s/g, ''))) group.classList.remove('invalid');
                } else if (input.id === 'formMessage') {
                    if (input.value.trim().length >= 10) group.classList.remove('invalid');
                }
            });
        });
    }
});
