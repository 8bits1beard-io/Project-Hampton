/**
 * Title System Module
 * Fun progression titles for users as they level up
 * From humble beginnings to legendary status!
 */

export class TitleSystem {
    constructor() {
        this.titles = this.defineTitles();
        this.specialTitles = this.defineSpecialTitles();
    }

    defineTitles() {
        return [
            // Levels 1-5: The Humble Beginnings
            { level: 1, title: "Keyboard Tourist", subtitle: "Just visiting the keys" },
            { level: 2, title: "Copy-Paste Rookie", subtitle: "Ctrl+C, Ctrl+V is life" },
            { level: 3, title: "Semicolon Forgetter", subtitle: "Why won't this compile?" },
            { level: 4, title: "Stack Overflow Visitor", subtitle: "Professional searcher" },
            { level: 5, title: "Bug Creator", subtitle: "It's not a bug, it's a feature!" },
            
            // Levels 6-10: Getting the Hang of It
            { level: 6, title: "Code Cadet", subtitle: "Learning the ways" },
            { level: 7, title: "Variable Wrangler", subtitle: "let x = 'getting better'" },
            { level: 8, title: "Loop Apprentice", subtitle: "while(learning) { improve() }" },
            { level: 9, title: "Function Caller", subtitle: "Starting to make sense" },
            { level: 10, title: "Array Ranger", subtitle: "[0] to [hero]" },
            
            // Levels 11-15: Building Confidence
            { level: 11, title: "Bug Squasher", subtitle: "Debugging with purpose" },
            { level: 12, title: "Logic Builder", subtitle: "if(skill > 10) return 'nice!'" },
            { level: 13, title: "Code Crafter", subtitle: "Creating with intention" },
            { level: 14, title: "Syntax Soldier", subtitle: "Fighting the good fight" },
            { level: 15, title: "Algorithm Scout", subtitle: "Finding better ways" },
            
            // Levels 16-20: Getting Serious
            { level: 16, title: "Data Dancer", subtitle: "Graceful with the bits" },
            { level: 17, title: "Promise Keeper", subtitle: "async/await master" },
            { level: 18, title: "Git Guardian", subtitle: "Commit message perfectionist" },
            { level: 19, title: "Stack Slayer", subtitle: "Full stack capable" },
            { level: 20, title: "Code Conductor", subtitle: "Orchestrating solutions" },
            
            // Levels 21-25: Advanced Territory
            { level: 21, title: "Binary Bard", subtitle: "Speaking in 1s and 0s" },
            { level: 22, title: "Cache Commander", subtitle: "Performance optimizer" },
            { level: 23, title: "Regex Wizard", subtitle: "/^pro$/" },
            { level: 24, title: "API Alchemist", subtitle: "Turning endpoints to gold" },
            { level: 25, title: "Database Dragon", subtitle: "Query master supreme" },
            
            // Levels 26-30: Elite Status
            { level: 26, title: "Kernel Knight", subtitle: "System level warrior" },
            { level: 27, title: "Quantum Coder", subtitle: "Superposition specialist" },
            { level: 28, title: "Neural Navigator", subtitle: "AI whisperer" },
            { level: 29, title: "Cyber Sage", subtitle: "Wisdom in every line" },
            { level: 30, title: "Code Sovereign", subtitle: "Ruler of the digital realm" },
            
            // Levels 31-35: Legendary Tier
            { level: 31, title: "Binary Buddha", subtitle: "Enlightened developer" },
            { level: 32, title: "Silicon Sorcerer", subtitle: "Magic in the machine" },
            { level: 33, title: "Matrix Architect", subtitle: "Building digital worlds" },
            { level: 34, title: "Quantum Overlord", subtitle: "Master of all states" },
            { level: 35, title: "Digital Deity", subtitle: "Creator of universes" },
            
            // Levels 36-40: Mythical Status
            { level: 36, title: "Code Cosmic", subtitle: "Beyond mortal understanding" },
            { level: 37, title: "Infinity Engineer", subtitle: "No limits remain" },
            { level: 38, title: "Reality Hacker", subtitle: "Bending the rules" },
            { level: 39, title: "Universe Compiler", subtitle: "Building existence" },
            { level: 40, title: "The One", subtitle: "You are the code" },
            
            // Levels 41-50: Post-Legendary (for overachievers)
            { level: 41, title: "Neo", subtitle: "You see the Matrix" },
            { level: 42, title: "Answer to Everything", subtitle: "42" },
            { level: 43, title: "Turing Complete", subtitle: "Computationally supreme" },
            { level: 44, title: "Von Neumann", subtitle: "Self-replicating excellence" },
            { level: 45, title: "Babbage Reborn", subtitle: "Father of computing" },
            { level: 46, title: "Lovelace Legacy", subtitle: "First programmer's heir" },
            { level: 47, title: "Hopper's Hope", subtitle: "Bug-free existence" },
            { level: 48, title: "Ritchie's Revenge", subtitle: "C the world differently" },
            { level: 49, title: "Torvalds Titan", subtitle: "Open source hero" },
            { level: 50, title: "Hampton Honorary", subtitle: "Mr. Hampton would be proud" }
        ];
    }

