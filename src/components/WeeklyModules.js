import React from 'react';

const WeeklyModules = ({ week, weekContent, weekProgress, onModuleComplete }) => {
  if (!weekContent || !weekContent.modules) {
    return (
      <div className="modules-loading">
        <p>Loading this week's modules...</p>
      </div>
    );
  }

  const currentWeekProgress = weekProgress[`week${week}`] || { modules: [], completed: false };

  return (
    <div className="weekly-modules-container">
      <div className="modules-list">
        {weekContent.modules.map((module, index) => {
          const moduleNumber = index + 1;
          return (
            <ModuleCard
              key={module.id || `module-${moduleNumber}`}
              module={module}
              moduleNumber={moduleNumber}
              isCompleted={currentWeekProgress.modules.includes(moduleNumber)}
              isLocked={week > 1 && !weekProgress[`week${week - 1}`]?.completed && moduleNumber === 1}
              onComplete={() => onModuleComplete(week, moduleNumber)}
            />
          );
        })}
      </div>
    </div>
  );
};

const ModuleCard = ({ module, moduleNumber, isCompleted, isLocked, onComplete }) => {
  const cardClasses = [
    'module-card',
    isCompleted && 'completed',
    isLocked && 'locked',
    !isCompleted && !isLocked && 'in-progress'
  ].filter(Boolean).join(' ');

  const handleClick = () => {
    if (!isLocked && !isCompleted) {
      onComplete();
    }
  };

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="module-header">
        <div className="module-number">Module {moduleNumber}</div>
        <div className="module-status">
          {isCompleted ? '✅' : isLocked ? '🔒' : '📝'}
        </div>
      </div>
      
      <div className="module-title">{module.title}</div>
      
      {module.duration && (
        <div className="module-duration">{module.duration}</div>
      )}
      
      <div className="module-meta">
        <span className="module-xp">+{module.xp || 100} XP</span>
        <span className="module-label">
          {isCompleted ? 'Completed' : 
           isLocked ? 'Locked' : 
           'Click to Start'}
        </span>
      </div>
    </div>
  );
};

export default WeeklyModules;