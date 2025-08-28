/**
 * Gamification Engine
 * Handles achievements, badges, XP, and rewards
 */

export class GamificationEngine {
    constructor() {
        this.achievements = this.defineAchievements();
        this.badges = this.defineBadges();
        this.dailyChallenges = this.generateDailyChallenges();
    }

    defineAchievements() {
        return [
            // Progress Achievements
            { id: 'first_blood', name: 'First Blood', description: 'Complete your first module', xp: 50, icon: '🎯' },
            { id: 'week_warrior', name: 'Week Warrior', description: 'Complete an entire week', xp: 200, icon: '⚔️' },
            { id: 'halfway_hero', name: 'Halfway Hero', description: 'Reach Week 4', xp: 500, icon: '🏃' },
            { id: 'graduation_day', name: 'Graduation Day', description: 'Complete all 8 weeks', xp: 2000, icon: '🎓' },
            
            // Skill Achievements
            { id: 'html_master', name: 'HTML Master', description: 'Master HTML skills', xp: 300, icon: '📝' },
            { id: 'css_wizard', name: 'CSS Wizard', description: 'Master CSS skills', xp: 300, icon: '🎨' },
            { id: 'js_ninja', name: 'JavaScript Ninja', description: 'Master JavaScript skills', xp: 500, icon: '🥷' },
            { id: 'git_guru', name: 'Git Guru', description: 'Master version control', xp: 400, icon: '🔀' },
            { id: 'ai_whisperer', name: 'AI Whisperer', description: 'Master AI prompting', xp: 600, icon: '🤖' },
            
            // Speed Achievements
            { id: 'speed_demon', name: 'Speed Demon', description: 'Complete 3 modules in one day', xp: 150, icon: '⚡' },
            { id: 'marathon_runner', name: 'Marathon Runner', description: 'Study for 7 days straight', xp: 300, icon: '🏃‍♂️' },
            { id: 'night_owl', name: 'Night Owl', description: 'Complete a module after midnight', xp: 100, icon: '🦉' },
            { id: 'early_bird', name: 'Early Bird', description: 'Complete a module before 6 AM', xp: 100, icon: '🐦' },
            
            // Special Achievements
            { id: 'bug_squasher', name: 'Bug Squasher', description: 'Fix 10 bugs in your code', xp: 200, icon: '🐛' },
            { id: 'perfect_week', name: 'Perfect Week', description: 'Complete all daily challenges for a week', xp: 400, icon: '⭐' },
            { id: 'code_reviewer', name: 'Code Reviewer', description: 'Review and improve your code 5 times', xp: 250, icon: '👀' },
            { id: 'documentation_hero', name: 'Documentation Hero', description: 'Write comprehensive docs', xp: 300, icon: '📚' },
            
            // Project Achievements
            { id: 'dashboard_complete', name: 'Dashboard Master', description: 'Complete the Dashboard project', xp: 1000, icon: '📊' },
            { id: 'blog_complete', name: 'Blog Builder', description: 'Complete the Blog project', xp: 1000, icon: '✍️' },
            { id: 'automation_complete', name: 'Automation Expert', description: 'Complete the Automation project', xp: 1000, icon: '🤖' },
            
            // Social Achievements
            { id: 'helper', name: 'Helpful Hampton', description: 'Help another student', xp: 150, icon: '🤝' },
            { id: 'sharer', name: 'Knowledge Sharer', description: 'Share your progress', xp: 100, icon: '📢' },
            { id: 'contributor', name: 'Open Source Contributor', description: 'Contribute to a project', xp: 500, icon: '🌟' }
        ];
    }