    defineSpecialTitles() {
        // Special titles earned through specific achievements
        return {
            // Speed achievements
            'speed_demon': { title: "Speed Coder", subtitle: "Faster than light" },
            'marathon_runner': { title: "Persistence Personified", subtitle: "Never gives up" },
            'night_owl': { title: "Midnight Hacker", subtitle: "Codes in dreams" },
            'early_bird': { title: "Dawn Developer", subtitle: "Rise and code" },
            
            // Completion achievements
            'week_warrior': { title: "Week Warrior", subtitle: "Seven days strong" },
            'halfway_hero': { title: "Halfway Hero", subtitle: "The journey continues" },
            'graduation_day': { title: "Graduate", subtitle: "Class of Hampton" },
            
            // Skill achievements
            'html_master': { title: "Tag Master", subtitle: "<title>Expert</title>" },
            'css_wizard': { title: "Style Sorcerer", subtitle: "Making it pretty" },
            'js_ninja': { title: "JavaScript Ninja", subtitle: "() => 'lethal'" },
            'git_guru': { title: "Version Virtuoso", subtitle: "git commit -m 'perfect'" },
            'ai_whisperer': { title: "AI Whisperer", subtitle: "Prompt perfectionist" },
            
            // Fun achievements
            'bug_squasher': { title: "Debugger Supreme", subtitle: "No bug survives" },
            'perfect_week': { title: "Perfectionist", subtitle: "Flawless execution" },
            'helper': { title: "Code Mentor", subtitle: "Helping others grow" },
            'contributor': { title: "Open Source Hero", subtitle: "Giving back" },
            
            // Project-specific
            'dashboard_complete': { title: "Dashboard Designer", subtitle: "Data visualization pro" },
            'blog_complete': { title: "Content Creator", subtitle: "Words and code" },
            'automation_complete': { title: "Bot Builder", subtitle: "Automation master" },
            
            // Easter eggs
            'konami_code': { title: "Secret Finder", subtitle: "↑↑↓↓←→←→BA" },
            'break_the_matrix': { title: "Glitch in the System", subtitle: "Reality.exe stopped" },
            'hello_world_100': { title: "Hello World Champion", subtitle: "Classic never dies" }
        };
    }

    getTitle(level) {
        // Find the appropriate title for the level
        const titleData = this.titles.find(t => t.level === level) || 
                         this.titles[this.titles.length - 1]; // Default to highest if beyond 50
        
        return titleData;
    }

    getTitleByRange(level) {
        // Get the highest title achieved so far
        let bestTitle = this.titles[0];
        
        for (const title of this.titles) {
            if (level >= title.level) {
                bestTitle = title;
            } else {
                break;
            }
        }
        
        return bestTitle;
    }

