/**
 * Progress Tracker Module
 * Manages user progress, achievements, and state persistence
 */

export class ProgressTracker {
    constructor() {
        this.storageKey = 'hampton_progress';
        this.state = this.loadState();
    }

    // Default state for new users
    getDefaultState() {
        return {
            userId: this.generateUserId(),
            selectedProject: null,
            currentDay: 0,
            currentLesson: 0,
            completedLessons: [],
            xp: 0,
            level: 1,
            achievements: [],
            dailyStreak: 0,
            lastActivityDate: null,
            startDate: new Date().toISOString(),
            skills: {
                html: 0,
                css: 0,
                javascript: 0,
                git: 0,
                ai_prompting: 0,
                debugging: 0,
                deployment: 0,
                databases: 0,
                networking: 0,
                gamedev: 0,
                tailwind: 0,
                analytics: 0,
                microsoft_graph: 0,
                azure_ad: 0,
                oauth2: 0,
                intune_api: 0,
                data_visualization: 0
            },
            dailyProgress: {},  // Will store day1 through day30
            weekProgress: {
                week1: { days: [], completed: false },
                week2: { days: [], completed: false },
                week3: { days: [], completed: false },
                week4: { days: [], completed: false }
            }
        };
    }

    // Load state from localStorage
    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
        return this.getDefaultState();
    }

    // Save state to localStorage
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            return true;
        } catch (e) {
            console.error('Failed to save progress:', e);
            return false;
        }
    }

    // Generate unique user ID
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Get current day info
    getCurrentDayInfo() {
        return {
            day: this.state.currentDay,
            lesson: this.state.currentLesson,
            week: Math.ceil(this.state.currentDay / 7),
            progressPercent: this.getProgressPercentage()
        };
    }

    // Select a project path
    selectProject(projectType) {
        const validProjects = ['tictactoe', 'servicenow', 'automation', 'msgraph'];
        if (!validProjects.includes(projectType)) {
            throw new Error('Invalid project type');
        }
        
        this.state.selectedProject = projectType;
        
        // Set up for 30-day format
        this.state.currentDay = 1;
        this.state.currentLesson = 0;
        
        // Keep legacy week/module for backward compatibility
        this.state.currentWeek = 1;
        this.state.currentModule = 1;
        
        this.saveState();
        
        return this.state;
    }

    // Complete a module
    completeModule(week, module) {
        const moduleId = `w${week}m${module}`;
        
        // Check if already completed
        if (this.state.completedModules.includes(moduleId)) {
            return false;
        }

        // Add to completed modules
        this.state.completedModules.push(moduleId);
        
        // Update week progress
        const weekKey = `week${week}`;
        if (!this.state.weekProgress[weekKey].modules.includes(module)) {
            this.state.weekProgress[weekKey].modules.push(module);
        }
        
        // Award XP
        this.addXP(100);
        
        // Check if week is complete (assuming 5 modules per week)
        if (this.state.weekProgress[weekKey].modules.length >= 5) {
            this.state.weekProgress[weekKey].completed = true;
            this.unlockAchievement('week_complete', `Completed Week ${week}`);
            this.addXP(500); // Bonus for completing week
        }
        
        // Update current position
        if (week === this.state.currentWeek && module === this.state.currentModule) {
            if (module < 5) {
                this.state.currentModule++;
            } else if (week < 8) {
                this.state.currentWeek++;
                this.state.currentModule = 1;
            }
        }
        
        // Update last activity
        this.updateActivity();
        
        this.saveState();
        return true;
    }

    // Add XP and handle leveling
    addXP(amount) {
        this.state.xp += amount;
        
        // Calculate level (100 XP per level, increasing requirement)
        const newLevel = Math.floor(Math.sqrt(this.state.xp / 50)) + 1;
        
        if (newLevel > this.state.level) {
            this.state.level = newLevel;
            this.unlockAchievement('level_up', `Reached Level ${newLevel}`);
        }
        
        return this.state.xp;
    }

    // Update skill progress
    updateSkill(skillName, points) {
        if (this.state.skills.hasOwnProperty(skillName)) {
            this.state.skills[skillName] = Math.min(100, this.state.skills[skillName] + points);
            
            // Check for skill mastery
            if (this.state.skills[skillName] >= 100) {
                this.unlockAchievement(`master_${skillName}`, `Mastered ${skillName}`);
            }
            
            this.saveState();
            return this.state.skills[skillName];
        }
        return null;
    }

    // Unlock an achievement
    unlockAchievement(id, name, description = '') {
        const achievement = {
            id,
            name,
            description,
            unlockedAt: new Date().toISOString()
        };
        
        // Check if already unlocked
        if (!this.state.achievements.find(a => a.id === id)) {
            this.state.achievements.push(achievement);
            this.addXP(50); // Award XP for achievement
            this.saveState();
            
            // Trigger notification
            this.notifyAchievement(achievement);
            return true;
        }
        
        return false;
    }

    // Update daily activity and streak
    updateActivity() {
        const today = new Date().toDateString();
        const lastActivity = this.state.lastActivityDate ? new Date(this.state.lastActivityDate).toDateString() : null;
        
        if (lastActivity !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastActivity === yesterday.toDateString()) {
                // Continuing streak
                this.state.dailyStreak++;
                
                // Check for streak achievements
                if (this.state.dailyStreak === 7) {
                    this.unlockAchievement('week_streak', 'Week Warrior', '7 day streak!');
                } else if (this.state.dailyStreak === 30) {
                    this.unlockAchievement('month_streak', 'Monthly Master', '30 day streak!');
                }
            } else {
                // Streak broken
                this.state.dailyStreak = 1;
            }
            
            this.state.lastActivityDate = new Date().toISOString();
        }
    }

    // Generate progress code
    generateProgressCode() {
        const projectCodeMap = {
            'tictactoe': 'TICT',
            'servicenow': 'SNOW', 
            'automation': 'AUTO',
            'msgraph': 'MSFT'
        };
        
        const data = {
            p: this.state.selectedProject ? projectCodeMap[this.state.selectedProject] || 'NONE' : 'NONE',
            w: this.state.currentWeek,
            m: this.state.currentModule,
            x: Math.floor(this.state.xp / 100),
            a: this.state.achievements.length,
            c: this.state.completedModules.length
        };
        
        // Encode to base36 for compactness
        const encoded = btoa(JSON.stringify(data))
            .replace(/[^A-Za-z0-9]/g, '')
            .substr(0, 12)
            .toUpperCase();
        
        // Format as HAMPTON-PROJ-XXXX-YYYY-ZZZZ
        const projectCode = data.p;
        const chunk1 = `W${data.w}M${data.m}`;
        const chunk2 = this.generateChecksum(encoded).substr(0, 4);
        const chunk3 = encoded.substr(0, 4);
        
        return `HAMPTON-${projectCode}-${chunk1}-${chunk2}-${chunk3}`;
    }

    // Parse progress code
    parseProgressCode(code) {
        try {
            const parts = code.toUpperCase().replace(/\s/g, '').split('-');
            
            if (parts[0] !== 'HAMPTON' || parts.length !== 5) {
                throw new Error('Invalid code format');
            }
            
            // Extract basic info from visible parts
            const projectMap = {
                'TICT': 'tictactoe',
                'SNOW': 'servicenow',
                'AUTO': 'automation',
                'MSFT': 'msgraph'
            };
            
            const project = projectMap[parts[1]] || null;
            const weekModule = parts[2].match(/W(\d+)M(\d+)/);
            
            if (!weekModule) {
                throw new Error('Invalid week/module format');
            }
            
            return {
                valid: true,
                project: project,
                week: parseInt(weekModule[1]),
                module: parseInt(weekModule[2])
            };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    }

    // Load from progress code
    loadFromCode(code) {
        const parsed = this.parseProgressCode(code);
        
        if (!parsed.valid) {
            return { success: false, error: parsed.error };
        }
        
        // Create new state from code
        const newState = this.getDefaultState();
        newState.selectedProject = parsed.project;
        newState.currentWeek = parsed.week;
        newState.currentModule = parsed.module;
        
        // Estimate progress based on position
        const totalModules = (parsed.week - 1) * 5 + parsed.module - 1;
        newState.xp = totalModules * 100;
        newState.level = Math.floor(Math.sqrt(newState.xp / 50)) + 1;
        
        // Mark completed modules
        for (let w = 1; w < parsed.week; w++) {
            for (let m = 1; m <= 5; m++) {
                newState.completedModules.push(`w${w}m${m}`);
                newState.weekProgress[`week${w}`].modules.push(m);
            }
            newState.weekProgress[`week${w}`].completed = true;
        }
        
        // Add current week progress
        for (let m = 1; m < parsed.module; m++) {
            newState.completedModules.push(`w${parsed.week}m${m}`);
            newState.weekProgress[`week${parsed.week}`].modules.push(m);
        }
        
        this.state = newState;
        this.saveState();
        
        return { success: true, state: this.state };
    }

    // Generate checksum for code validation
    generateChecksum(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(36).toUpperCase();
    }

    // Notify achievement unlock (can be connected to UI)
    notifyAchievement(achievement) {
        if (window.achievementNotifier) {
            window.achievementNotifier.show(achievement);
        }
        console.log('Achievement Unlocked:', achievement.name);
    }

    // Get current progress percentage
    getProgressPercentage() {
        const totalModules = 40; // 8 weeks * 5 modules
        return Math.round((this.state.completedModules.length / totalModules) * 100);
    }

    // Check if user can access a module
    canAccessModule(week, module) {
        // Can only access if previous modules are complete
        if (week === 1 && module === 1) return true;
        
        if (module > 1) {
            return this.state.completedModules.includes(`w${week}m${module - 1}`);
        } else if (week > 1) {
            return this.state.weekProgress[`week${week - 1}`].completed;
        }
        
        return false;
    }

    // Reset progress
    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            this.state = this.getDefaultState();
            this.saveState();
            return true;
        }
        return false;
    }
}

// Export singleton instance
export const progressTracker = new ProgressTracker();