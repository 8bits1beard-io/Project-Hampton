import React from 'react';
import './ProjectSelector.css';

const ProjectSelector = ({ onProjectSelect }) => {
  const projects = [
    {
      id: 'tictactoe',
      icon: '🎮',
      title: 'Multiplayer Tic-Tac-Toe',
      description: 'Build a real-time multiplayer Tic-Tac-Toe game with local network play and tournament modes',
      skills: ['WebSockets', 'Node.js', 'Game Logic', 'Network Programming'],
      difficulty: 'Intermediate',
      duration: '30 days'
    },
    {
      id: 'servicenow',
      icon: '📈',
      title: 'ServiceNow Analytics Dashboard',
      description: 'Build a Tailwind CSS dashboard analyzing ServiceNow incidents for actionable business insights',
      skills: ['Tailwind CSS', 'Data Analysis', 'Chart.js', 'ServiceNow APIs'],
      difficulty: 'Intermediate', 
      duration: '30 days'
    },
    {
      id: 'automation',
      icon: '🤖',
      title: 'Automation Bot Suite',
      description: 'Build Discord bots, web scrapers, and task automation tools using Node.js and AI assistance',
      skills: ['Node.js', 'Discord.js', 'Puppeteer', 'Task Automation'],
      difficulty: 'Advanced',
      duration: '30 days'
    },
    {
      id: 'msgraph',
      icon: '📊',
      title: 'Microsoft Graph Analytics',
      description: 'Build an enterprise dashboard analyzing device data from Microsoft Graph and Intune APIs',
      skills: ['Microsoft Graph', 'Azure AD', 'Chart.js', 'Intune API', 'OAuth 2.0'],
      difficulty: 'Advanced',
      duration: '30 days'
    }
  ];
  
  return (
    <div className="project-selector">
      <div className="project-selector__header">
        <h1 className="project-selector__title">Choose Your Learning Path</h1>
        <p className="project-selector__subtitle">
          Select a project to build in an intensive 30-day program
        </p>
      </div>
      
      <div className="project-selector__grid">
        {projects.map(project => (
          <ProjectCard 
            key={project.id}
            project={project}
            onSelect={() => onProjectSelect(project.id)}
          />
        ))}
      </div>
      
      <div className="progress-code-section">
        <h2 className="progress-code-section__title">Already Started?</h2>
        <p className="progress-code-section__description">
          Enter your progress code to continue where you left off:
        </p>
        <div className="progress-code-section__form">
          <input 
            type="text" 
            placeholder="HAMPTON-TICT-D5L2-X8F9-K3Q7"
            className="form-input progress-code-section__input"
          />
          <button className="btn btn--secondary">Load Progress</button>
        </div>
        <div className="progress-code-section__examples">
          <p>Progress codes look like:</p>
          <code className="progress-code-section__code">HAMPTON-TICT-D3L1-K9Q7-X8F2</code>
          <span className="text-muted">(Tic-Tac-Toe, Day 3, Lesson 1)</span>
          <br/>
          <code className="progress-code-section__code">HAMPTON-MSFT-D15L3-M3K8-F9Q1</code>
          <span className="text-muted">(Microsoft Graph, Day 15, Lesson 3)</span>
        </div>
      </div>
    </div>
  );
};

const ProjectCard = ({ project, onSelect }) => {
  return (
    <div 
      className="project-card card--interactive" 
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="project-card__header">
        <div className="project-card__icon">{project.icon}</div>
        <div className="project-card__meta">
          <span className="project-card__difficulty">{project.difficulty}</span>
          <span className="project-card__duration">{project.duration}</span>
        </div>
      </div>
      
      <div className="project-card__content">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__description">{project.description}</p>
        
        <div className="project-card__skills">
          <h4 className="project-card__skills-title">You'll Learn:</h4>
          <div className="project-card__skills-list">
            {project.skills.map(skill => (
              <span key={skill} className="project-card__skill">{skill}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="project-card__footer">
        <button className="btn btn--primary project-card__button">
          Start This Project
        </button>
      </div>
    </div>
  );
};

export default ProjectSelector;