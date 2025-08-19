// Products functionality
class ProductsManager {
    constructor() {
        this.products = [];
        this.currentFilter = 'all';
        this.init();
    }

    async init() {
        try {
            // Load products data
            await this.loadProducts();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Render initial products
            this.renderProducts();
        } catch (error) {
            console.error('Error initializing products:', error);
            this.showError('Error al cargar los productos. Por favor, intente nuevamente.');
        }
    }

    async loadProducts() {
        try {
            const response = await fetch('data/products.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.products = data.products;
        } catch (error) {
            console.error('Error loading products:', error);
            throw error; // Re-throw to be handled by init()
        }
    }

    setupEventListeners() {
        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleFilterClick(button);
            });
        });

        // Mobile navigation toggle
        const mobileMenuToggle = document.getElementById('mobile-menu');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            });
        });
    }

    handleFilterClick(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to clicked button
        button.classList.add('active');

        // Set current filter
        this.currentFilter = button.getAttribute('data-category');

        // Re-render products with animation
        this.renderProductsWithAnimation();
    }

    renderProductsWithAnimation() {
        const grid = document.getElementById('products-grid');
        
        // Fade out current products
        grid.style.opacity = '0';
        
        setTimeout(() => {
            this.renderProducts();
            // Fade in new products
            grid.style.opacity = '1';
        }, 150);
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        if (!grid) return;

        // Filter products based on current filter
        let filteredProducts = this.products;
        if (this.currentFilter !== 'all') {
            filteredProducts = this.products.filter(product => 
                product.category === this.currentFilter
            );
        }

        // Generate HTML
        const html = filteredProducts.map(product => this.createProductCard(product)).join('');
        
        // Update grid
        grid.innerHTML = html;

        // Add click listeners to product buttons
        this.setupProductButtonListeners();
    }

    createProductCard(product) {
        const featuresHtml = product.features 
            ? product.features.map(feature => `<li>${feature}</li>`).join('') 
            : '';

        return `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    ${product.icon}
                </div>
                <div class="product-content">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-subtitle">${product.subtitle}</p>
                    <p class="product-description">${product.description}</p>
                    ${featuresHtml ? `
                        <ul class="product-features">
                            ${featuresHtml}
                        </ul>
                    ` : ''}
                    
                    <button class="product-button" data-product-id="${product.id}">
                        Solicitar Cotización
                    </button>
                </div>
            </div>
        `;
    }

    getCategoryName(category) {
        const categoryNames = {
            'residential': 'Residencial',
            'commercial': 'Comercial',
            'emergency': 'Emergencia',
            'installation': 'Instalación'
        };
        return categoryNames[category] || category;
    }

    setupProductButtonListeners() {
        const buttons = document.querySelectorAll('.product-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.getAttribute('data-product-id');
                this.handleProductInquiry(productId);
            });
        });
    }

    handleProductInquiry(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) return;

        // Create WhatsApp message
        const message = `Hola! Estoy interesado en el servicio: ${product.title} (${product.subtitle}). ¿Podrían proporcionarme más información y un presupuesto?`;
        const encodedMessage = encodeURIComponent(message);
        
        const whatsappNumber = '5493525435332';
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
    }

    showError(message) {
        const grid = document.getElementById('products-grid');
        if (grid) {
            grid.innerHTML = `
                <div class="error-message" style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 2rem;
                    color: #e53e3e;
                    font-size: 1.1rem;
                ">
                    ${message}
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProductsManager();
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