/**
 * Course Content Module
 * Loads and manages course content
 */

export class CourseContent {
    constructor() {
        this.weeks = {};
        this.days = {};
        this.currentWeek = null;
        this.currentModule = null;
        this.currentDay = null;
        this.curriculumData = null;
    }

    async loadCurriculum() {
        try {
            const response = await fetch('/content/curriculum_30day.json');
            if (response.ok) {
                this.curriculumData = await response.json();
                return this.curriculumData;
            }
        } catch (error) {
            console.error('Failed to load 30-day curriculum:', error);
        }
        return null;
    }

    async loadDay(dayNumber, projectType) {
        if (!this.curriculumData) {
            await this.loadCurriculum();
        }
        
        if (this.curriculumData && 
            this.curriculumData.projects[projectType] && 
            this.curriculumData.projects[projectType].days[`day${dayNumber}`]) {
            
            const dayData = this.curriculumData.projects[projectType].days[`day${dayNumber}`];
            this.days[dayNumber] = dayData;
            return dayData;
        }
        
        return this.getDefaultDayContent(dayNumber, projectType);
    }

    getDay(dayNumber, projectType) {
        const key = `${projectType}_day${dayNumber}`;
        return this.days[key] || this.getDefaultDayContent(dayNumber, projectType);
    }

    getDefaultDayContent(dayNumber, projectType) {
        return {
            day: dayNumber,
            title: `Day ${dayNumber}`,
            lessons: [
                `Lesson 1 for Day ${dayNumber}`,
                `Lesson 2 for Day ${dayNumber}`
            ],
            deliverable: `Complete Day ${dayNumber} objectives`,
            xp: 200
        };
    }

    async loadWeek(weekNumber) {
        try {
            // Try to load week content from JSON
            const response = await fetch(`/content/week${weekNumber}/modules.json`);
            if (response.ok) {
                const data = await response.json();
                
                // Add IDs to exercises if they don't have them
                if (data.modules) {
                    data.modules.forEach(module => {
                        if (module.content && module.content.exercises) {
                            module.content.exercises.forEach((exercise, index) => {
                                if (!exercise.id) {
                                    exercise.id = `w${weekNumber}m${module.number}e${index + 1}`;
                                }
                                if (exercise.completed === undefined) {
                                    exercise.completed = false;
                                }
                            });
                        }
                    });
                }
                
                this.weeks[weekNumber] = data;
                return data;
            }
        } catch (error) {
            console.warn(`Could not load week ${weekNumber} from file, using defaults`);
        }

        // Return default content if file doesn't exist
        return this.getDefaultWeekContent(weekNumber);
    }

    getWeek(weekNumber) {
        return this.weeks[weekNumber] || this.getDefaultWeekContent(weekNumber);
    }

    getDefaultWeekContent(weekNumber) {
        // Get the current project type from progress tracker
        const projectType = window.hamptonApp?.progressTracker?.state?.selectedProject || 'dashboard';
        
        // Default content structure based on project type
        const weekTitles = this.getWeekTitles(projectType);
        const title = weekTitles[weekNumber] || `Week ${weekNumber}`;

        return {
            week: weekNumber,
            title: title,
            description: `Learn essential skills in Week ${weekNumber}`,
            modules: this.generateDefaultModules(weekNumber, projectType)
        };
    }

