/**
 * Interactive Hero Section - Parallax Mouse Movement
 * 
 * This script creates smooth parallax effects based on mouse movement.
 * Elements with data-speed attributes move at different speeds creating depth.
 * 
 * Features:
 * - Mouse-based parallax movement
 * - Smooth transitions with requestAnimationFrame
 * - Mobile/touch device support
 * - Performance optimized with throttling
 */

// Global variables for mouse tracking and animation
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;
let isAnimating = false;

// Configuration
const MOUSE_SENSITIVITY = 0.5; // How much mouse movement affects parallax
const SMOOTH_FACTOR = 0.05; // How smooth the animation is (lower = smoother)
const MAX_MOVEMENT = 50; // Maximum pixel movement for parallax elements

/**
 * Initialize the interactive hero section
 */
function initHero() {
    console.log('Initializing interactive hero section...');
    
    // Set up mouse tracking
    setupMouseTracking();
    
    // Set up touch support for mobile
    setupTouchSupport();
    
    // Start the animation loop
    startAnimationLoop();
    
    // Add button interactions
    setupButtonInteractions();
    
    // Add custom cursor effect
    setupCustomCursor();
    
    console.log('Hero section initialized successfully!');
}

/**
 * Set up mouse movement tracking
 */
function setupMouseTracking() {
    document.addEventListener('mousemove', (e) => {
        // Convert mouse position to center-based coordinates
        // (0,0) is center of screen, negative/positive values extend outward
        mouseX = (e.clientX - window.innerWidth / 2) * MOUSE_SENSITIVITY;
        mouseY = (e.clientY - window.innerHeight / 2) * MOUSE_SENSITIVITY;
    });
    
    // Reset position when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        mouseX = 0;
        mouseY = 0;
    });
}

/**
 * Set up touch support for mobile devices
 */
function setupTouchSupport() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
            const touch = e.touches[0];
            // Calculate relative movement from touch start
            const deltaX = (touch.clientX - touchStartX) * 0.3;
            const deltaY = (touch.clientY - touchStartY) * 0.3;
            
            mouseX = Math.max(-MAX_MOVEMENT, Math.min(MAX_MOVEMENT, deltaX));
            mouseY = Math.max(-MAX_MOVEMENT, Math.min(MAX_MOVEMENT, deltaY));
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        // Gradually return to center when touch ends
        mouseX = 0;
        mouseY = 0;
    });
}

/**
 * Start the main animation loop using requestAnimationFrame
 */
function startAnimationLoop() {
    function animate() {
        // Smooth interpolation towards target mouse position
        currentX += (mouseX - currentX) * SMOOTH_FACTOR;
        currentY += (mouseY - currentY) * SMOOTH_FACTOR;
        
        // Apply parallax movement to all elements with data-speed attribute
        applyParallaxMovement();
        
        // Continue the animation loop
        requestAnimationFrame(animate);
    }
    
    // Start the loop
    animate();
}

/**
 * Apply parallax movement to elements based on their data-speed attribute
 */
function applyParallaxMovement() {
    // Get all elements with data-speed attribute
    const parallaxElements = document.querySelectorAll('[data-speed]');
    
    parallaxElements.forEach(element => {
        // Get the speed multiplier from data attribute
        const speed = parseFloat(element.dataset.speed) || 0;
        
        // Calculate movement based on current mouse position and speed
        const moveX = currentX * speed;
        const moveY = currentY * speed;
        
        // Limit movement to prevent elements from going too far off-screen
        const limitedX = Math.max(-MAX_MOVEMENT, Math.min(MAX_MOVEMENT, moveX));
        const limitedY = Math.max(-MAX_MOVEMENT, Math.min(MAX_MOVEMENT, moveY));
        
        // Apply the transform
        element.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
    });
}

/**
 * Set up button interactions and click handlers
 */
function setupButtonInteractions() {
    const ctaButton = document.querySelector('.cta-button');
    const secondaryButton = document.querySelector('.secondary-button');
    
    // Add click handlers (customize these for your needs)
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            console.log('CTA button clicked - Add your navigation logic here');
            // Example: window.location.href = '#portfolio';
            showNotification('Exploring work...');
        });
    }
    
    if (secondaryButton) {
        secondaryButton.addEventListener('click', () => {
            console.log('Secondary button clicked - Add your contact logic here');
            // Example: window.location.href = '#contact';
            showNotification('Opening contact...');
        });
    }
    
    // Add scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            // Smooth scroll to next section
            const demoSection = document.querySelector('.demo-content');
            if (demoSection) {
                demoSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

/**
 * Create a custom cursor effect
 */
function setupCustomCursor() {
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
        transition: all 0.1s ease;
        backdrop-filter: blur(5px);
        border: 1px solid rgba(255, 255, 255, 0.3);
    `;
    document.body.appendChild(cursor);
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Cursor interactions
    const interactiveElements = document.querySelectorAll('button, .scroll-indicator');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'rgba(99, 102, 241, 0.8)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(255, 255, 255, 0.8)';
        });
    });
}

/**
 * Show a temporary notification (for demo purposes)
 */
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(99, 102, 241, 0.9);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 10000;
        font-size: 14px;
        font-weight: 500;
        backdrop-filter: blur(10px);
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

/**
 * Handle window resize to recalculate positions
 */
function handleResize() {
    // Reset mouse position on resize
    mouseX = 0;
    mouseY = 0;
    currentX = 0;
    currentY = 0;
    
    console.log('Window resized - parallax positions reset');
}

/**
 * Performance optimization: Throttle resize events
 */
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Set up resize handler with throttling
window.addEventListener('resize', throttle(handleResize, 250));

// Initialize everything when the DOM is ready
document.addEventListener('DOMContentLoaded', initHero);

// Additional utility functions for extending functionality

/**
 * Add new floating element dynamically
 * Usage: addFloatingElement('🚀', 0.6, { top: '30%', left: '60%' })
 */
function addFloatingElement(content, speed = 0.5, position = {}) {
    const element = document.createElement('div');
    element.className = 'floating-element dynamic-element';
    element.textContent = content;
    element.setAttribute('data-speed', speed);
    
    // Apply position
    Object.assign(element.style, {
        top: position.top || '50%',
        left: position.left || '50%',
        position: 'absolute',
        fontSize: '2rem',
        pointerEvents: 'none',
        zIndex: '3',
        animation: 'float 6s ease-in-out infinite'
    });
    
    document.querySelector('.hero').appendChild(element);
    
    console.log(`Added floating element: ${content} with speed: ${speed}`);
}

/**
 * Change the sensitivity of mouse movement
 * Usage: setMouseSensitivity(0.8) // Higher = more sensitive
 */
function setMouseSensitivity(sensitivity) {
    MOUSE_SENSITIVITY = Math.max(0.1, Math.min(2, sensitivity));
    console.log(`Mouse sensitivity set to: ${MOUSE_SENSITIVITY}`);
}

/* 
 * HOW TO SWAP IN ACTUAL GRAPHICS/IMAGES:
 * 
 * 1. Replace emoji floating elements:
 *    - Change the textContent of .floating-element to ''
 *    - Add background-image: url('path/to/your/image.png')
 *    - Set background-size: contain and background-repeat: no-repeat
 * 
 * 2. Replace SVG elements:
 *    - Replace the inline SVG with <img src="path/to/your/graphic.svg">
 *    - Or update the SVG content with your custom graphics
 * 
 * 3. Add your own images:
 *    - Use addFloatingElement() function with img elements
 *    - Or create new divs with background images
 * 
 * Example:
 * const img = document.createElement('img');
 * img.src = 'path/to/your/image.png';
 * img.setAttribute('data-speed', '0.7');
 * img.style.cssText = 'position: absolute; top: 40%; left: 70%; width: 60px;';
 * document.querySelector('.hero').appendChild(img);
 */