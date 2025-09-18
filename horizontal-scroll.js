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
        // Scene 3: Enhanced diary interaction
        const diaryBook = document.querySelector('.diary-book');
        const diaryPopup = document.getElementById('diaryPopup');
        const closeDiary = document.querySelector('.close-diary');

        if (diaryBook && diaryPopup && closeDiary) {
            diaryBook.addEventListener('click', () => {
                diaryPopup.classList.add('active');
                // Play page turn sound effect
                this.playSound('page-turn');
            });

            closeDiary.addEventListener('click', () => {
                diaryPopup.classList.remove('active');
            });

            // Close on backdrop click
            const backdrop = diaryPopup.querySelector('.popup-backdrop');
            if (backdrop) {
                backdrop.addEventListener('click', () => {
                    diaryPopup.classList.remove('active');
                });
            }
        }

        // Scene 2: Enhanced character group interactions
        const characterGroups = document.querySelectorAll('.character-group');
        characterGroups.forEach(group => {
            group.addEventListener('mouseenter', () => {
                const soundType = group.dataset.sound;
                if (soundType) {
                    this.playAmbientSound(soundType);
                }
            });
            
            group.addEventListener('mouseleave', () => {
                this.stopAmbientSounds();
            });
        });

        // Scene 6: Theory points interaction
        const theoryPoints = document.querySelectorAll('.theory-point');
        const conclusionText = document.getElementById('conclusionText');
        let clickedPoints = new Set();

        theoryPoints.forEach(point => {
            point.addEventListener('click', () => {
                point.style.opacity = '0.5';
                clickedPoints.add(point.dataset.concept);
                this.playSound('theory-point');
                
                if (clickedPoints.size === 3 && conclusionText) {
                    setTimeout(() => {
                        conclusionText.classList.add('show');
                        this.playSound('revelation');
                    }, 500);
                }
            });
        });

        // Add stars to scene 1
        this.createStars();
        
        // Character animation triggers
        this.setupCharacterAnimations();
        
        // Setup scene transitions
        this.setupSceneTransitions();
        
        // Initialize ambient sounds
        this.setupAmbientSounds();
    }

    // Enhanced sound system
    playSound(soundType) {
        // In a real implementation, you would load actual audio files
        console.log(`Playing sound: ${soundType}`);
        
        // Simulate sound feedback with visual effects
        switch(soundType) {
            case 'page-turn':
                this.createSoundFeedback('📖', '#FFD700');
                break;
            case 'theory-point':
                this.createSoundFeedback('✨', '#6366f1');
                break;
            case 'revelation':
                this.createSoundFeedback('💡', '#fbbf24');
                break;
        }
    }

    playAmbientSound(soundType) {
        const audioElements = {
            'wind': document.querySelector('.wind-sound'),
            'children': document.querySelector('.children-sound'),
            'factory': document.querySelector('.factory-sound')
        };
        
        const audio = audioElements[soundType];
        if (audio) {
            audio.volume = 0.3;
            audio.play().catch(e => console.log('Audio play failed:', e));
        }
    }

    stopAmbientSounds() {
        const allAudio = document.querySelectorAll('.scene-audio');
        allAudio.forEach(audio => {
            audio.pause();
        });
    }

    createSoundFeedback(emoji, color) {
        const feedback = document.createElement('div');
        feedback.innerHTML = emoji;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: ${color};
            pointer-events: none;
            z-index: 9999;
            animation: sound-feedback 1s ease-out forwards;
        `;
        
        document.body.appendChild(feedback);
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes sound-feedback {
                0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                100% { opacity: 0; transform: translate(-50%, -50%) scale(1) translateY(-50px); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            document.body.removeChild(feedback);
            document.head.removeChild(style);
        }, 1000);
    }

    setupSceneTransitions() {
        // Add transition effects between scenes
        const scenes = document.querySelectorAll('.story-scene');
        scenes.forEach((scene, index) => {
            scene.style.transition = 'opacity 0.8s ease-in-out, transform 0.8s ease-in-out';
        });
    }

    setupAmbientSounds() {
        // Setup ambient sounds for each scene
        const sceneAudios = document.querySelectorAll('.scene-audio');
        sceneAudios.forEach(audio => {
            audio.volume = 0.2;
            // Preload audio
            audio.load();
        });
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
(function() {
    var canvas = document.getElementById("stars");
    var ctx = canvas.getContext("2d");
    var nightsky = ["#280F36", "#632B6C", "#BE6590", "#FFC1A0", "#FE9C7F"];
    var stars = [];

    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Star object
    function Star(x, y, size, color, duration) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.duration = duration;
        this.opacity = 1;
        this.phase = Math.random() * Math.PI * 2; // Random animation start
    }

    Star.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
    };

    Star.prototype.update = function(time) {
        // Simulate blinking with sine wave
        this.opacity = 0.5 + 0.5 * Math.sin(time / (this.duration * 1000) * Math.PI * 2 + this.phase);
    };

    // Generate stars
    function generateStars() {
        stars = [];
        // Main stars
        for (var i = 0; i < 100; i++) {
            stars.push(new Star(
                Math.random() * canvas.width,
                Math.random() * canvas.height * 0.7, // Focus on upper 70%
                Math.random() * 1 + 0.5, // Size 0.5-1.5px
                "white",
                Math.random() * 3 + 2 // Duration 2-5s
            ));
        }
        // Larger stars with color and glow
        for (var i = 0; i < 50; i++) {
            stars.push(new Star(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 1 + 1.5, // Size 1.5-2.5px
                nightsky[Math.floor(Math.random() * nightsky.length)],
                Math.random() * 2 + 5 // Duration 5-7s
            ));
        }
        // Cross-band stars (rotated effect)
        for (var i = 0; i < 50; i++) {
            var x = Math.random() * canvas.width * 1.2; // Wider area
            var y = canvas.height * 0.1 + Math.random() * canvas.height * 0.2; // 10-30% height
            // Apply rotation transform (20deg)
            var angle = 20 * Math.PI / 180;
            var rotatedX = x * Math.cos(angle) - y * Math.sin(angle);
            var rotatedY = x * Math.sin(angle) + y * Math.cos(angle);
            stars.push(new Star(
                rotatedX,
                rotatedY,
                Math.random() * 1 + 1, // Size 1-2px
                nightsky[Math.floor(Math.random() * nightsky.length)],
                Math.random() * 6 + 6 // Duration 6-12s
            ));
        }
    }

    // Animation loop
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => {
            star.update(time);
            star.draw();
        });
        requestAnimationFrame(animate);
    }

    // Initialize
    generateStars();
    requestAnimationFrame(animate);
})();