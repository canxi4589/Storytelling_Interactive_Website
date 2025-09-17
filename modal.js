// Modal System JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const modalTriggers = document.querySelectorAll('.modal-trigger');

    // Function to open modal
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modalOverlay.classList.add('active');
            modal.style.display = 'block';
            
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
            
            // Focus management for accessibility
            modalClose.focus();
            
            // Add escape key listener
            document.addEventListener('keydown', handleEscapeKey);
        }
    }

    // Function to close modal
    function closeModal() {
        modalOverlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Remove escape key listener
        document.removeEventListener('keydown', handleEscapeKey);
        
        // Focus management - return focus to trigger element
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('modal-trigger')) {
            activeElement.focus();
        }
    }

    // Handle escape key press
    function handleEscapeKey(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    // Add click event listeners to modal triggers
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                openModal(modalId);
            }
        });

        // Add keyboard support for triggers
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                if (modalId) {
                    openModal(modalId);
                }
            }
        });
    });

    // Close modal when clicking close button
    modalClose.addEventListener('click', closeModal);

    // Close modal when clicking overlay (outside modal content)
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Handle focus trap within modal
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }

    // Initialize focus trap when modal opens
    modalOverlay.addEventListener('transitionend', function() {
        if (modalOverlay.classList.contains('active')) {
            const modalContent = modalOverlay.querySelector('.modal-content');
            if (modalContent) {
                trapFocus(modalContent);
            }
        }
    });

    // Smooth scroll for modal content if it overflows
    function initializeModalScroll() {
        const modalContent = document.querySelector('.modal-content');
        if (modalContent && modalContent.scrollHeight > modalContent.clientHeight) {
            modalContent.style.overflowY = 'auto';
            
            // Custom scrollbar styling
            const style = document.createElement('style');
            style.textContent = `
                .modal-content::-webkit-scrollbar {
                    width: 8px;
                }
                .modal-content::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 4px;
                }
                .modal-content::-webkit-scrollbar-thumb {
                    background: #c1c1c1;
                    border-radius: 4px;
                }
                .modal-content::-webkit-scrollbar-thumb:hover {
                    background: #a8a8a8;
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize modal scroll when DOM is ready
    initializeModalScroll();

    // Animation for project cards on modal open
    function animateProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }

    // Trigger animation when modal opens
    modalOverlay.addEventListener('transitionend', function() {
        if (modalOverlay.classList.contains('active')) {
            animateProjectCards();
        }
    });

    // Add ripple effect to buttons
    function addRippleEffect(button) {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Apply ripple effect to all modal triggers
    modalTriggers.forEach(addRippleEffect);

    // Add CSS for ripple effect
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .modal-trigger {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Handle window resize to maintain modal responsiveness
    window.addEventListener('resize', function() {
        if (modalOverlay.classList.contains('active')) {
            // Recalculate modal position if needed
            const modalContainer = document.querySelector('.modal-container');
            if (modalContainer) {
                modalContainer.style.marginTop = '';
                modalContainer.style.marginTop = 'auto';
            }
        }
    });

    // Prevent modal from opening multiple times rapidly
    let modalOpening = false;
    
    function safeOpenModal(modalId) {
        if (!modalOpening) {
            modalOpening = true;
            openModal(modalId);
            
            setTimeout(() => {
                modalOpening = false;
            }, 300);
        }
    }

    // Update trigger event listeners to use safe open
    modalTriggers.forEach(trigger => {
        const originalClickHandler = trigger.onclick;
        trigger.onclick = function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            if (modalId) {
                safeOpenModal(modalId);
            }
        };
    });

    console.log('Modal system initialized successfully');
});
