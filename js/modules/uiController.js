/**
 * UI Controller Module
 * Handles all DOM manipulation and UI rendering
 */

export class UIController {
    constructor() {
        this.container = null;
        this.currentModuleContent = null;
    }

    init() {
        this.container = document.getElementById('app');
        if (!this.container) {
            console.error('App container not found');
            return;
        }
        
        this.setupBaseStructure();
    }

    setupBaseStructure() {
        // Navigation is already in HTML, just set up the main content area
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            const main = document.createElement('main');
            main.id = 'main-content';
            main.className = 'main-content';
            this.container.appendChild(main);
        }
    }

    renderProjectSelection() {
        const content = `
            <div class="project-selection-container">
                <div class="selection-header">
                    <h1>Choose Your Learning Path</h1>
                    <p class="subtitle">Select a project to build in an intensive 30-day program</p>
                </div>
                
                <div class="project-cards">
                    ${this.renderProjectCard('tictactoe', '🎮', 'Multiplayer Tic-Tac-Toe', 
                        'Build a real-time multiplayer Tic-Tac-Toe game with local network play and tournament modes',
                        ['WebSockets', 'Node.js', 'Game Logic', 'Network Programming'])}
                    
                    ${this.renderProjectCard('servicenow', '📈', 'ServiceNow Analytics Dashboard', 
                        'Build a Tailwind CSS dashboard analyzing ServiceNow incidents for actionable business insights',
                        ['Tailwind CSS', 'Data Analysis', 'Chart.js', 'ServiceNow APIs'])}
                    
                    ${this.renderProjectCard('automation', '🤖', 'Automation Bot Suite',
                        'Build Discord bots, web scrapers, and task automation tools using Node.js and AI assistance',
                        ['Node.js', 'Discord.js', 'Puppeteer', 'Task Automation'])}
                    
                    ${this.renderProjectCard('msgraph', '📊', 'Microsoft Graph Analytics', 
                        'Build an enterprise dashboard analyzing device data from Microsoft Graph and Intune APIs',
                        ['Microsoft Graph', 'Azure AD', 'Chart.js', 'Intune API', 'OAuth 2.0'])}
                </div>
                
                <div class="progress-code-section">
                    <h3>Have a Progress Code?</h3>
                    <div class="code-input-group">
                        <input type="text" id="progress-code-input" 
                               placeholder="HAMPTON-XXXX-XXXX-XXXX-XXXX" 
                               class="progress-code-input">
                        <button onclick="hamptonApp.loadProgress(document.getElementById('progress-code-input').value)" 
                                class="btn btn-primary">Load Progress</button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    renderProjectCard(id, icon, title, description, skills) {
        return `
            <div class="project-card" onclick="hamptonApp.selectProject('${id}')">
                <div class="project-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="skill-tags">
                    ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <button class="btn btn-primary">Start This Project</button>
            </div>
        `;
    }

    renderDashboard(data) {
        const { user, currentWeek, currentDay, achievements, dailyChallenges, isDaily } = data;
        
        // Determine what to display based on format
        const displayTitle = isDaily 
            ? `Day ${user.currentDay || 1}: ${currentDay ? currentDay.title : 'Loading...'}` 
            : `Week ${user.currentWeek || 1}: ${currentWeek ? currentWeek.title : 'Loading...'}`;
            
        const content = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <h1>${displayTitle}</h1>
                    <div class="progress-stats">
                        <div class="stat stat-title">
                            <span class="stat-label">Level ${user.level}</span>
                            <span class="stat-value" id="user-title">${this.getUserTitle(user.level)}</span>
                            <span class="stat-subtitle">${this.getUserSubtitle(user.level)}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">XP</span>
                            <span class="stat-value">${user.xp}</span>
                            <div class="xp-progress-bar">
                                <div class="xp-progress-fill" style="width: ${this.getXPProgress(user)}%"></div>
                            </div>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Streak</span>
                            <span class="stat-value">${user.dailyStreak} 🔥</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">${isDaily ? 'Day' : 'Week'} Progress</span>
                            <span class="stat-value">${user.getProgressPercentage ? user.getProgressPercentage() : 0}%</span>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-grid">
                    <div class="${isDaily ? 'daily-lessons' : 'week-modules'}">
                        <h2>${isDaily ? 'Today\'s Lessons' : 'This Week\'s Modules'}</h2>
                        ${isDaily 
                            ? this.renderDayLessons(user.currentDay || 1, user.dailyProgress, currentDay) 
                            : this.renderWeekModules(user.currentWeek || 1, user.weekProgress)
                        }
                    </div>
                    
                    <div class="sidebar">
                        <div class="daily-challenges">
                            <h3>Daily Challenges</h3>
                            ${this.renderDailyChallenges(dailyChallenges)}
                        </div>
                        
                        <div class="recent-achievements">
                            <h3>Recent Achievements</h3>
                            ${this.renderRecentAchievements(user.achievements)}
                        </div>
                        
                        <div class="progress-code-widget">
                            <h3>Save Your Progress</h3>
                            <button onclick="hamptonApp.saveProgress()" class="btn btn-secondary">
                                Generate Progress Code
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="week-navigation">
                    ${this.renderWeekNavigation(user.currentWeek, user.weekProgress)}
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    renderWeekModules(week, weekProgress) {
        const modules = [];
        const currentWeekProgress = weekProgress[`week${week}`] || { modules: [], completed: false };
        
        for (let i = 1; i <= 5; i++) {
            const isCompleted = currentWeekProgress.modules.includes(i);
            const isLocked = week > 1 && !weekProgress[`week${week - 1}`].completed && i === 1;
            const isInProgress = week === window.hamptonApp.progressTracker.state.currentWeek && 
                                i === window.hamptonApp.progressTracker.state.currentModule;
            
            // Get module data
            const moduleData = window.hamptonApp.courseContent.getModule(week, i);
            const moduleTitle = moduleData ? moduleData.title : `Module ${i}`;
            
            modules.push(`
                <div class="module-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isInProgress ? 'in-progress' : ''}"
                     onclick="${!isLocked ? `window.hamptonApp.startModule(${week}, ${i})` : 'event.preventDefault()'}">
                    <div class="module-header">
                        <div class="module-number">Module ${i}</div>
                        <div class="module-status">
                            ${isCompleted ? '✅' : isLocked ? '🔒' : isInProgress ? '▶️' : '📝'}
                        </div>
                    </div>
                    <div class="module-title">${moduleTitle}</div>
                    <div class="module-meta">
                        <span class="module-xp">+100 XP</span>
                        ${isCompleted ? '<span class="completed-label">Completed</span>' : 
                          isLocked ? '<span class="locked-label">Locked</span>' : 
                          isInProgress ? '<span class="progress-label">In Progress</span>' :
                          '<span class="start-label">Click to Start</span>'}
                    </div>
                </div>
            `);
        }
        
        return modules.join('');
    }
    
    renderDayLessons(day, dailyProgress, dayData) {
        if (!dayData || !dayData.lessons) {
            return '<p>No lessons available for today.</p>';
        }
        
        const dayKey = `day${day}`;
        const currentDayProgress = dailyProgress[dayKey] || { lessons: [], completed: false };
        
        const lessons = [];
        
        dayData.lessons.forEach((lessonTitle, index) => {
            const isCompleted = currentDayProgress.lessons.includes(index);
            const isLocked = index > 0 && !currentDayProgress.lessons.includes(index - 1);
            const isInProgress = !isCompleted && !isLocked;
            
            lessons.push(`
                <div class="lesson-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''} ${isInProgress ? 'in-progress' : ''}"
                     onclick="${!isLocked ? `window.hamptonApp.completeLesson(${day}, ${index})` : 'event.preventDefault()'}">
                    <div class="lesson-header">
                        <div class="lesson-number">Lesson ${index + 1}</div>
                        <div class="lesson-status">
                            ${isCompleted ? '✅' : isLocked ? '🔒' : isInProgress ? '▶️' : '📝'}
                        </div>
                    </div>
                    <div class="lesson-title">${lessonTitle}</div>
                    <div class="lesson-meta">
                        <span class="lesson-xp">+${Math.floor(dayData.xp / dayData.lessons.length)} XP</span>
                        ${isCompleted ? '<span class="completed-label">Completed</span>' : 
                          isLocked ? '<span class="locked-label">Locked</span>' : 
                          isInProgress ? '<span class="progress-label">Ready</span>' :
                          '<span class="start-label">Click to Start</span>'}
                    </div>
                </div>
            `);
        });
        
        // Add deliverable section
        if (dayData.deliverable) {
            const isDayComplete = currentDayProgress.completed;
            lessons.push(`
                <div class="deliverable-card ${isDayComplete ? 'completed' : ''}">
                    <div class="deliverable-header">
                        <div class="deliverable-title">Daily Deliverable</div>
                        <div class="deliverable-status">
                            ${isDayComplete ? '🎉' : '🎯'}
                        </div>
                    </div>
                    <div class="deliverable-content">${dayData.deliverable}</div>
                    <div class="deliverable-xp">+${dayData.xp} XP Total</div>
                </div>
            `);
        }
        
        return lessons.join('');
    }

    renderDailyChallenges(challenges) {
        if (!challenges || challenges.length === 0) {
            return '<p>No challenges today</p>';
        }
        
        return challenges.map(challenge => `
            <div class="challenge-item ${challenge.completed ? 'completed' : ''}">
                <div class="challenge-header">
                    <span class="challenge-name">${challenge.name}</span>
                    <span class="challenge-xp">+${challenge.xp} XP</span>
                </div>
                <p class="challenge-description">${challenge.description}</p>
                <div class="challenge-difficulty difficulty-${challenge.difficulty}">
                    ${challenge.difficulty}
                </div>
            </div>
        `).join('');
    }

    renderRecentAchievements(achievements) {
        if (!achievements || achievements.length === 0) {
            return '<p>No achievements yet. Start learning to earn your first!</p>';
        }
        
        const recent = achievements.slice(-3).reverse();
        return recent.map(achievement => `
            <div class="achievement-item">
                <span class="achievement-icon">${achievement.icon || '🏆'}</span>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-date">${new Date(achievement.unlockedAt).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    renderModuleContent(moduleData) {
        // Extract week and module numbers from the module ID
        let week = 1, module = 1;
        if (moduleData.id && moduleData.id.match(/w(\d+)m(\d+)/)) {
            const matches = moduleData.id.match(/w(\d+)m(\d+)/);
            week = parseInt(matches[1]);
            module = parseInt(matches[2]);
        }
        
        const content = `
            <div class="module-content-container">
                <div class="module-header">
                    <h1>${moduleData.title}</h1>
                    <div class="module-meta">
                        <span class="module-duration">⏱️ ${moduleData.duration}</span>
                        <span class="module-difficulty difficulty-${moduleData.difficulty}">${moduleData.difficulty}</span>
                        <span class="module-xp">💰 ${moduleData.xp} XP</span>
                    </div>
                </div>
                
                <div class="module-introduction">
                    <p>${moduleData.content.introduction}</p>
                </div>
                
                <div class="module-objectives">
                    <h3>Learning Objectives</h3>
                    <ul>
                        ${moduleData.objectives.map(obj => `<li>${obj}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="module-exercises">
                    <h3>Exercises</h3>
                    ${this.renderExercises(moduleData.content.exercises, week, module)}
                </div>
                
                <div class="module-actions">
                    <button onclick="hamptonApp.completeModule(${week}, ${module})" 
                            class="btn btn-primary">Complete Module</button>
                    <button onclick="hamptonApp.showDashboard()" class="btn btn-secondary">Back to Dashboard</button>
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }
    
    renderExercises(exercises, weekNum = 1, moduleNum = 1) {
        if (!exercises || exercises.length === 0) {
            return '<p>No exercises available</p>';
        }
        
        return exercises.map(exercise => {
            // Use passed week and module numbers, or extract from exercise ID if available
            let week = weekNum;
            let module = moduleNum;
            
            if (exercise.id && exercise.id.match(/w(\d+)m(\d+)/)) {
                const matches = exercise.id.match(/w(\d+)m(\d+)/);
                week = parseInt(matches[1]);
                module = parseInt(matches[2]);
            }
            
            return `
                <div class="exercise-item ${exercise.completed ? 'completed' : ''}">
                    <div class="exercise-header">
                        <h4>${exercise.title}</h4>
                        <span class="exercise-xp">+${exercise.xp} XP</span>
                    </div>
                    <p>${exercise.description}</p>
                    <button onclick="completeExercise(${week}, ${module}, '${exercise.id}')" 
                            class="btn btn-sm ${exercise.completed ? 'btn-success' : 'btn-primary'}"
                            ${exercise.completed ? 'disabled' : ''}>
                        ${exercise.completed ? '✅ Completed' : 'Complete Exercise'}
                    </button>
                </div>
            `;
        }).join('');
    }

    renderWeekNavigation(currentWeek, weekProgress) {
        const weeks = [];
        
        for (let i = 1; i <= 8; i++) {
            const weekState = weekProgress[`week${i}`] || { modules: [], completed: false };
            const isActive = i === currentWeek;
            const isCompleted = weekState.completed;
            const isLocked = i > 1 && !weekProgress[`week${i - 1}`].completed;
            
            weeks.push(`
                <div class="week-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}"
                     onclick="${!isLocked ? `hamptonApp.navigate('week${i}')` : ''}">
                    <div class="week-number">W${i}</div>
                    <div class="week-status">
                        ${isCompleted ? '✅' : isLocked ? '🔒' : ''}
                    </div>
                </div>
            `);
        }
        
        return `<div class="week-nav-container">${weeks.join('')}</div>`;
    }

    showProgressCode(code) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>Your Progress Code</h2>
                <p>Save this code to restore your progress later:</p>
                <div class="progress-code-display">
                    <code>${code}</code>
                </div>
                <button onclick="navigator.clipboard.writeText('${code}'); this.textContent='Copied!'" 
                        class="btn btn-primary">Copy to Clipboard</button>
                <button onclick="this.closest('.modal').remove()" class="btn btn-secondary">Close</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    renderAchievements(userState) {
        const allAchievements = window.hamptonApp.gamification.achievements;
        const userAchievements = userState.achievements || [];
        
        const content = `
            <div class="achievements-container">
                <h1>Achievements</h1>
                <div class="achievements-stats">
                    <p>Unlocked: ${userAchievements.length} / ${allAchievements.length}</p>
                </div>
                <div class="achievements-grid">
                    ${allAchievements.map(achievement => {
                        const isUnlocked = userAchievements.find(a => a.id === achievement.id);
                        return `
                            <div class="achievement-card ${isUnlocked ? 'unlocked' : 'locked'}">
                                <div class="achievement-icon">${achievement.icon}</div>
                                <h3>${achievement.name}</h3>
                                <p>${achievement.description}</p>
                                <div class="achievement-xp">+${achievement.xp} XP</div>
                                ${isUnlocked ? `<div class="unlock-date">${new Date(isUnlocked.unlockedAt).toLocaleDateString()}</div>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        document.getElementById('main-content').innerHTML = content;
    }

    updateProgressBar(percentage) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
            progressBar.textContent = `${percentage}%`;
        }
    }

    updateXPDisplay(xp, level) {
        const xpDisplay = document.getElementById('xp-display');
        if (xpDisplay) {
            xpDisplay.textContent = `Level ${level} • ${xp} XP`;
        }
    }

    updateStreak(streak) {
        const streakDisplay = document.getElementById('streak-display');
        if (streakDisplay) {
            streakDisplay.textContent = `${streak} day${streak !== 1 ? 's' : ''} 🔥`;
        }
    }

    updateMotivationalMessage(message) {
        const messageDisplay = document.getElementById('motivational-message');
        if (messageDisplay) {
            messageDisplay.textContent = message;
        }
    }

    getUserTitle(level) {
        // This will be connected to titleSystem when imported
        const titles = {
            1: "🥚 Keyboard Tourist",
            2: "🥚 Copy-Paste Rookie",
            3: "🥚 Semicolon Forgetter",
            4: "🥚 Stack Overflow Visitor",
            5: "🥚 Bug Creator",
            6: "🐣 Code Cadet",
            7: "🐣 Variable Wrangler",
            8: "🐣 Loop Apprentice",
            9: "🐣 Function Caller",
            10: "🐣 Array Ranger",
            15: "🐥 Algorithm Scout",
            20: "🦅 Code Conductor",
            25: "🚀 Database Dragon",
            30: "⭐ Code Sovereign"
        };
        
        // Find the appropriate title for the level
        let title = titles[1];
        for (const [lvl, t] of Object.entries(titles)) {
            if (level >= parseInt(lvl)) {
                title = t;
            }
        }
        return title;
    }

    getUserSubtitle(level) {
        const subtitles = {
            1: "Just visiting the keys",
            2: "Ctrl+C, Ctrl+V is life",
            3: "Why won't this compile?",
            4: "Professional searcher",
            5: "It's not a bug, it's a feature!",
            6: "Learning the ways",
            7: "let x = 'getting better'",
            8: "while(learning) { improve() }",
            9: "Starting to make sense",
            10: "[0] to [hero]",
            15: "Finding better ways",
            20: "Orchestrating solutions",
            25: "Query master supreme",
            30: "Ruler of the digital realm"
        };
        
        let subtitle = subtitles[1];
        for (const [lvl, s] of Object.entries(subtitles)) {
            if (level >= parseInt(lvl)) {
                subtitle = s;
            }
        }
        return subtitle;
    }

    getXPProgress(user) {
        // Calculate XP progress to next level
        const currentLevelXP = Math.pow((user.level - 1), 2) * 50;
        const nextLevelXP = Math.pow(user.level, 2) * 50;
        const progressXP = user.xp - currentLevelXP;
        const requiredXP = nextLevelXP - currentLevelXP;
        
        return Math.min(100, Math.round((progressXP / requiredXP) * 100));
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}