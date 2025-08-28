import { useState, useCallback } from 'react';

const STORAGE_KEY = 'hampton_progress';

const getDefaultState = () => ({
  userId: generateUserId(),
  selectedProject: null,
  currentDay: 0,
  currentLesson: 0,
  completedLessons: [],
  currentWeek: 1,
  currentModule: 1,
  completedModules: [],
  xp: 0,
  level: 1,
  achievements: [],
  dailyStreak: 0,
  lastActivityDate: null,
  startDate: new Date().toISOString(),
  skills: {
    html: 0,
    css: 0,
    javascript: 0,
    git: 0,
    ai_prompting: 0,
    debugging: 0,
    deployment: 0,
    databases: 0,
    networking: 0,
    gamedev: 0,
    tailwind: 0,
    analytics: 0,
    microsoft_graph: 0,
    azure_ad: 0,
    oauth2: 0,
    intune_api: 0,
    data_visualization: 0
  },
  dailyProgress: {},
  weekProgress: {
    week1: { modules: [], completed: false },
    week2: { modules: [], completed: false },
    week3: { modules: [], completed: false },
    week4: { modules: [], completed: false }
  }
});

const generateUserId = () => {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const loadState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge with default state to ensure all properties exist
      return { ...getDefaultState(), ...parsed };
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return getDefaultState();
};

const saveState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error('Failed to save progress:', e);
    return false;
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState(loadState);
  
  const updateProgress = useCallback((updater) => {
    setProgress(prevProgress => {
      const newProgress = typeof updater === 'function' ? updater(prevProgress) : updater;
      saveState(newProgress);
      return newProgress;
    });
  }, []);
  
  const selectProject = useCallback(async (projectType) => {
    const validProjects = ['tictactoe', 'servicenow', 'automation', 'msgraph'];
    if (!validProjects.includes(projectType)) {
      throw new Error('Invalid project type');
    }
    
    updateProgress(prev => ({
      ...prev,
      selectedProject: projectType,
      currentDay: 1,
      currentLesson: 0,
      currentWeek: 1,
      currentModule: 1
    }));
  }, [updateProgress]);
  
  const completeLesson = useCallback((day, lessonIndex) => {
    const lessonId = `d${day}l${lessonIndex}`;
    
    let completed = false;
    updateProgress(prev => {
      // Check if already completed
      if (prev.completedLessons.includes(lessonId)) {
        return prev;
      }
      
      completed = true;
      const newCompletedLessons = [...prev.completedLessons, lessonId];
      
      // Update daily progress
      const dayKey = `day${day}`;
      const newDailyProgress = { ...prev.dailyProgress };
      if (!newDailyProgress[dayKey]) {
        newDailyProgress[dayKey] = { lessons: [], completed: false };
      }
      if (!newDailyProgress[dayKey].lessons.includes(lessonIndex)) {
        newDailyProgress[dayKey].lessons.push(lessonIndex);
      }
      
      // Check if day is complete (assuming 4 lessons per day average)
      const expectedLessons = getLessonsPerDay(day);
      if (newDailyProgress[dayKey].lessons.length >= expectedLessons) {
        newDailyProgress[dayKey].completed = true;
      }
      
      // Update current position
      let newCurrentDay = prev.currentDay;
      let newCurrentLesson = prev.currentLesson;
      
      if (day === prev.currentDay && lessonIndex === prev.currentLesson) {
        if (lessonIndex < expectedLessons - 1) {
          newCurrentLesson++;
        } else if (day < 30) {
          newCurrentDay++;
          newCurrentLesson = 0;
        }
      }
      
      return {
        ...prev,
        completedLessons: newCompletedLessons,
        dailyProgress: newDailyProgress,
        currentDay: newCurrentDay,
        currentLesson: newCurrentLesson,
        lastActivityDate: new Date().toISOString()
      };
    });
    
    return completed;
  }, [updateProgress]);
  
  const completeModule = useCallback((week, module) => {
    const moduleId = `w${week}m${module}`;
    
    let completed = false;
    updateProgress(prev => {
      // Check if already completed
      if (prev.completedModules.includes(moduleId)) {
        return prev;
      }
      
      completed = true;
      const newCompletedModules = [...prev.completedModules, moduleId];
      
      // Update week progress
      const weekKey = `week${week}`;
      const newWeekProgress = { ...prev.weekProgress };
      if (!newWeekProgress[weekKey]) {
        newWeekProgress[weekKey] = { modules: [], completed: false };
      }
      if (!newWeekProgress[weekKey].modules.includes(module)) {
        newWeekProgress[weekKey].modules.push(module);
      }
      
      // Check if week is complete
      if (newWeekProgress[weekKey].modules.length >= 5) {
        newWeekProgress[weekKey].completed = true;
      }
      
      return {
        ...prev,
        completedModules: newCompletedModules,
        weekProgress: newWeekProgress,
        lastActivityDate: new Date().toISOString()
      };
    });
    
    return completed;
  }, [updateProgress]);
  
  const generateProgressCode = useCallback(() => {
    const projectCodeMap = {
      'tictactoe': 'TICT',
      'servicenow': 'SNOW', 
      'automation': 'AUTO',
      'msgraph': 'MSFT'
    };
    
    const data = {
      p: progress.selectedProject ? projectCodeMap[progress.selectedProject] || 'NONE' : 'NONE',
      w: progress.currentWeek,
      m: progress.currentModule,
      d: progress.currentDay,
      x: Math.floor(progress.xp / 100),
      a: progress.achievements.length,
      c: progress.completedLessons.length
    };
    
    // Encode to base36 for compactness
    const encoded = btoa(JSON.stringify(data))
      .replace(/[^A-Za-z0-9]/g, '')
      .substr(0, 12)
      .toUpperCase();
    
    // Format as HAMPTON-PROJ-XXXX-YYYY-ZZZZ
    const projectCode = data.p;
    const chunk1 = progress.currentDay > 0 ? `D${data.d}L${progress.currentLesson}` : `W${data.w}M${data.m}`;
    const chunk2 = generateChecksum(encoded).substr(0, 4);
    const chunk3 = encoded.substr(0, 4);
    
    return `HAMPTON-${projectCode}-${chunk1}-${chunk2}-${chunk3}`;
  }, [progress]);
  
  const loadFromProgressCode = useCallback((code) => {
    // Implementation for loading from progress code
    // This would parse the code and update the progress state
    console.log('Loading from code:', code);
    return { success: false, error: 'Not implemented yet' };
  }, []);
  
  const resetProgress = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      const newState = getDefaultState();
      updateProgress(newState);
      return true;
    }
    return false;
  }, [updateProgress]);
  
  const getProgressPercentage = useCallback(() => {
    if (progress.currentDay > 0) {
      // Daily format
      const completedDays = Object.keys(progress.dailyProgress)
        .filter(key => progress.dailyProgress[key].completed).length;
      return Math.round((completedDays / 30) * 100);
    } else {
      // Weekly format
      return Math.round((progress.completedModules.length / 40) * 100);
    }
  }, [progress]);
  
  return {
    progress,
    selectProject,
    completeLesson,
    completeModule,
    generateProgressCode,
    loadFromProgressCode,
    resetProgress,
    getProgressPercentage
  };
};

const getLessonsPerDay = (day) => {
  // Most days have 4 lessons, practice days have 3
  const practiceDays = [7, 14, 21, 28];
  return practiceDays.includes(day) ? 3 : 4;
};

const generateChecksum = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36).toUpperCase();
};