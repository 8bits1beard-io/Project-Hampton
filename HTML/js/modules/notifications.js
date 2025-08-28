/**
 * Notification System Module
 * Handles all user notifications and achievements
 */

export class NotificationSystem {
    constructor() {
        this.queue = [];
        this.isShowing = false;
        this.container = null;
    }

    init() {
        // Create notification container
        this.createContainer();
        
        // Set up achievement notifier
        window.achievementNotifier = this;
    }

    createContainer() {
        // Check if container already exists
        this.container = document.getElementById('notification-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'notification-container';
            this.container.className = 'notification-container';
            document.body.appendChild(this.container);
        }
    }

    show(message, type = 'info', duration = 3000) {
        const notification = {
            message,
            type,
            duration,
            id: Date.now()
        };

        this.queue.push(notification);
        
        if (!this.isShowing) {
            this.processQueue();
        }
    }

    processQueue() {
        if (this.queue.length === 0) {
            this.isShowing = false;
            return;
        }

        this.isShowing = true;
        const notification = this.queue.shift();
        this.displayNotification(notification);
    }

    displayNotification(notification) {
        const element = document.createElement('div');
        element.className = `notification notification-${notification.type}`;
        element.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getIcon(notification.type)}</span>
                <span class="notification-message">${notification.message}</span>
            </div>
        `;

        this.container.appendChild(element);

        // Animate in
        setTimeout(() => {
            element.classList.add('show');
        }, 10);

        // Remove after duration
        setTimeout(() => {
            element.classList.remove('show');
            setTimeout(() => {
                element.remove();
                this.processQueue();
            }, 300);
        }, notification.duration);
    }

    getIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️',
            'achievement': '🏆',
            'levelup': '🎯',
            'xp': '⭐'
        };
        return icons[type] || icons['info'];
    }

    showAchievement(achievement) {
        // Special handling for achievements
        const element = document.createElement('div');
        element.className = 'achievement-notification';
        element.innerHTML = `
            <div class="achievement-unlock">
                <div class="achievement-header">
                    <span class="achievement-label">Achievement Unlocked!</span>
                </div>
                <div class="achievement-body">
                    <span class="achievement-icon">${achievement.icon || '🏆'}</span>
                    <div class="achievement-details">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-description">${achievement.description}</div>
                        <div class="achievement-xp">+${achievement.xp || 50} XP</div>
                    </div>
                </div>
            </div>
        `;

        this.container.appendChild(element);

        // Animate in with special effects
        setTimeout(() => {
            element.classList.add('show');
            this.playAchievementSound();
        }, 10);

        // Remove after longer duration
        setTimeout(() => {
            element.classList.remove('show');
            setTimeout(() => {
                element.remove();
            }, 500);
        }, 5000);
    }

    playAchievementSound() {
        // Could add sound effects here
        console.log('🎵 Achievement sound!');
    }

    showProgress(message, percentage) {
        const existingProgress = document.getElementById('progress-notification');
        
        if (existingProgress) {
            // Update existing progress
            existingProgress.querySelector('.progress-message').textContent = message;
            existingProgress.querySelector('.progress-bar-fill').style.width = `${percentage}%`;
        } else {
            // Create new progress notification
            const element = document.createElement('div');
            element.id = 'progress-notification';
            element.className = 'notification notification-progress';
            element.innerHTML = `
                <div class="progress-content">
                    <span class="progress-message">${message}</span>
                    <div class="progress-bar">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                </div>
            `;
            
            this.container.appendChild(element);
            
            setTimeout(() => {
                element.classList.add('show');
            }, 10);
        }
    }

    hideProgress() {
        const progressNotification = document.getElementById('progress-notification');
        if (progressNotification) {
            progressNotification.classList.remove('show');
            setTimeout(() => {
                progressNotification.remove();
            }, 300);
        }
    }

    // Quick notification methods
    success(message) {
        this.show(message, 'success');
    }

    error(message) {
        this.show(message, 'error');
    }

    warning(message) {
        this.show(message, 'warning');
    }

    info(message) {
        this.show(message, 'info');
    }

    xp(amount) {
        this.show(`+${amount} XP`, 'xp', 2000);
    }
}