/**
 * Main Application Controller
 * Initializes and manages all modules
 */

import { progressTracker } from './modules/progressTracker.js';
import { gamification } from './modules/gamification.js';
import { CourseContent } from './modules/courseContent.js';
import { UIController } from './modules/uiController.js';
import { ThemeManager } from './modules/themeManager.js';
import { NotificationSystem } from './modules/notifications.js';

class HamptonApp {
    constructor() {
        this.progressTracker = progressTracker;
        this.gamification = gamification;
        this.courseContent = new CourseContent();
        this.ui = new UIController();
        this.themeManager = new ThemeManager();
        this.notifications = new NotificationSystem();
        
        this.currentView = 'home';
        this.selectedProject = null;
    }

    async init() {
        console.log('🚀 Initializing Project: Hampton v0.0.2');
        
        // Initialize theme
        this.themeManager.init();
        
        // Load user progress
        const userState = this.progressTracker.state;
        
        // Initialize UI
        this.ui.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load content
        await this.loadContent();
        
        // Check for saved progress
        if (userState.selectedProject) {
            this.selectedProject = userState.selectedProject;
            this.showDashboard();
        } else {
            this.showProjectSelection();
        }
        
        // Initialize notifications
        this.notifications.init();
        
        // Check daily challenges
        this.checkDailyChallenges();
        
        // Update UI with current state
        this.updateUI();
    }

    setupEventListeners() {
        // Project selection
        document.addEventListener('selectProject', (e) => {
            this.selectProject(e.detail.project);
        });
        
        // Module completion
        document.addEventListener('completeModule', (e) => {
            this.completeModule(e.detail.week, e.detail.module);
        });
        
        // Progress code events
        document.addEventListener('saveProgress', () => {
            this.saveProgress();
        });
        
        document.addEventListener('loadProgress', (e) => {
            this.loadProgress(e.detail.code);
        });
        
        // Navigation
        document.addEventListener('navigate', (e) => {
            this.navigate(e.detail.view);
        });
        
        // Theme switching
        document.addEventListener('themeChange', (e) => {
            this.themeManager.setTheme(e.detail.theme);
        });
        
        // Tool switching
        document.addEventListener('toolChange', (e) => {
            this.themeManager.setTool(e.detail.tool);
        });
    }

    async loadContent() {
        try {
            console.log('📚 Loading course content...');
            
            // Load 30-day curriculum
            await this.courseContent.loadCurriculum();
            
            // Load all week content (legacy support)
            for (let week = 1; week <= 8; week++) {
                await this.courseContent.loadWeek(week);
            }
            console.log('✅ Course content loaded');
        } catch (error) {
            console.error('Failed to load course content:', error);
            this.notifications.show('Failed to load course content', 'error');
        }
    }

    showProjectSelection() {
        this.currentView = 'project-selection';
        this.ui.renderProjectSelection();
    }

    showDashboard() {
        this.currentView = 'dashboard';
        const userState = this.progressTracker.state;
        
        // Support both daily and weekly formats
        let currentContent;
        if (userState.currentDay > 0) {
            // Daily format
            currentContent = this.courseContent.getDay(userState.currentDay, userState.selectedProject);
        } else {
            // Weekly format (legacy)
            currentContent = this.courseContent.getWeek(userState.currentWeek || 1);
        }
        
        this.ui.renderDashboard({
            user: userState,
            currentWeek: currentContent,
            currentDay: currentContent,
            achievements: this.gamification.achievements,
            dailyChallenges: this.gamification.dailyChallenges,
            isDaily: userState.currentDay > 0
        });
    }

    selectProject(projectType) {
        // Save project selection
        this.progressTracker.selectProject(projectType);
        this.selectedProject = projectType;
        
        // Show welcome message
        this.notifications.show(
            `Welcome to the ${projectType} path! Let's build something amazing together.`,
            'success'
        );
        
        // Navigate to dashboard
        this.showDashboard();
    }
    
    completeLesson(day, lessonIndex) {
        const result = this.progressTracker.completeLesson(day, lessonIndex);
        
        if (result) {
            // Show completion notification
            this.notifications.show(
                `Lesson ${lessonIndex + 1} completed! +${50 + (day * 5)} XP`,
                'success'
            );
            
            // Refresh dashboard
            this.showDashboard();
        }
        
        return result;
    }

    completeModule(week, module) {
        const result = this.progressTracker.completeModule(week, module);
        
        if (result) {
            // Show completion notification
            this.notifications.show(
                `Module completed! +100 XP earned`,
                'success'
            );
            
            // Check for new achievements
            this.checkAchievements();
            
            // Update UI
            this.updateUI();
            
            // Check if week is complete
            const weekState = this.progressTracker.state.weekProgress[`week${week}`];
            if (weekState.completed) {
                this.notifications.show(
                    `🎉 Week ${week} Complete! +500 XP bonus!`,
                    'achievement'
                );
            }
        } else {
            this.notifications.show(
                'Module already completed',
                'info'
            );
        }
    }

    checkAchievements() {
        const userState = this.progressTracker.state;
        const achievements = this.gamification.achievements;
        
        achievements.forEach(achievement => {
            if (this.gamification.checkAchievement(achievement.id, userState)) {
                this.progressTracker.unlockAchievement(
                    achievement.id,
                    achievement.name,
                    achievement.description
                );
                
                this.notifications.showAchievement(achievement);
            }
        });
        
        // Check badges
        const newBadges = this.gamification.checkBadges(userState);
        newBadges.forEach(badge => {
            this.notifications.show(
                `New badge earned: ${badge.name} ${badge.icon}`,
                'achievement'
            );
        });
    }

    checkDailyChallenges() {
        const challenges = this.gamification.dailyChallenges;
        const today = new Date().toDateString();
        
        // Reset if new day
        const lastCheck = localStorage.getItem('lastChallengeCheck');
        if (lastCheck !== today) {
            this.gamification.dailyChallenges = this.gamification.generateDailyChallenges();
            localStorage.setItem('lastChallengeCheck', today);
        }
    }

    saveProgress() {
        const code = this.progressTracker.generateProgressCode();
        
        // Copy to clipboard
        navigator.clipboard.writeText(code).then(() => {
            this.notifications.show(
                `Progress code copied to clipboard: ${code}`,
                'success'
            );
        });
        
        // Show in modal
        this.ui.showProgressCode(code);
    }

    loadProgress(code) {
        const result = this.progressTracker.loadFromCode(code);
        
        if (result.success) {
            this.notifications.show(
                'Progress loaded successfully!',
                'success'
            );
            
            // Refresh UI
            this.selectedProject = result.state.selectedProject;
            this.showDashboard();
        } else {
            this.notifications.show(
                `Invalid progress code: ${result.error}`,
                'error'
            );
        }
    }

    navigate(view) {
        this.currentView = view;
        
        switch(view) {
            case 'home':
                this.showProjectSelection();
                break;
            case 'dashboard':
                this.showDashboard();
                break;
            case 'achievements':
                this.ui.renderAchievements(this.progressTracker.state);
                break;
            case 'leaderboard':
                this.ui.renderLeaderboard();
                break;
            case 'settings':
                this.ui.renderSettings();
                break;
            default:
                console.warn('Unknown view:', view);
        }
    }

    updateUI() {
        const userState = this.progressTracker.state;
        
        // Update progress bar
        const progressPercentage = this.progressTracker.getProgressPercentage();
        this.ui.updateProgressBar(progressPercentage);
        
        // Update XP and level
        this.ui.updateXPDisplay(userState.xp, userState.level);
        
        // Update streak
        this.ui.updateStreak(userState.dailyStreak);
        
        // Update motivational message
        const message = this.gamification.getMotivationalMessage(progressPercentage);
        this.ui.updateMotivationalMessage(message);
    }

    // Development helper methods
    skipToWeek(week) {
        if (confirm(`Skip to week ${week}? This will mark all previous content as complete.`)) {
            for (let w = 1; w < week; w++) {
                for (let m = 1; m <= 5; m++) {
                    this.progressTracker.completeModule(w, m);
                }
            }
            this.updateUI();
            this.showDashboard();
        }
    }

    resetProgress() {
        if (this.progressTracker.resetProgress()) {
            this.selectedProject = null;
            this.showProjectSelection();
            this.notifications.show('Progress reset', 'info');
        }
    }

    // Export for debugging
    debug() {
        return {
            state: this.progressTracker.state,
            achievements: this.gamification.achievements,
            app: this
        };
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.hamptonApp = new HamptonApp();
    window.hamptonApp.init();
    
    // Export for debugging
    window.debug = () => window.hamptonApp.debug();
});

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('ServiceWorker registered:', registration);
    }).catch(error => {
        console.log('ServiceWorker registration failed:', error);
    });
}