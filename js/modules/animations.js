/**
 * Animations Module
 * Handles visual effects and animations
 */

export class Animations {
    constructor() {
        this.enabled = this.loadPreference();
    }

    loadPreference() {
        const saved = localStorage.getItem('animationsEnabled');
        return saved === null ? true : saved === 'true';
    }

    // Confetti animation for major achievements
    confetti(options = {}) {
        if (!this.enabled) return;

        const defaults = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4']
        };

        const config = { ...defaults, ...options };

        // Create confetti container
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(container);

        // Create particles
        for (let i = 0; i < config.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'confetti-particle';
            
            const color = config.colors[Math.floor(Math.random() * config.colors.length)];
            const size = Math.random() * 10 + 5;
            const duration = Math.random() * 3 + 2;
            const delay = Math.random() * 0.5;
            const startX = Math.random() * window.innerWidth;
            const endX = startX + (Math.random() - 0.5) * config.spread * 2;
            const rotation = Math.random() * 360;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${startX}px;
                top: -20px;
                transform: rotate(${rotation}deg);
                animation: confetti-fall ${duration}s ${delay}s ease-out forwards;
            `;

            container.appendChild(particle);
        }

        // Add animation styles if not already present
        if (!document.getElementById('confetti-styles')) {
            const style = document.createElement('style');
            style.id = 'confetti-styles';
            style.textContent = `
                @keyframes confetti-fall {
                    to {
                        transform: translateY(${window.innerHeight + 20}px) rotate(720deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Clean up after animation
        setTimeout(() => {
            container.remove();
        }, 6000);
    }

    // XP counter animation
    animateXP(element, startValue, endValue, duration = 1000) {
        if (!this.enabled) {
            element.textContent = endValue;
            return;
        }

        const start = Date.now();
        const diff = endValue - startValue;

        const animate = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuad = progress * (2 - progress);
            const currentValue = Math.floor(startValue + diff * easeOutQuad);
            
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = endValue;
                this.pulse(element);
            }
        };

        requestAnimationFrame(animate);
    }

    // Pulse animation for emphasis
    pulse(element, scale = 1.2) {
        if (!this.enabled) return;

        element.style.transition = 'transform 0.3s ease';
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }

    // Shake animation for errors
    shake(element) {
        if (!this.enabled) return;

        element.style.animation = 'shake 0.5s';
        
        // Add shake keyframes if not present
        if (!document.getElementById('shake-styles')) {
            const style = document.createElement('style');
            style.id = 'shake-styles';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Slide in animation
    slideIn(element, direction = 'left') {
        if (!this.enabled) {
            element.style.opacity = '1';
            return;
        }

        const translations = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };

        element.style.transform = translations[direction];
        element.style.opacity = '0';
        element.style.transition = 'transform 0.5s ease, opacity 0.5s ease';

        setTimeout(() => {
            element.style.transform = 'translate(0)';
            element.style.opacity = '1';
        }, 10);
    }

    // Fade animation
    fade(element, fadeIn = true, duration = 300) {
        if (!this.enabled) {
            element.style.opacity = fadeIn ? '1' : '0';
            return;
        }

        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = fadeIn ? '1' : '0';
    }

    // Sparkle effect for achievements
    sparkle(element) {
        if (!this.enabled) return;

        const sparkleContainer = document.createElement('div');
        sparkleContainer.className = 'sparkle-container';
        sparkleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;
        `;

        element.style.position = 'relative';
        element.appendChild(sparkleContainer);

        // Create sparkles
        for (let i = 0; i < 8; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 1;

            sparkle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: #FFD700;
                border-radius: 50%;
                left: ${left}%;
                top: ${top}%;
                animation: sparkle-animation 1s ${delay}s ease-out forwards;
            `;

            sparkleContainer.appendChild(sparkle);
        }

        // Add sparkle animation if not present
        if (!document.getElementById('sparkle-styles')) {
            const style = document.createElement('style');
            style.id = 'sparkle-styles';
            style.textContent = `
                @keyframes sparkle-animation {
                    0% {
                        transform: scale(0) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.5) rotate(180deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Clean up
        setTimeout(() => {
            sparkleContainer.remove();
        }, 2000);
    }

    // Progress bar animation
    animateProgressBar(element, targetWidth, duration = 500) {
        if (!this.enabled) {
            element.style.width = targetWidth;
            return;
        }

        element.style.transition = `width ${duration}ms ease-out`;
        element.style.width = targetWidth;
    }

    // Level up animation
    levelUpAnimation(element) {
        if (!this.enabled) return;

        // Create level up banner
        const banner = document.createElement('div');
        banner.className = 'level-up-banner';
        banner.innerHTML = `
            <div class="level-up-content">
                <h2>LEVEL UP!</h2>
                <div class="level-up-stars">⭐⭐⭐</div>
            </div>
        `;

        banner.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem 4rem;
            border-radius: 1rem;
            z-index: 10000;
            text-align: center;
            animation: level-up-appear 0.5s ease-out forwards;
        `;

        // Add animation styles
        if (!document.getElementById('level-up-styles')) {
            const style = document.createElement('style');
            style.id = 'level-up-styles';
            style.textContent = `
                @keyframes level-up-appear {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(-180deg);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    }
                }
                .level-up-content h2 {
                    font-size: 3rem;
                    margin: 0;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                .level-up-stars {
                    font-size: 2rem;
                    animation: star-pulse 0.5s ease-in-out infinite alternate;
                }
                @keyframes star-pulse {
                    from { transform: scale(1); }
                    to { transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(banner);

        // Trigger confetti
        this.confetti({ particleCount: 50 });

        // Remove after animation
        setTimeout(() => {
            banner.style.animation = 'level-up-appear 0.5s ease-in reverse';
            setTimeout(() => banner.remove(), 500);
        }, 2000);
    }

    // Module complete animation
    moduleCompleteAnimation() {
        if (!this.enabled) return;

        const checkmark = document.createElement('div');
        checkmark.innerHTML = '✅';
        checkmark.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            font-size: 5rem;
            z-index: 10000;
            animation: checkmark-pop 0.6s ease-out forwards;
        `;

        if (!document.getElementById('checkmark-styles')) {
            const style = document.createElement('style');
            style.id = 'checkmark-styles';
            style.textContent = `
                @keyframes checkmark-pop {
                    0% {
                        transform: translate(-50%, -50%) scale(0) rotate(-180deg);
                    }
                    50% {
                        transform: translate(-50%, -50%) scale(1.3) rotate(10deg);
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(1) rotate(0deg);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(checkmark);

        setTimeout(() => {
            checkmark.style.animation = 'checkmark-pop 0.3s ease-in reverse';
            setTimeout(() => checkmark.remove(), 300);
        }, 1000);
    }

    // Toggle animations on/off
    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('animationsEnabled', this.enabled.toString());
        return this.enabled;
    }
}

// Export singleton instance
export const animations = new Animations();