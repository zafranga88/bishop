
class IndexManager {
    constructor() {
        this.isScrolled = false;
        this.observers = [];
        this.init();
    }

    init() {
        // Setup all event listeners and functionality
        this.setupMobileNavigation();
        this.setupSmoothScrolling();
        this.setupScrollEffects();
        this.setupIntersectionObservers();
        this.setupButtonFunctionality();
        this.setupHeroParallax();
        this.setupContactButtons();
        this.setupFloatingWhatsApp(); 
    }

    // Mobile Navigation Toggle
    setupMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Add body overflow control for mobile menu
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            // Close mobile menu when clicking on a link
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileMenuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        mobileMenuToggle.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                }
            });
        }
    }

    // Smooth scrolling for internal links
    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll effects for navbar and back-to-top functionality
    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        let ticking = false;

        const updateScrollEffects = () => {
            const scrollY = window.scrollY;
            
            // Add shadow to navbar when scrolled
            if (scrollY > 50 && !this.isScrolled) {
                this.isScrolled = true;
                navbar.classList.add('scrolled');
            } else if (scrollY <= 50 && this.isScrolled) {
                this.isScrolled = false;
                navbar.classList.remove('scrolled');
            }

            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        });

        // Add scrolled class styles via JavaScript if not in CSS
        if (!document.querySelector('style[data-scroll-effects]')) {
            const style = document.createElement('style');
            style.setAttribute('data-scroll-effects', 'true');
            style.textContent = `
                .navbar.scrolled {
                    box-shadow: 0 4px 20px rgba(26, 54, 93, 0.15);
                    transition: box-shadow 0.3s ease;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Intersection Observer for animations
    setupIntersectionObservers() {
        const animatedElements = document.querySelectorAll([
            '.feature-card',
            '.service-card', 
            '.testimonial-card',
            '.about-content',
            '.section-header'
        ].join(', '));

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            // Set initial state
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            
            observer.observe(element);
        });

        this.observers.push(observer);
    }

    // Hero parallax effect
    setupHeroParallax() {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) return;

        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        });
    }

    // Button functionality
    setupButtonFunctionality() {
        // Add loading states to buttons
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .cta-button, .cta-button-secondary');
        
        buttons.forEach(button => {
            // Skip WhatsApp and external links
            if (button.href && (button.href.includes('whatsapp') || button.href.includes('http'))) {
                return;
            }

            button.addEventListener('click', (e) => {
                // Add loading state
                const originalText = button.textContent;
                button.textContent = 'Cargando...';
                button.disabled = true;

                // Remove loading state after a short delay (simulating navigation)
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 800);
            });
        });

        // Add hover effects
        this.setupButtonHoverEffects();
    }

    setupButtonHoverEffects() {
        const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline, .cta-button, .cta-button-secondary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-2px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });
        });
    }

    // Contact and WhatsApp button functionality
    setupContactButtons() {
        // WhatsApp buttons
        const whatsappButtons = document.querySelectorAll('a[href*="whatsapp"]');
        
        whatsappButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Track WhatsApp click (you can add analytics here)
                this.trackEvent('WhatsApp', 'Click', 'Contact Button');
                
                // Add a brief loading state
                const originalText = button.textContent;
                button.textContent = 'Abriendo WhatsApp...';
                
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            });
        });

        // Contact form buttons (if they exist)
        const contactButtons = document.querySelectorAll('a[href*="contact.html"]');
        
        contactButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.trackEvent('Navigation', 'Click', 'Contact Page');
            });
        });
    }

    // Setup floating WhatsApp button
    setupFloatingWhatsApp() {
        const whatsappFloat = document.querySelector('.whatsapp-float');
        
        if (whatsappFloat) {
            // Hide button when scrolling at the very top
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop < 100) {
                    whatsappFloat.style.opacity = '0.7';
                } else {
                    whatsappFloat.style.opacity = '1';
                }
                
                lastScrollTop = scrollTop;
            });

            // Track clicks
            whatsappFloat.addEventListener('click', () => {
                this.trackEvent('WhatsApp', 'Click', 'Floating Button');
            });
        }
    }

    // Simple event tracking (can be extended with Google Analytics, etc.)
    trackEvent(category, action, label) {
        console.log(`Event tracked: ${category} - ${action} - ${label}`);
        
        // Example: Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
    }

    // Utility method to animate counters
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.textContent);
            const increment = target / 50; // 50 steps
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                }
            };
            
            updateCounter();
        });
    }

    // Lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.push(imageObserver);
        }
    }

    // Form validation (if contact forms are added later)
    setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    this.showFormErrors(form);
                }
            });
        });
    }

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }

    showFormErrors(form) {
        const errorFields = form.querySelectorAll('.error');
        if (errorFields.length > 0) {
            errorFields[0].focus();
            this.showMessage('Por favor, complete todos los campos requeridos.', 'error');
        }
    }

    showMessage(message, type = 'info') {
        // Create or update message element
        let messageEl = document.getElementById('page-message');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'page-message';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }

        // Set message and style based on type
        messageEl.textContent = message;
        messageEl.className = `message-${type}`;
        
        const colors = {
            info: '#2c5282',
            success: '#38a169',
            error: '#e53e3e',
            warning: '#d69e2e'
        };
        
        messageEl.style.backgroundColor = colors[type] || colors.info;

        // Show message
        setTimeout(() => {
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Hide message after 3 seconds
        setTimeout(() => {
            messageEl.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    // Cleanup observers when needed
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers = [];
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const indexManager = new IndexManager();
    
    // Make it globally accessible for debugging
    window.indexManager = indexManager;
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations or timers
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Page visible - resuming animations');
    }
});

// Handle resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle responsive adjustments
        console.log('Window resized - updating layout');
    }, 250);
});