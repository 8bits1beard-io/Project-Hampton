import React from 'react';
import './Navigation.css';

const Navigation = ({ theme, toolTheme, onThemeToggle, onToolThemeChange }) => {
  return (
    <nav className="navigation">
      <div className="navigation__container">
        <div className="navigation__logo">
          <span className="navigation__logo-text">Project: Hampton</span>
          <span className="navigation__version">v0.1.0</span>
        </div>
        
        <div className="navigation__tool-selector">
          <button 
            className={`navigation__tool-btn ${
              toolTheme === 'claude' ? 'navigation__tool-btn--active' : ''
            }`}
            onClick={() => onToolThemeChange('claude')}
          >
            Claude Code
          </button>
          <button 
            className={`navigation__tool-btn ${
              toolTheme === 'puppy' ? 'navigation__tool-btn--active' : ''
            }`}
            onClick={() => onToolThemeChange('puppy')}
          >
            Code Puppy
          </button>
        </div>
        
        <label className="navigation__theme-toggle">
          <input 
            type="checkbox" 
            className="navigation__theme-input"
            checked={theme === 'dark'}
            onChange={onThemeToggle}
          />
          <span className="navigation__theme-slider">
            <span className="navigation__theme-icon">
              {theme === 'dark' ? '🌙' : '☀️'}
            </span>
          </span>
        </label>
      </div>
    </nav>
  );
};

export default Navigation;