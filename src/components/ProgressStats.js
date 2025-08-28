import React from 'react';

const ProgressStats = ({ progress, xp, level, userTitle, isDaily }) => {
  const getXPProgress = () => {
    const currentLevelXP = Math.pow(level - 1, 2) * 50;
    const nextLevelXP = Math.pow(level, 2) * 50;
    const progressInLevel = xp - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(100, (progressInLevel / xpNeededForLevel) * 100);
  };

  const getProgressPercentage = () => {
    if (isDaily) {
      // Daily format
      const completedDays = Object.keys(progress.dailyProgress || {})
        .filter(key => progress.dailyProgress[key].completed).length;
      return Math.round((completedDays / 30) * 100);
    } else {
      // Weekly format
      return Math.round(((progress.completedModules?.length || 0) / 40) * 100);
    }
  };

  return (
    <div className="progress-stats">
      <div className="stat stat-title">
        <span className="stat-label">Level {level}</span>
        <span className="stat-value user-title" style={{ color: userTitle.color }}>
          {userTitle.title}
        </span>
        <span className="stat-subtitle">{userTitle.subtitle}</span>
      </div>
      
      <div className="stat">
        <span className="stat-label">XP</span>
        <span className="stat-value">{xp}</span>
        <div className="xp-progress-bar">
          <div 
            className="xp-progress-fill" 
            style={{ width: `${getXPProgress()}%` }}
          ></div>
        </div>
      </div>
      
      <div className="stat">
        <span className="stat-label">Streak</span>
        <span className="stat-value">{progress.dailyStreak || 0} 🔥</span>
      </div>
      
      <div className="stat">
        <span className="stat-label">{isDaily ? 'Overall' : 'Week'} Progress</span>
        <span className="stat-value">{getProgressPercentage()}%</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStats;