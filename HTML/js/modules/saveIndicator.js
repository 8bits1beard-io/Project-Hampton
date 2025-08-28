/**
 * Save Indicator Module
 * Shows save status and auto-save functionality
 */

export class SaveIndicator {
    constructor() {
        this.autoSaveInterval = 30000; // Auto-save every 30 seconds
        this.lastSaved = this.getLastSaved();
        this.indicator = null;
        this.autoSaveTimer = null;
    }

    init() {
        this.createIndicator();
        this.startAutoSave();
        this.updateDisplay();
        
        // Set up keyboard shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.manualSave();
            }
        });
    }

    createIndicator() {
        // Create save indicator element
        this.indicator = document.createElement('div');
        this.indicator.id = 'save-indicator';
        this.indicator.className = 'save-indicator';
        this.indicator.innerHTML = `
            <div class="save-status">
                <span class="save-icon">💾</span>
                <span class="save-text">All changes saved</span>
                <span class="save-time"></span>
            </div>
        `;

        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .save-indicator {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--surface-bg);
                border: 2px solid var(--surface-border);
                border-radius: var(--radius-lg);
                padding: 10px 15px;
                box-shadow: var(--shadow-md);
                z-index: 100;
                transition: all 0.3s ease;
                opacity: 0.8;
            }

            .save-indicator:hover {
                opacity: 1;
                transform: translateY(-2px);
                box-shadow: var(--shadow-lg);
            }

            .save-status {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 0.875rem;
            }

            .save-icon {
                font-size: 1.2rem;
                animation: none;
            }

            .save-icon.saving {
                animation: spin 1s linear infinite;
            }

            .save-icon.saved {
                animation: pulse 0.5s ease;
            }

            .save-text {
                color: var(--text-primary);
                font-weight: 500;
            }

            .save-time {
                color: var(--text-secondary);
                font-size: 0.75rem;
            }

            .save-indicator.saving {
                border-color: var(--victory-gold);
                background: linear-gradient(135deg, var(--surface-bg), rgba(255, 215, 0, 0.1));
            }

            .save-indicator.error {
                border-color: #EF4444;
                background: linear-gradient(135deg, var(--surface-bg), rgba(239, 68, 68, 0.1));
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }

            /* Mobile responsive */
            @media (max-width: 768px) {
                .save-indicator {
                    bottom: 70px;
                    right: 10px;
                    left: 10px;
                }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(this.indicator);
    }

    startAutoSave() {
        // Clear existing timer
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }

        // Start new auto-save timer
        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.autoSaveInterval);
    }

    async save() {
        this.showSaving();

        try {
            // Get current state from progress tracker
            const state = window.hamptonApp?.progressTracker?.state;
            
            if (state) {
                // Save to localStorage
                localStorage.setItem('hampton_progress', JSON.stringify(state));
                localStorage.setItem('lastSaved', new Date().toISOString());
                
                // Simulate network delay for visual feedback
                await new Promise(resolve => setTimeout(resolve, 500));
                
                this.lastSaved = new Date();
                this.showSaved();
                
                return true;
            }
        } catch (error) {
            console.error('Save failed:', error);
            this.showError();
            return false;
        }
    }

    autoSave() {
        console.log('Auto-saving...');
        this.save();
    }

    manualSave() {
        console.log('Manual save triggered');
        this.save().then(success => {
            if (success && window.hamptonApp?.notifications) {
                window.hamptonApp.notifications.show('Progress saved!', 'success', 2000);
            }
        });
    }

    showSaving() {
        const icon = this.indicator.querySelector('.save-icon');
        const text = this.indicator.querySelector('.save-text');
        
        this.indicator.classList.add('saving');
        this.indicator.classList.remove('error');
        icon.classList.add('saving');
        icon.textContent = '⏳';
        text.textContent = 'Saving...';
    }

    showSaved() {
        const icon = this.indicator.querySelector('.save-icon');
        const text = this.indicator.querySelector('.save-text');
        
        this.indicator.classList.remove('saving', 'error');
        icon.classList.remove('saving');
        icon.classList.add('saved');
        icon.textContent = '✅';
        text.textContent = 'All changes saved';
        
        this.updateDisplay();
        
        // Reset icon after animation
        setTimeout(() => {
            icon.classList.remove('saved');
            icon.textContent = '💾';
        }, 1000);
    }

    showError() {
        const icon = this.indicator.querySelector('.save-icon');
        const text = this.indicator.querySelector('.save-text');
        
        this.indicator.classList.add('error');
        this.indicator.classList.remove('saving');
        icon.classList.remove('saving');
        icon.textContent = '❌';
        text.textContent = 'Save failed';
        
        // Reset after 3 seconds
        setTimeout(() => {
            this.indicator.classList.remove('error');
            icon.textContent = '💾';
            text.textContent = 'All changes saved';
            this.updateDisplay();
        }, 3000);
    }

    getLastSaved() {
        const saved = localStorage.getItem('lastSaved');
        return saved ? new Date(saved) : null;
    }

    formatTimeSince(date) {
        if (!date) return '';
        
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);
        
        if (seconds < 5) return 'just now';
        if (seconds < 60) return `${seconds}s ago`;
        
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    }

    updateDisplay() {
        const timeElement = this.indicator.querySelector('.save-time');
        
        if (this.lastSaved) {
            timeElement.textContent = `(${this.formatTimeSince(this.lastSaved)})`;
        } else {
            timeElement.textContent = '';
        }
    }

    startUpdateTimer() {
        // Update the "time ago" display every 10 seconds
        setInterval(() => {
            this.updateDisplay();
        }, 10000);
    }

    setAutoSaveInterval(milliseconds) {
        this.autoSaveInterval = milliseconds;
        this.startAutoSave();
    }

    destroy() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
        }
        if (this.indicator) {
            this.indicator.remove();
        }
    }
}

// Export singleton instance
export const saveIndicator = new SaveIndicator();