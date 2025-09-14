// B.O.C.O. Worlds Experience - Simple and Reliable
class BocoWorldsExperience {
    constructor() {
        this.currentWorld = 1;
        this.totalWorlds = 4;
        this.worldsContainer = document.getElementById('worldsContainer');
        this.worldSteps = document.querySelectorAll('.world-step');
        this.prevBtn = document.getElementById('prevWorld');
        this.nextBtn = document.getElementById('nextWorld');
        this.worldTransition = document.getElementById('worldTransition');
        this.transitionText = document.getElementById('transitionText');
        
        this.worldTitles = [
            'Entering Research World...',
            'Meet B.O.C.O.',
            'Your Scientific Guide',
            'Discovering Problems'
        ];
        
        this.isTransitioning = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateUI();
        this.setupInteractiveElements();
        this.startAmbientAnimations();
    }
    
    setupEventListeners() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.previousWorld());
        this.nextBtn.addEventListener('click', () => this.nextWorld());
        
        // World step indicators
        this.worldSteps.forEach((step, index) => {
            step.addEventListener('click', () => this.goToWorld(index + 1));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                e.preventDefault();
                this.previousWorld();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                e.preventDefault();
                this.nextWorld();
            }
        });
        
        // Touch/swipe support
        this.setupTouchNavigation();
        
        // Share functionality
        document.querySelector('.share-btn').addEventListener('click', () => this.shareJourney());
        
        // Menu and info buttons
        document.querySelector('.menu-btn').addEventListener('click', () => this.showMenu());
        document.querySelector('.info-btn').addEventListener('click', () => this.showInfo());
        
        // Mouse wheel navigation
        this.worldsContainer.addEventListener('wheel', this.throttle((e) => {
            e.preventDefault();
            if (e.deltaY > 0 || e.deltaX > 0) {
                this.nextWorld();
            } else {
                this.previousWorld();
            }
        }, 500));
    }
    
    setupTouchNavigation() {
        let startX = 0;
        let startY = 0;
        let startTime = 0;
        
        this.container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        });
        
        this.container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;
            
            // Check for swipe (minimum distance and maximum time)
            if (Math.abs(deltaX) > 50 && deltaTime < 500) {
                if (deltaX > 0) {
                    this.previousWorld();
                } else {
                    this.nextWorld();
                }
            } else if (Math.abs(deltaY) > 50 && deltaTime < 500) {
                if (deltaY < 0) {
                    this.nextWorld();
                } else {
                    this.previousWorld();
                }
            }
        });
    }
    
    setupInteractiveElements() {
        // Research boat interaction
        const researchBoat = document.getElementById('researchBoat');
        if (researchBoat) {
            researchBoat.addEventListener('click', () => {
                this.animateBoat();
            });
        }
        
        // B.O.C.O. beast interaction
        const bocoMeet = document.getElementById('bocoMeet');
        if (bocoMeet) {
            bocoMeet.addEventListener('click', () => {
                this.animateBeast();
            });
        }
        
        // UX Researcher character interaction
        const uxResearcher = document.getElementById('uxResearcher');
        if (uxResearcher) {
            uxResearcher.addEventListener('click', () => {
                this.animateCharacter();
            });
        }
        
        // Interactive mines
        document.querySelectorAll('.sea-mine').forEach((mine, index) => {
            mine.addEventListener('click', () => {
                this.animateMine(mine);
            });
        });
        
        // Problem bubble interaction
        document.querySelector('.problem-bubble')?.addEventListener('click', () => {
            this.animateProblemBubble();
        });
    }
    
    animateBoat() {
        const boat = document.getElementById('researchBoat');
        boat.style.transform = 'translateX(20px)';
        setTimeout(() => {
            boat.style.transform = 'translateX(0)';
        }, 500);
    }
    
    animateBeast() {
        const beast = document.getElementById('bocoMeet');
        beast.style.animation = 'none';
        beast.style.transform = 'scale(1.2) translateY(-20px)';
        setTimeout(() => {
            beast.style.animation = 'float 2s ease-in-out infinite';
            beast.style.transform = 'scale(1)';
        }, 800);
    }
    
    animateCharacter() {
        const character = document.getElementById('uxResearcher');
        character.style.transform = 'scale(1.1)';
        setTimeout(() => {
            character.style.transform = 'scale(1)';
        }, 300);
    }
    
    animateMine(mine) {
        mine.style.transform = 'scale(1.3) rotate(10deg)';
        mine.style.filter = 'brightness(1.2)';
        setTimeout(() => {
            mine.style.transform = 'scale(1) rotate(0deg)';
            mine.style.filter = 'brightness(1)';
        }, 400);
    }
    
    animateProblemBubble() {
        const bubble = document.querySelector('.problem-bubble');
        bubble.style.transform = 'scale(1.05)';
        setTimeout(() => {
            bubble.style.transform = 'scale(1)';
        }, 200);
    }
    
    goToWorld(worldNumber) {
        if (worldNumber >= 1 && worldNumber <= this.totalWorlds && worldNumber !== this.currentWorld && !this.isTransitioning) {
            this.isTransitioning = true;
            this.showTransition(worldNumber);
            
            setTimeout(() => {
                this.currentWorld = worldNumber;
                this.updateWorldPosition();
                this.updateUI();
                
                setTimeout(() => {
                    this.hideTransition();
                    this.isTransitioning = false;
                }, 500);
            }, 800);
        }
    }
    
    updateWorldPosition() {
        const translateX = -(this.currentWorld - 1) * 100;
        this.worldsContainer.style.transform = `translateX(${translateX}vw)`;
    }
    
    scrollToWorld(worldNumber) {
        // This method is kept for compatibility but uses updateWorldPosition
        this.currentWorld = worldNumber;
        this.updateWorldPosition();
    }
    
    nextWorld() {
        if (this.currentWorld < this.totalWorlds && !this.isTransitioning) {
            this.goToWorld(this.currentWorld + 1);
        }
    }
    
    previousWorld() {
        if (this.currentWorld > 1 && !this.isTransitioning) {
            this.goToWorld(this.currentWorld - 1);
        }
    }
    
    updateUI() {
        // Update world step indicators
        this.worldSteps.forEach((step, index) => {
            if (index + 1 <= this.currentWorld) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Update navigation buttons
        this.prevBtn.disabled = this.currentWorld === 1;
        this.nextBtn.disabled = this.currentWorld === this.totalWorlds;
        
        // Update button opacity
        this.prevBtn.style.opacity = this.currentWorld === 1 ? '0.3' : '1';
        this.nextBtn.style.opacity = this.currentWorld === this.totalWorlds ? '0.3' : '1';
    }
    
    showTransition(worldNumber) {
        this.transitionText.textContent = this.worldTitles[worldNumber - 1];
        this.worldTransition.style.display = 'flex';
        this.worldTransition.style.opacity = '0';
        
        setTimeout(() => {
            this.worldTransition.style.opacity = '1';
        }, 100);
    }
    
    hideTransition() {
        this.worldTransition.style.opacity = '0';
        setTimeout(() => {
            this.worldTransition.style.display = 'none';
        }, 300);
    }
    
    startAmbientAnimations() {
        // Animate trees swaying
        this.animateTrees();
        
        // Add floating particles
        this.animateParticles();
        
        // Add atmospheric effects
        this.addAtmosphericEffects();
    }
    
    animateTrees() {
        const trees = document.querySelectorAll('.tree');
        trees.forEach((tree, index) => {
            const delay = index * 200;
            tree.style.animation = `sway 3s ease-in-out infinite ${delay}ms`;
        });
        
        // Add sway animation to CSS if not exists
        if (!document.querySelector('#swayAnimation')) {
            const style = document.createElement('style');
            style.id = 'swayAnimation';
            style.textContent = `
                @keyframes sway {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(2deg); }
                    75% { transform: rotate(-2deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    animateParticles() {
        // Create floating particles for ambiance
        setInterval(() => {
            this.createFloatingParticle();
        }, 3000);
    }
    
    createFloatingParticle() {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-white/40 rounded-full pointer-events-none';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '20%';
        particle.style.animation = 'floatUp 4s linear forwards';
        
        const currentWorldElement = document.getElementById(`world${this.currentWorld}`);
        if (currentWorldElement) {
            currentWorldElement.appendChild(particle);
        }
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 4000);
        
        // Add float animation if not exists
        if (!document.querySelector('#floatUpAnimation')) {
            const style = document.createElement('style');
            style.id = 'floatUpAnimation';
            style.textContent = `
                @keyframes floatUp {
                    0% { 
                        transform: translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { 
                        transform: translateY(-200px) translateX(${Math.random() * 40 - 20}px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    addAtmosphericEffects() {
        // Add subtle parallax effect to mountains on mouse move
        window.addEventListener('mousemove', this.throttle((e) => {
            const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
            
            document.querySelectorAll('.mountain').forEach((mountain, index) => {
                const speed = (index + 1) * 0.01;
                mountain.style.transform = `translate(${mouseX * speed * 10}px, ${mouseY * speed * 10}px)`;
            });
        }, 50));
    }
    
    shareJourney() {
        const shareData = {
            title: 'Defeat B.O.C.O. - Design Worlds Journey',
            text: 'Join me on this epic journey through the design worlds to defeat the Beast of Conflicting Opinions!',
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .then(() => {
                    // Silent success - no popup
                })
                .catch((error) => {
                    console.log('Error sharing:', error);
                    this.fallbackShare();
                });
        } else {
            this.fallbackShare();
        }
    }
    
    fallbackShare() {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                // Silent success - no popup
            })
            .catch(() => {
                // Silent failure - no popup
            });
    }
    
    showMenu() {
        // Simple menu toggle without popup
        const menu = document.querySelector('.menu-btn');
        menu.style.transform = 'scale(0.9)';
        setTimeout(() => {
            menu.style.transform = 'scale(1)';
        }, 150);
    }
    
    showInfo() {
        // Simple info toggle without popup
        const info = document.querySelector('.info-btn');
        info.style.transform = 'scale(0.9)';
        setTimeout(() => {
            info.style.transform = 'scale(1)';
        }, 150);
    }
    
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Device and browser compatibility
function checkCompatibility() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isSupported = width >= 1024 && height >= 600;
    
    if (!isSupported) {
        showCompatibilityMessage(width, height);
        return false;
    }
    return true;
}

function showCompatibilityMessage(width, height) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-gradient-to-br from-sage to-water flex items-center justify-center z-50 p-8';
    overlay.innerHTML = `
        <div class="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md text-center shadow-2xl">
            <div class="text-6xl mb-4">🖥️</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Experience Optimized for Larger Screens</h2>
            <p class="text-gray-600 mb-6">
                This immersive journey through the design worlds is best experienced on a desktop or tablet 
                with a screen resolution of at least 1024×600 pixels.
            </p>
            <div class="text-sm text-gray-500 mb-4">
                Current resolution: ${width} × ${height}px
            </div>
            <div class="text-sm text-gray-500">
                Minimum required: 1024 × 600px
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Global variable to store the experience instance
let bocoExperience = null;

// Initialize the experience
document.addEventListener('DOMContentLoaded', () => {
    if (checkCompatibility()) {
        // Add loading animation
        document.body.style.opacity = '0';
        
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
            
            // Initialize the experience
            bocoExperience = new BocoWorldsExperience();
        }, 500);
    }
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth < 1024 || window.innerHeight < 600) {
        if (!document.querySelector('.fixed.inset-0.bg-gradient-to-br')) {
            checkCompatibility();
        }
    }
});