    getWeekTitles(projectType) {
        const titles = {
            tictactoe: {
                1: "Game Fundamentals & Basic UI",
                2: "AI Opponents & Difficulty Levels",
                3: "Network Foundation & Server Setup",
                4: "Real-Time Multiplayer Gameplay",
                5: "Advanced Game Modes",
                6: "Spectator Mode & Broadcasting",
                7: "Polish & User Experience",
                8: "Deployment & Scaling"
            },
            servicenow: {
                1: "Foundation & ServiceNow Basics",
                2: "Building Core Metrics Components",
                3: "Time-Based Analytics",
                4: "Category & Assignment Analysis",
                5: "Advanced Visualizations",
                6: "Real-Time Updates & API Integration",
                7: "User Experience & Interactivity",
                8: "Deployment & Business Value"
            },
            automation: {
                1: "Node.js & Bot Fundamentals",
                2: "Discord Bot Development",
                3: "Web Scraping with Puppeteer",
                4: "Task Automation",
                5: "Database Integration",
                6: "Advanced Bot Features",
                7: "Error Handling & Monitoring",
                8: "Deployment & Scaling"
            },
            msgraph: {
                1: "Foundation & Authentication",
                2: "Core Analytics & Visualization",
                3: "Advanced Features & Integration",
                4: "Enterprise Features & Deployment",
                5: "Multi-Tenant Architecture",
                6: "Security & Compliance Analytics",
                7: "Performance & Monitoring",
                8: "Production Deployment & Optimization"
            }
        };
        
        return titles[projectType] || titles.tictactoe;
    }

    generateDefaultModules(weekNumber) {
        const modules = [];
        const moduleNames = [
            "Introduction & Setup",
            "Core Concepts",
            "Hands-on Practice",
            "Advanced Techniques",
            "Weekly Project"
        ];

        for (let i = 1; i <= 5; i++) {
            modules.push({
                id: `w${weekNumber}m${i}`,
                number: i,
                title: moduleNames[i - 1],
                duration: `${30 + (i * 10)} minutes`,
                difficulty: weekNumber <= 2 ? "beginner" : weekNumber <= 5 ? "intermediate" : "advanced",
                xp: 100 + (weekNumber * 10),
                skills: this.getModuleSkills(weekNumber, i),
                objectives: [
                    `Learn ${moduleNames[i - 1].toLowerCase()}`,
                    "Apply AI assistance effectively",
                    "Complete hands-on exercises",
                    "Build toward your project"
                ],
                content: {
                    introduction: `Welcome to ${moduleNames[i - 1]}. This module will teach you essential skills.`,
                    exercises: this.generateExercises(weekNumber, i),
                    project: {
                        title: `${moduleNames[i - 1]} Implementation`,
                        description: "Apply what you've learned in this module",
                        requirements: [
                            "Complete the implementation",
                            "Test your code",
                            "Document your work"
                        ],
                        xp: 50 + (weekNumber * 5)
                    }
                }
            });
        }

        return modules;
    }

    getModuleSkills(weekNumber, moduleNumber, projectType) {
        const currentProject = projectType || window.hamptonApp?.progressTracker?.state?.selectedProject || 'tictactoe';
        
        const skillsMaps = {
            tictactoe: {
                1: ["ai_prompting", "git"],
                2: ["html", "css"],
                3: ["javascript", "gamedev"],
                4: ["networking", "javascript"],
                5: ["databases", "javascript"],
                6: ["debugging", "optimization"],
                7: ["testing", "accessibility"],
                8: ["deployment", "monitoring"]
            },
            servicenow: {
                1: ["ai_prompting", "git"],
                2: ["tailwind", "css"],
                3: ["javascript", "analytics"],
                4: ["apis", "data_visualization"],
                5: ["databases", "analytics"],
                6: ["debugging", "optimization"],
                7: ["testing", "accessibility"],
                8: ["deployment", "monitoring"]
            },
            automation: {
                1: ["ai_prompting", "git"],
                2: ["javascript", "nodejs"],
                3: ["apis", "javascript"],
                4: ["databases", "automation"],
                5: ["networking", "javascript"],
                6: ["debugging", "optimization"],
                7: ["testing", "monitoring"],
                8: ["deployment", "scaling"]
            },
            msgraph: {
                1: ["azure_ad", "oauth2"],
                2: ["microsoft_graph", "javascript"],
                3: ["data_visualization", "analytics"],
                4: ["intune_api", "apis"],
                5: ["databases", "analytics"],
                6: ["debugging", "optimization"],
                7: ["testing", "monitoring"],
                8: ["deployment", "azure"]
            }
        };

        return skillsMaps[currentProject]?.[weekNumber] || ["general"];
    }

