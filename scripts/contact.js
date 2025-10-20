
class ContactManager {
    constructor() {
        this.init();
    }

    init() {
        try {
            // Setup event listeners
            this.setupEventListeners();
            
            // Initialize contact interactions
            this.initializeContactActions();
            
            // Initialize animations
            this.initializeAnimations();
            
            // Setup floating WhatsApp
            this.setupFloatingWhatsApp();  // <-- ADD THIS LINE
            
        } catch (error) {
            console.error('Error initializing contact:', error);
        }
    }

    setupEventListeners() {
        // Mobile navigation toggle
        const mobileMenuToggle = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
                
                // Animate hamburger menu bars
                this.animateHamburgerMenu(mobileMenuToggle);
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileMenuToggle) {
                        mobileMenuToggle.classList.remove('active');
                        this.resetHamburgerMenu(mobileMenuToggle);
                    }
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (navMenu && mobileMenuToggle) {
                const isClickInsideNav = navMenu.contains(event.target);
                const isClickInsideToggle = mobileMenuToggle.contains(event.target);
                
                if (!isClickInsideNav && !isClickInsideToggle && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                    this.resetHamburgerMenu(mobileMenuToggle);
                }
            }
        });
    }

    animateHamburgerMenu(menuToggle) {
        const bars = menuToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (menuToggle.classList.contains('active')) {
                if (index === 0) {
                    bar.style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                } else if (index === 1) {
                    bar.style.opacity = '0';
                } else if (index === 2) {
                    bar.style.transform = 'rotate(45deg) translate(-5px, -6px)';
                }
            } else {
                this.resetHamburgerMenu(menuToggle);
            }
        });
    }

    resetHamburgerMenu(menuToggle) {
        const bars = menuToggle.querySelectorAll('.bar');
        bars.forEach(bar => {
            bar.style.transform = '';
            bar.style.opacity = '1';
        });
    }

    initializeContactActions() {
        // Handle phone and email click functionality
        const contactDetails = document.querySelectorAll('.contact-detail');
        contactDetails.forEach(detail => {
            const text = detail.textContent.trim();
            
            // Check if it's a phone number
            if (text.includes('+') && /\d/.test(text)) {
                this.setupPhoneAction(detail, text);
            }
            
            // Check if it's an email
            if (text.includes('@')) {
                this.setupEmailAction(detail, text);
            }

            // Add double-click to copy functionality
            this.setupCopyAction(detail);
        });
    }

    setupPhoneAction(element, phoneNumber) {
        element.style.cursor = 'pointer';
        element.title = 'Haga clic para llamar';
        
        element.addEventListener('click', () => {
            const cleanPhone = phoneNumber.replace(/\s|-/g, '');
            window.location.href = `tel:${cleanPhone}`;
        });
        
        this.addHoverEffect(element);
    }

    setupEmailAction(element, email) {
        element.style.cursor = 'pointer';
        element.title = 'Haga clic para enviar email';
        
        element.addEventListener('click', () => {
            window.location.href = `mailto:${email}`;
        });
        
        this.addHoverEffect(element);
    }

    setupCopyAction(element) {
        element.addEventListener('dblclick', () => {
            const text = element.textContent.trim();
            this.copyToClipboard(text, element);
        });
    }

    addHoverEffect(element) {
        element.addEventListener('mouseenter', () => {
            element.style.textDecoration = 'underline';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.textDecoration = 'none';
        });
    }

    copyToClipboard(text, element) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopyNotification(element, 'Copiado al portapapeles');
            }).catch(() => {
                this.fallbackCopyToClipboard(text, element);
            });
        } else {
            this.fallbackCopyToClipboard(text, element);
        }
    }

    fallbackCopyToClipboard(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopyNotification(element, 'Copiado al portapapeles');
        } catch (err) {
            this.showCopyNotification(element, 'Error al copiar');
        }
        
        document.body.removeChild(textArea);
    }

    showCopyNotification(element, message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: absolute;
            background-color: var(--patagonian-navy);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
            white-space: nowrap;
        `;
        
        const rect = element.getBoundingClientRect();
        notification.style.left = rect.left + (rect.width / 2) + 'px';
        notification.style.top = (rect.top - 40) + 'px';
        notification.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
        });
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 2000);
    }

    initializeAnimations() {
        const contactCards = document.querySelectorAll('.contact-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        contactCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }

    setupFloatingWhatsApp() {
        const whatsappFloat = document.querySelector('.whatsapp-float');
        
        if (whatsappFloat) {
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

            whatsappFloat.addEventListener('click', () => {
                console.log('WhatsApp floating button clicked - Contact Page');
            });
        }
    }

    initializeExternalLinks() {
        const externalLinks = document.querySelectorAll('a[href^="http"]');
        
        externalLinks.forEach(link => {
            if (!link.getAttribute('data-processed')) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.setAttribute('data-processed', 'true');
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactManager();
});

// Add smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
});