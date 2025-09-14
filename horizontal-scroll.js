// Horizontal Scrolling Navigation for World Explorer Website

class HorizontalScrollNavigator {
    constructor() {
        this.currentSection = 0;
        this.sections = ['home', 'worlds', 'about', 'contact', 'footer'];
        this.horizontalContainer = document.getElementById('horizontalContainer');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveNavLink();
        this.setupKeyboardNavigation();
        this.setupMouseWheelNavigation();
        this.setupTouchNavigation();
    }

    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSection(index);
            });
        });

        // Hero buttons
        const startBtn = document.querySelector('.btn-primary');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.goToSection(1); // Worlds section
            });
        }

        const learnMoreBtn = document.querySelector('.btn-secondary');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                this.goToSection(2); // About section
            });
        }

        // Mobile navigation toggle
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                hamburger.classList.toggle('active');
            });

            // Close menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                });
            });
        }
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            if (this.isScrolling) return;

            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSection(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSection(this.sections.length - 1);
                    break;
            }
        });
    }

    setupMouseWheelNavigation() {
        let isThrottled = false;
        
        document.addEventListener('wheel', (e) => {
            if (this.isScrolling || isThrottled) return;
            
            isThrottled = true;
            setTimeout(() => isThrottled = false, 100);

            if (e.deltaY > 0 || e.deltaX > 0) {
                this.nextSection();
            } else {
                this.previousSection();
            }
        }, { passive: false });
    }

    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (this.isScrolling) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // Check for horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 500) {
                if (deltaX > 0) {
                    this.previousSection();
                } else {
                    this.nextSection();
                }
            }
            // Check for vertical swipe (for mobile compatibility)
            else if (Math.abs(deltaY) > 50 && deltaTime < 500) {
                if (deltaY < 0) {
                    this.nextSection();
                } else {
                    this.previousSection();
                }
            }
        }, { passive: true });
    }

    goToSection(sectionIndex) {
        if (sectionIndex < 0 || sectionIndex >= this.sections.length || sectionIndex === this.currentSection) {
            return;
        }

        this.isScrolling = true;
        this.currentSection = sectionIndex;
        
        // Calculate transform value
        const translateX = -sectionIndex * 100;
        this.horizontalContainer.style.transform = `translateX(${translateX}vw)`;
        
        // Update active navigation link
        this.updateActiveNavLink();
        
        // Update URL hash
        window.history.pushState(null, null, `#${this.sections[sectionIndex]}`);
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    }

    nextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.goToSection(this.currentSection + 1);
        }
    }

    previousSection() {
        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        }
    }

    updateActiveNavLink() {
        this.navLinks.forEach((link, index) => {
            if (index === this.currentSection) {
                link.setAttribute('aria-current', 'page');
                link.classList.add('active');
            } else {
                link.removeAttribute('aria-current');
                link.classList.remove('active');
            }
        });
    }

    // Handle browser back/forward buttons
    handlePopState() {
        const hash = window.location.hash.slice(1);
        const sectionIndex = this.sections.indexOf(hash);
        if (sectionIndex !== -1 && sectionIndex !== this.currentSection) {
            this.goToSection(sectionIndex);
        }
    }
}

// Enhanced World Explorer with horizontal scrolling
class WorldExplorerHorizontal extends WorldExplorer {
    constructor() {
        super();
        this.horizontalNavigator = new HorizontalScrollNavigator();
        this.setupHorizontalSpecificFeatures();
    }

    setupHorizontalSpecificFeatures() {
        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.horizontalNavigator.handlePopState();
        });

        // Initialize from URL hash
        const hash = window.location.hash.slice(1);
        const sectionIndex = this.horizontalNavigator.sections.indexOf(hash);
        if (sectionIndex !== -1) {
            this.horizontalNavigator.goToSection(sectionIndex);
        }

        // Add section indicators
        this.createSectionIndicators();
    }

    createSectionIndicators() {
        const indicators = document.createElement('div');
        indicators.className = 'section-indicators';
        indicators.innerHTML = this.horizontalNavigator.sections.map((section, index) => 
            `<div class="indicator" data-section="${index}"></div>`
        ).join('');

        indicators.style.cssText = `
            position: fixed;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
        `;

        document.body.appendChild(indicators);

        // Style indicators
        const style = document.createElement('style');
        style.textContent = `
            .indicator {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .indicator.active {
                background: var(--primary-color);
                transform: scale(1.2);
            }
            
            .indicator:hover {
                background: rgba(255, 255, 255, 0.6);
            }
        `;
        document.head.appendChild(style);

        // Add click handlers
        indicators.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.horizontalNavigator.goToSection(index);
            });
        });

        // Update indicators when section changes
        const originalGoToSection = this.horizontalNavigator.goToSection.bind(this.horizontalNavigator);
        this.horizontalNavigator.goToSection = (sectionIndex) => {
            originalGoToSection(sectionIndex);
            this.updateSectionIndicators(sectionIndex);
        };
    }

    updateSectionIndicators(activeIndex) {
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            if (index === activeIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // Override parallax to work with horizontal scrolling
    handleParallax() {
        // Disable vertical parallax for horizontal layout
        return;
    }

    // Override navbar scroll effect
    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
}

// Initialize the horizontal scrolling experience
document.addEventListener('DOMContentLoaded', () => {
    new WorldExplorerHorizontal();
});