    getSpecialTitle(achievementId) {
        return this.specialTitles[achievementId] || null;
    }

    getNextTitle(currentLevel) {
        const nextTitleData = this.titles.find(t => t.level > currentLevel);
        
        if (!nextTitleData) {
            return {
                title: "Maximum Level",
                subtitle: "You've reached the peak!",
                levelsToGo: 0
            };
        }
        
        return {
            ...nextTitleData,
            levelsToGo: nextTitleData.level - currentLevel
        };
    }

    getTitleColor(level) {
        // Return color based on level range
        if (level <= 5) return '#808080';  // Gray - Beginner
        if (level <= 10) return '#10B981'; // Green - Learning
        if (level <= 15) return '#3B82F6'; // Blue - Intermediate
        if (level <= 20) return '#8B5CF6'; // Purple - Advanced
        if (level <= 25) return '#F59E0B'; // Orange - Expert
        if (level <= 30) return '#EF4444'; // Red - Elite
        if (level <= 35) return '#FFD700'; // Gold - Legendary
        if (level <= 40) return '#E11D48'; // Rose - Mythical
        if (level <= 45) return '#14B8A6'; // Teal - Post-Legendary
        return '#FF00FF';                  // Magenta - Beyond
    }

    getTitleIcon(level) {
        // Return emoji/icon based on level
        if (level <= 5) return '🥚';   // Egg - Starting out
        if (level <= 10) return '🐣';  // Hatching - Growing
        if (level <= 15) return '🐥';  // Chick - Developing
        if (level <= 20) return '🦅';  // Eagle - Soaring
        if (level <= 25) return '🚀';  // Rocket - Launching
        if (level <= 30) return '⭐';  // Star - Shining
        if (level <= 35) return '💎';  // Diamond - Brilliant
        if (level <= 40) return '👑';  // Crown - Royalty
        if (level <= 45) return '🌟';  // Glowing Star - Transcendent
        return '🏆';                    // Trophy - Ultimate
    }

    formatTitleDisplay(level, includeIcon = true) {
        const titleData = this.getTitleByRange(level);
        const color = this.getTitleColor(level);
        const icon = this.getTitleIcon(level);
        
        if (includeIcon) {
            return {
                full: `${icon} ${titleData.title}`,
                title: titleData.title,
                subtitle: titleData.subtitle,
                icon: icon,
                color: color,
                level: level
            };
        }
        
        return {
            title: titleData.title,
            subtitle: titleData.subtitle,
            color: color,
            level: level
        };
    }

    getMotivationalMessage(level) {
        const messages = {
            1: "Welcome, brave soul! Your journey begins now.",
            5: "You're getting the hang of this! Keep going!",
            10: "Double digits! You're officially a coder now.",
            15: "Impressive progress! The code is strong with this one.",
            20: "You've reached expert level! Time to build amazing things.",
            25: "Elite status achieved! You're among the coding legends.",
            30: "Sovereign of code! You command the digital realm.",
            35: "Legendary! Songs will be sung of your debugging skills.",
            40: "You are The One. The Matrix has no secrets from you.",
            45: "Beyond legendary! You've transcended normal coding.",
            50: "Mr. Hampton would be incredibly proud of your achievement!"
        };
        
        // Find the appropriate message
        let message = "Keep coding, keep growing!";
        for (const [msgLevel, msg] of Object.entries(messages)) {
            if (level >= parseInt(msgLevel)) {
                message = msg;
            }
        }
        
        return message;
    }

    // Check if user should get a special announcement for their new title
    shouldAnnounceTitle(oldLevel, newLevel) {
        const significantLevels = [1, 5, 10, 15, 20, 25, 30, 35, 40, 42, 50];
        
        for (const level of significantLevels) {
            if (oldLevel < level && newLevel >= level) {
                return true;
            }
        }
        
        return false;
    }
}

// Export singleton instance
export const titleSystem = new TitleSystem();