    defineBadges() {
        return [
            // Level Badges
            { id: 'beginner', name: 'Beginner', requirement: 'level_1', icon: '🌱' },
            { id: 'novice', name: 'Novice', requirement: 'level_5', icon: '🌿' },
            { id: 'intermediate', name: 'Intermediate', requirement: 'level_10', icon: '🌳' },
            { id: 'advanced', name: 'Advanced', requirement: 'level_15', icon: '🏔️' },
            { id: 'expert', name: 'Expert', requirement: 'level_20', icon: '👑' },
            { id: 'master', name: 'Master', requirement: 'level_25', icon: '🏆' },
            
            // Skill Badges
            { id: 'frontend_badge', name: 'Frontend Developer', requirement: 'skills_frontend', icon: '🎨' },
            { id: 'backend_badge', name: 'Backend Developer', requirement: 'skills_backend', icon: '⚙️' },
            { id: 'fullstack_badge', name: 'Full Stack Developer', requirement: 'skills_fullstack', icon: '🚀' },
            
            // Special Badges
            { id: 'perfectionist', name: 'Perfectionist', requirement: 'no_hints_week', icon: '💎' },
            { id: 'persistent', name: 'Persistent', requirement: 'retry_5_times', icon: '💪' },
            { id: 'creative', name: 'Creative', requirement: 'custom_solution', icon: '🎭' }
        ];
    }

    generateDailyChallenges() {
        const challenges = [
            { id: 'daily_module', name: 'Daily Progress', description: 'Complete one module today', xp: 50, difficulty: 'easy' },
            { id: 'no_hints', name: 'No Hints', description: 'Complete a module without using hints', xp: 100, difficulty: 'medium' },
            { id: 'speed_run', name: 'Speed Run', description: 'Complete a module in under 30 minutes', xp: 150, difficulty: 'hard' },
            { id: 'perfect_code', name: 'Perfect Code', description: 'Write code that passes all tests on first try', xp: 200, difficulty: 'hard' },
            { id: 'documentation', name: 'Document It', description: 'Add comments to all your functions', xp: 75, difficulty: 'easy' },
            { id: 'refactor', name: 'Refactor Master', description: 'Improve existing code', xp: 125, difficulty: 'medium' },
            { id: 'git_commit', name: 'Git Good', description: 'Make 5 meaningful commits', xp: 100, difficulty: 'medium' },
            { id: 'ai_efficiency', name: 'AI Efficiency', description: 'Complete a task with < 5 AI prompts', xp: 175, difficulty: 'hard' }
        ];
        
        // Select 3 random challenges for today
        const today = new Date().toDateString();
        const seed = this.hashCode(today);
        const shuffled = this.seededShuffle(challenges, seed);
        
        return shuffled.slice(0, 3).map(challenge => ({
            ...challenge,
            completed: false,
            date: today
        }));
    }

    // Check if achievement should be unlocked
    checkAchievement(achievementId, userState) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return false;
        
        // Check if already unlocked
        if (userState.achievements.find(a => a.id === achievementId)) {
            return false;
        }
        