    generateExercises(weekNumber, moduleNumber) {
        return [
            {
                id: `w${weekNumber}m${moduleNumber}e1`,
                title: "Exercise 1: Fundamentals",
                description: "Practice the basic concepts",
                completed: false,
                xp: 25
            },
            {
                id: `w${weekNumber}m${moduleNumber}e2`,
                title: "Exercise 2: Application",
                description: "Apply what you've learned",
                completed: false,
                xp: 25
            }
        ];
    }

    getModule(weekNumber, moduleNumber) {
        const week = this.getWeek(weekNumber);
        return week.modules.find(m => m.number === moduleNumber);
    }

    startModule(weekNumber, moduleNumber) {
        this.currentWeek = weekNumber;
        this.currentModule = moduleNumber;
        const module = this.getModule(weekNumber, moduleNumber);
        
        // Dispatch event for UI update
        document.dispatchEvent(new CustomEvent('moduleStarted', {
            detail: { week: weekNumber, module: moduleNumber, data: module }
        }));

        return module;
    }

    async startDay(dayNumber, projectType) {
        this.currentDay = dayNumber;
        const dayData = await this.loadDay(dayNumber, projectType);
        
        // Dispatch event for UI update
        document.dispatchEvent(new CustomEvent('dayStarted', {
            detail: { day: dayNumber, project: projectType, data: dayData }
        }));

        return dayData;
    }

    completeExercise(weekNumber, moduleNumber, exerciseId) {
        const module = this.getModule(weekNumber, moduleNumber);
        if (module && module.content && module.content.exercises) {
            const exercise = module.content.exercises.find(e => e.id === exerciseId);
            if (exercise) {
                exercise.completed = true;
                
                // Dispatch event
                document.dispatchEvent(new CustomEvent('exerciseCompleted', {
                    detail: { 
                        week: weekNumber, 
                        module: moduleNumber, 
                        exerciseId: exerciseId,
                        xp: exercise.xp 
                    }
                }));

                return true;
            }
        }
        return false;
    }

    completeLesson(dayNumber, lessonIndex, projectType) {
        const dayData = this.getDay(dayNumber, projectType);
        if (dayData && dayData.lessons && dayData.lessons[lessonIndex]) {
            // Mark lesson as completed
            if (!dayData.completed) {
                dayData.completed = {};
            }
            dayData.completed[lessonIndex] = true;
            
            // Dispatch event
            document.dispatchEvent(new CustomEvent('lessonCompleted', {
                detail: { 
                    day: dayNumber,
                    project: projectType,
                    lessonIndex: lessonIndex,
                    xp: Math.floor(dayData.xp / dayData.lessons.length)
                }
            }));

            return true;
        }
        return false;
    }

    isDayComplete(dayNumber, projectType) {
        const dayData = this.getDay(dayNumber, projectType);
        if (!dayData || !dayData.lessons) {
            return false;
        }

        // Check if all lessons are completed
        const totalLessons = dayData.lessons.length;
        const completedLessons = dayData.completed ? Object.keys(dayData.completed).length : 0;
        
        return completedLessons >= totalLessons;
    }

    isModuleComplete(weekNumber, moduleNumber) {
        const module = this.getModule(weekNumber, moduleNumber);
        if (!module || !module.content || !module.content.exercises) {
            return false;
        }

        // Check if all exercises are completed
        return module.content.exercises.every(e => e.completed === true);
    }

    getWeekFromDay(dayNumber) {
        return Math.ceil(dayNumber / 7);
    }

    getDaysInWeek(weekNumber) {
        const startDay = ((weekNumber - 1) * 7) + 1;
        const endDay = Math.min(weekNumber * 7, 30);
        return Array.from({length: endDay - startDay + 1}, (_, i) => startDay + i);
    }
}