import React from 'react';

const DailyLessons = ({ day, dayContent, dailyProgress, onLessonComplete }) => {
  if (!dayContent || !dayContent.lessons) {
    return (
      <div className="lessons-loading">
        <p>Loading today's lessons...</p>
      </div>
    );
  }

  const dayKey = `day${day}`;
  const currentDayProgress = dailyProgress[dayKey] || { lessons: [], completed: false };

  return (
    <div className="daily-lessons-container">
      <div className="lessons-list">
        {dayContent.lessons.map((lessonTitle, index) => (
          <LessonCard
            key={index}
            lessonIndex={index}
            lessonTitle={lessonTitle}
            isCompleted={currentDayProgress.lessons.includes(index)}
            isLocked={index > 0 && !currentDayProgress.lessons.includes(index - 1)}
            xp={Math.floor(dayContent.xp / dayContent.lessons.length)}
            onComplete={() => onLessonComplete(day, index)}
          />
        ))}
      </div>
      
      {dayContent.deliverable && (
        <DeliverableCard
          deliverable={dayContent.deliverable}
          totalXP={dayContent.xp}
          isComplete={currentDayProgress.completed}
        />
      )}
    </div>
  );
};

const LessonCard = ({ lessonIndex, lessonTitle, isCompleted, isLocked, xp, onComplete }) => {
  const cardClasses = [
    'lesson-card',
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
      <div className="lesson-header">
        <div className="lesson-number">Lesson {lessonIndex + 1}</div>
        <div className="lesson-status">
          {isCompleted ? '✅' : isLocked ? '🔒' : '▶️'}
        </div>
      </div>
      
      <div className="lesson-title">{lessonTitle}</div>
      
      <div className="lesson-meta">
        <span className="lesson-xp">+{xp} XP</span>
        <span className="lesson-label">
          {isCompleted ? 'Completed' : 
           isLocked ? 'Locked' : 
           'Click to Start'}
        </span>
      </div>
    </div>
  );
};

const DeliverableCard = ({ deliverable, totalXP, isComplete }) => {
  return (
    <div className={`deliverable-card ${isComplete ? 'completed' : ''}`}>
      <div className="deliverable-header">
        <div className="deliverable-title">Daily Deliverable</div>
        <div className="deliverable-status">
          {isComplete ? '🎉' : '🎯'}
        </div>
      </div>
      
      <div className="deliverable-content">{deliverable}</div>
      <div className="deliverable-xp">+{totalXP} XP Total</div>
    </div>
  );
};

export default DailyLessons;