        // Check specific conditions
        switch(achievementId) {
            case 'first_blood':
                return userState.completedModules.length >= 1;
            
            case 'week_warrior':
                return Object.values(userState.weekProgress).some(week => week.completed);
            
            case 'halfway_hero':
                return userState.currentWeek >= 4;
            
            case 'graduation_day':
                return userState.currentWeek === 8 && userState.weekProgress.week8.completed;
            
            case 'speed_demon':
                return this.checkSpeedDemon(userState);
            
            case 'marathon_runner':
                return userState.dailyStreak >= 7;
            
            default:
                return false;
        }
    }

    // Check multiple modules in one day
    checkSpeedDemon(userState) {
        const today = new Date().toDateString();
        const todayModules = userState.completedModules.filter(module => {
            // This would need timestamp tracking in real implementation
            return true; // Placeholder
        });
        return todayModules.length >= 3;
    }

    // Calculate total XP from all sources
    calculateTotalXP(userState) {
        let totalXP = userState.xp || 0;
        
        // Add XP from achievements
        userState.achievements.forEach(achievementId => {
            const achievement = this.achievements.find(a => a.id === achievementId.id);
            if (achievement) {
                totalXP += achievement.xp;
            }
        });
        
        return totalXP;
    }

    // Get level from XP
    getLevelFromXP(xp) {
        // Level formula: each level requires increasingly more XP
        return Math.floor(Math.sqrt(xp / 50)) + 1;
    }

    // Get XP required for next level
    getXPForNextLevel(currentLevel) {
        return Math.pow((currentLevel), 2) * 50;
    }

    // Get level progress percentage
    getLevelProgress(xp, level) {
        const currentLevelXP = Math.pow((level - 1), 2) * 50;
        const nextLevelXP = this.getXPForNextLevel(level);
        const progressXP = xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        
        return Math.round((progressXP / requiredXP) * 100);
    }

    // Check and award badges
    checkBadges(userState) {
        const newBadges = [];
        
        this.badges.forEach(badge => {
            // Skip if already earned
            if (userState.badges && userState.badges.includes(badge.id)) {
                return;
            }
            
            let earned = false;
            
            // Check badge requirements
            if (badge.requirement.startsWith('level_')) {
                const requiredLevel = parseInt(badge.requirement.split('_')[1]);
                earned = userState.level >= requiredLevel;
            } else if (badge.requirement.startsWith('skills_')) {
                const type = badge.requirement.split('_')[1];
                earned = this.checkSkillBadge(type, userState.skills);
            }
            
            if (earned) {
                newBadges.push(badge);
            }
        });
        
        return newBadges;
    }

    // Check skill-based badges
    checkSkillBadge(type, skills) {
        switch(type) {
            case 'frontend':
                return skills.html >= 80 && skills.css >= 80 && skills.javascript >= 60;
            case 'backend':
                return skills.databases >= 80 && skills.javascript >= 80;
            case 'fullstack':
                return skills.html >= 80 && skills.css >= 80 && 
                       skills.javascript >= 80 && skills.databases >= 80;
            default:
                return false;
        }
    }

    // Get leaderboard ranking
    getLeaderboardRank(userXP, allUsers = []) {
        // In a real app, this would query a database
        const sortedUsers = allUsers.sort((a, b) => b.xp - a.xp);
        const rank = sortedUsers.findIndex(user => user.xp <= userXP) + 1;
        
        return {
            rank: rank || allUsers.length + 1,
            total: allUsers.length + 1,
            percentile: Math.round(((allUsers.length + 1 - rank) / (allUsers.length + 1)) * 100)
        };
    }

    // Utility: Seeded random shuffle
    seededShuffle(array, seed) {
        const shuffled = [...array];
        let currentIndex = shuffled.length;
        
        while (currentIndex !== 0) {
            const randomIndex = Math.floor(this.seededRandom(seed + currentIndex) * currentIndex);
            currentIndex--;
            
            [shuffled[currentIndex], shuffled[randomIndex]] = 
            [shuffled[randomIndex], shuffled[currentIndex]];
        }
        
        return shuffled;
    }

    // Utility: Seeded random number
    seededRandom(seed) {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Utility: Hash code from string
    hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Format XP display
    formatXP(xp) {
        if (xp >= 1000000) {
            return (xp / 1000000).toFixed(1) + 'M';
        } else if (xp >= 1000) {
            return (xp / 1000).toFixed(1) + 'K';
        }
        return xp.toString();
    }

    // Get motivational message based on progress
    getMotivationalMessage(progressPercentage) {
        if (progressPercentage < 10) {
            return "Welcome to your coding journey! Every expert was once a beginner.";
        } else if (progressPercentage < 25) {
            return "Great start! You're building a strong foundation.";
        } else if (progressPercentage < 50) {
            return "Impressive progress! You're really getting the hang of this.";
        } else if (progressPercentage < 75) {
            return "You're over halfway there! Keep up the amazing work!";
        } else if (progressPercentage < 90) {
            return "You're in the home stretch! Your dedication is inspiring.";
        } else if (progressPercentage < 100) {
            return "Almost there! You're about to achieve something incredible.";
        } else {
            return "Congratulations! You've completed your journey. Mr. Hampton would be proud!";
        }
    }
}

// Export singleton instance
export const gamification = new GamificationEngine();