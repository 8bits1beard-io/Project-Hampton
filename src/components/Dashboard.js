import React from 'react';
import ProgressStats from './ProgressStats';
import DailyLessons from './DailyLessons';
import WeeklyModules from './WeeklyModules';

const Dashboard = ({
  progress,
  xp,
  level,
  achievements,
  userTitle,
  currentDayContent,
  currentWeekContent,
  onLessonComplete,
  onModuleComplete,
  isDaily
}) => {
  const displayTitle = isDaily 
    ? `Day ${progress.currentDay || 1}: ${currentDayContent ? currentDayContent.title : 'Loading...'}`
    : `Week ${progress.currentWeek || 1}: ${currentWeekContent ? currentWeekContent.title : 'Loading...'}`;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>{displayTitle}</h1>
        <ProgressStats
          progress={progress}
          xp={xp}
          level={level}
          userTitle={userTitle}
          isDaily={isDaily}
        />
      </div>
      
      <div className="dashboard-grid">
        <div className={`main-content ${isDaily ? 'daily-lessons' : 'week-modules'}`}>
          <h2>{isDaily ? 'Today\'s Lessons' : 'This Week\'s Modules'}</h2>
          {isDaily ? (
            <DailyLessons
              day={progress.currentDay || 1}
              dayContent={currentDayContent}
              dailyProgress={progress.dailyProgress}
              onLessonComplete={onLessonComplete}
            />
          ) : (
            <WeeklyModules
              week={progress.currentWeek || 1}
              weekContent={currentWeekContent}
              weekProgress={progress.weekProgress}
              onModuleComplete={onModuleComplete}
            />
          )}
        </div>
        
        <div className="sidebar">
          <div className="achievements-section">
            <h3>Recent Achievements</h3>
            <div className="achievements-list">
              {achievements.slice(-3).map(achievement => (
                <div key={achievement.id} className="achievement-item">
                  <span className="achievement-icon">🏆</span>
                  <div className="achievement-details">
                    <div className="achievement-name">{achievement.name}</div>
                    <div className="achievement-date">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <p className="no-achievements">Complete lessons to unlock achievements!</p>
              )}
            </div>
          </div>
          
          <div className="progress-summary">
            <h3>Progress Summary</h3>
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-label">Project</span>
                <span className="stat-value">{progress.selectedProject}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Current Position</span>
                <span className="stat-value">
                  {isDaily 
                    ? `Day ${progress.currentDay}, Lesson ${progress.currentLesson + 1}`
                    : `Week ${progress.currentWeek}, Module ${progress.currentModule}`
                  }
                </span>
              </div>
              <div className="stat">
                <span className="stat-label">Completed</span>
                <span className="stat-value">
                  {isDaily 
                    ? `${progress.completedLessons.length} lessons`
                    : `${progress.completedModules?.length || 0} modules`
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;