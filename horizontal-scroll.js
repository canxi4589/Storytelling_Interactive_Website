// Native Horizontal Scrolling Navigation

class HorizontalScrollNavigator {
    constructor() {
        this.currentSection = 0;
        this.sections = ['scene1', 'scene2', 'scene3', 'scene4', 'scene5', 'scene6', 'scene7', 'scene8'];
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isScrolling = false;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateActiveNavLink();
        this.setupScrollDetection();
        this.setupKeyboardNavigation();
        this.setupMouseWheelNavigation();
        this.setupTouchNavigation();
    }

    setupScrollDetection() {
        // Track scroll position to update active navigation
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
                const sectionIndex = Math.round(scrollLeft / window.innerWidth);
                
                if (sectionIndex !== this.currentSection && sectionIndex >= 0 && sectionIndex < this.sections.length) {
                    this.currentSection = sectionIndex;
                    this.updateActiveNavLink();
                    this.updateURL();
                }
            }
        });
    }

    setupEventListeners() {
        // Navigation links
        this.navLinks.forEach((link, index) => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSection(index);
            });
        });

        // Interactive story elements will be handled separately
        this.setupStoryInteractions();

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
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'ArrowRight':
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
        // Convert vertical mouse wheel to horizontal scroll
        document.addEventListener('wheel', (e) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                // Already horizontal scroll, let it through
                return;
            }
            
            // Convert vertical scroll to horizontal
            e.preventDefault();
            window.scrollBy({
                left: e.deltaY,
                behavior: 'auto'
            });
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
        
        // Scroll to the section using native browser scroll
        const targetScrollLeft = sectionIndex * window.innerWidth;
        
        window.scrollTo({
            left: targetScrollLeft,
            behavior: 'smooth'
        });
        
        console.log(`Navigating to section ${sectionIndex}, scroll to: ${targetScrollLeft}px`);
        
        // Update active navigation link
        this.updateActiveNavLink();
        
        // Update URL hash
        this.updateURL();
        
        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
        }, 800);
    }

    updateURL() {
        window.history.pushState(null, null, `#${this.sections[this.currentSection]}`);
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

    // Initialize from URL hash on page load
    initializeFromHash() {
        const hash = window.location.hash.slice(1);
        const sectionIndex = this.sections.indexOf(hash);
        if (sectionIndex !== -1) {
            this.currentSection = sectionIndex;
            const targetScrollLeft = sectionIndex * window.innerWidth;
            window.scrollTo({
                left: targetScrollLeft,
                behavior: 'auto' // No smooth scroll on initial load
            });
        }
    }

    // Setup story-specific interactions
    setupStoryInteractions() {
        // Scene 3: Diary interaction
        const diaryBook = document.querySelector('.diary-book');
        const diaryPopup = document.getElementById('diaryPopup');
        const closeDiary = document.querySelector('.close-diary');

        if (diaryBook && diaryPopup && closeDiary) {
            diaryBook.addEventListener('click', () => {
                diaryPopup.classList.add('active');
            });

            closeDiary.addEventListener('click', () => {
                diaryPopup.classList.remove('active');
            });

            diaryPopup.addEventListener('click', (e) => {
                if (e.target === diaryPopup) {
                    diaryPopup.classList.remove('active');
                }
            });
        }

        // Scene 6: Theory points interaction
        const theoryPoints = document.querySelectorAll('.theory-point');
        const conclusionText = document.getElementById('conclusionText');
        let clickedPoints = new Set();

        theoryPoints.forEach(point => {
            point.addEventListener('click', () => {
                point.style.opacity = '0.5';
                clickedPoints.add(point.dataset.concept);
                
                if (clickedPoints.size === 3 && conclusionText) {
                    setTimeout(() => {
                        conclusionText.classList.add('show');
                    }, 500);
                }
            });
        });

        // Add stars to scene 1
        this.createStars();
        
        // Character animation triggers
        this.setupCharacterAnimations();
    }

    createStars() {
        const stars = document.getElementById('stars');
        if (stars) {
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.className = 'particle';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.animationDelay = Math.random() * 4 + 's';
                star.style.animationDuration = (Math.random() * 3 + 2) + 's';
                stars.appendChild(star);
            }
        }
    }

    setupCharacterAnimations() {
        // Add any character-specific animations here
        const characters = document.querySelectorAll('.character');
        characters.forEach(character => {
            character.addEventListener('mouseenter', () => {
                character.style.transform += ' scale(1.05)';
            });
            
            character.addEventListener('mouseleave', () => {
                character.style.transform = character.style.transform.replace(' scale(1.05)', '');
            });
        });
    }
}

// Enhanced Story Navigator with horizontal scrolling
class HoChiMinhStoryNavigator {
    constructor() {
        this.horizontalNavigator = new HorizontalScrollNavigator();
        this.setupHorizontalSpecificFeatures();
    }

    setupHorizontalSpecificFeatures() {
        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.horizontalNavigator.handlePopState();
        });

        // Initialize from URL hash
        this.horizontalNavigator.initializeFromHash();

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
        const originalUpdateActiveNavLink = this.horizontalNavigator.updateActiveNavLink.bind(this.horizontalNavigator);
        this.horizontalNavigator.updateActiveNavLink = () => {
            originalUpdateActiveNavLink();
            this.updateSectionIndicators(this.horizontalNavigator.currentSection);
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
    // Add a small delay to ensure all elements are loaded
    setTimeout(() => {
        const storyNavigator = new HoChiMinhStoryNavigator();
        console.log('Ho Chi Minh Story Navigator initialized with native horizontal scrolling');
        
        // Initialize from URL or go to first section
        if (!window.location.hash) {
            storyNavigator.horizontalNavigator.updateURL();
        }
    }, 100);
});