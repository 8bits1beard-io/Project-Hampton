/**
 * Theme Manager Module
 * Handles theme and tool switching
 */

export class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.currentTool = 'claude-code';
    }

    init() {
        // Load saved preferences
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.currentTool = localStorage.getItem('tool') || 'claude-code';
        
        // Apply saved preferences
        this.applyTheme(this.currentTheme);
        this.applyTool(this.currentTool);
        
        // Set up listeners
        this.setupListeners();
    }

    setupListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = this.currentTheme === 'dark';
            themeToggle.addEventListener('change', (e) => {
                this.setTheme(e.target.checked ? 'dark' : 'light');
            });
        }
        
        // Tool switcher
        const toolButtons = document.querySelectorAll('.tool-option');
        toolButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tool = button.dataset.tool;
                this.setTool(tool);
            });
        });
    }

    setTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        localStorage.setItem('theme', theme);
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme } 
        }));
    }

    setTool(tool) {
        this.currentTool = tool;
        this.applyTool(tool);
        localStorage.setItem('tool', tool);
        
        // Dispatch event
        document.dispatchEvent(new CustomEvent('toolChanged', { 
            detail: { tool } 
        }));
    }

    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update theme toggle if it exists
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.checked = theme === 'dark';
        }
    }

    applyTool(tool) {
        document.documentElement.setAttribute('data-tool', tool);
        
        // Update tool buttons
        document.querySelectorAll('.tool-option').forEach(button => {
            if (button.dataset.tool === tool) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
        
        // Update tool-specific content
        this.updateToolContent(tool);
    }

    updateToolContent(tool) {
        const toolName = tool === 'claude-code' ? 'Claude Code' : 'Code Puppy';
        
        // Update any tool-specific text
        const toolNameElements = document.querySelectorAll('.tool-name');
        toolNameElements.forEach(el => {
            el.textContent = toolName;
        });
        
        // Update installation instructions if visible
        const installCommand = document.querySelector('.install-command');
        if (installCommand) {
            if (tool === 'claude-code') {
                installCommand.textContent = 'npm install -g claude-code';
            } else {
                installCommand.textContent = 'npm install -g code-puppy';
            }
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    getCurrentTool() {
        return this.currentTool;
    }

    toggleTheme() {
        this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }

    isD

arkMode() {
        return this.currentTheme === 'dark';
    }
}