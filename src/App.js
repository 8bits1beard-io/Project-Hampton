import React, { useState, useEffect } from 'react';
import './App.css';
import Navigation from './components/Navigation';
import ProjectSelector from './components/ProjectSelector';
import Dashboard from './components/Dashboard';
import { useProgress } from './hooks/useProgress';
import { useGamification } from './hooks/useGamification';
import { useCourseContent } from './hooks/useCourseContent';
import { useTheme } from './hooks/useTheme';
import NotificationSystem from './components/NotificationSystem';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const { 
    progress, 
    selectProject, 
    completeLesson, 
    completeModule,
    generateProgressCode,
    loadFromProgressCode,
    resetProgress
  } = useProgress();
  
  const {
    xp,
    level,
    achievements,
    addXP,
    unlockAchievement,
    getUserTitle
  } = useGamification(progress);
  
  const {
    currentDayContent,
    currentWeekContent,
    loadDay,
    loadWeek
  } = useCourseContent();
  
  const { theme, toggleTheme, toolTheme, setToolTheme } = useTheme();
  
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    // Initialize app
    if (progress.selectedProject) {
      setCurrentView('dashboard');
      if (progress.currentDay > 0) {
        loadDay(progress.currentDay, progress.selectedProject);
      } else {
        loadWeek(progress.currentWeek || 1);
      }
    } else {
      setCurrentView('project-selection');
    }
  }, [progress, loadDay, loadWeek]);
  
  const handleProjectSelect = async (projectType) => {
    await selectProject(projectType);
    setCurrentView('dashboard');
    showNotification(`Welcome to the ${projectType} path! Let's build something amazing together.`, 'success');
  };
  
  const handleLessonComplete = (day, lessonIndex) => {
    const result = completeLesson(day, lessonIndex);
    if (result) {
      const xpGained = 50 + (day * 5);
      addXP(xpGained);
      showNotification(`Lesson ${lessonIndex + 1} completed! +${xpGained} XP`, 'success');
    }
  };
  
  const handleModuleComplete = (week, module) => {
    const result = completeModule(week, module);
    if (result) {
      addXP(100);
      showNotification(`Module ${module} completed! +100 XP`, 'success');
    }
  };
  
  const showNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [...prev, notification]);
  };
  
  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  return (
    <div className={`app ${theme} ${toolTheme}`} data-theme={theme} data-tool={toolTheme}>
      <Navigation 
        theme={theme}
        toolTheme={toolTheme}
        onThemeToggle={toggleTheme}
        onToolThemeChange={setToolTheme}
      />
      
      <main className="main-content">
        {currentView === 'project-selection' && (
          <ProjectSelector onProjectSelect={handleProjectSelect} />
        )}
        
        {currentView === 'dashboard' && (
          <Dashboard
            progress={progress}
            xp={xp}
            level={level}
            achievements={achievements}
            userTitle={getUserTitle(level)}
            currentDayContent={currentDayContent}
            currentWeekContent={currentWeekContent}
            onLessonComplete={handleLessonComplete}
            onModuleComplete={handleModuleComplete}
            isDaily={progress.currentDay > 0}
          />
        )}
      </main>
      
      <NotificationSystem 
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  );
}

export default App;