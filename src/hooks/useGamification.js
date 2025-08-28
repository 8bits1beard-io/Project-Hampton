import { useState, useEffect, useCallback } from 'react';

const LEVEL_TITLES = [
  { level: 1, title: "Keyboard Tourist", subtitle: "Just visiting the keys", color: "#8B5CF6" },
  { level: 2, title: "Syntax Seeker", subtitle: "Following the breadcrumbs", color: "#8B5CF6" },
  { level: 3, title: "Debug Detective", subtitle: "On the case", color: "#10B981" },
  { level: 4, title: "Code Apprentice", subtitle: "Learning the craft", color: "#10B981" },
  { level: 5, title: "Function Fellow", subtitle: "Getting functional", color: "#F59E0B" },
  { level: 6, title: "Loop Learner", subtitle: "Going in circles (good ones)", color: "#F59E0B" },
  { level: 7, title: "Variable Voyager", subtitle: "Exploring data territories", color: "#EF4444" },
  { level: 8, title: "Array Adventurer", subtitle: "Collecting experiences", color: "#EF4444" },
  { level: 9, title: "Object Oracle", subtitle: "Speaking in properties", color: "#8B5CF6" },
  { level: 10, title: "Class Crusader", subtitle: "Fighting for structure", color: "#8B5CF6" },
  { level: 15, title: "API Alchemist", subtitle: "Mixing data potions", color: "#10B981" },
  { level: 20, title: "Framework Philosopher", subtitle: "Pondering patterns", color: "#F59E0B" },
  { level: 25, title: "Database Diplomat", subtitle: "Negotiating with data", color: "#EF4444" },
  { level: 30, title: "Deploy Captain", subtitle: "Shipping to production", color: "#8B5CF6" },
  { level: 35, title: "Git Gladiator", subtitle: "Version control champion", color: "#10B981" },
  { level: 40, title: "Stack Strategist", subtitle: "Full-stack commander", color: "#F59E0B" },
  { level: 45, title: "Architecture Ace", subtitle: "Building digital castles", color: "#EF4444" },
  { level: 50, title: "Hampton Honorary", subtitle: "Mr. Hampton would be proud", color: "#FFD700" }
];

export const useGamification = (progress) => {
  const [xp, setXP] = useState(progress.xp || 0);
  const [level, setLevel] = useState(progress.level || 1);
  const [achievements, setAchievements] = useState(progress.achievements || []);
  
  // Update when progress changes
  useEffect(() => {
    setXP(progress.xp || 0);
    setLevel(progress.level || 1);
    setAchievements(progress.achievements || []);
  }, [progress]);
  
  const calculateLevel = useCallback((currentXP) => {
    return Math.floor(Math.sqrt(currentXP / 50)) + 1;
  }, []);
  
  const addXP = useCallback((amount) => {
    setXP(prevXP => {
      const newXP = prevXP + amount;
      const newLevel = calculateLevel(newXP);
      
      if (newLevel > level) {
        setLevel(newLevel);
        // Trigger level up animation/sound
        showLevelUpAnimation(newLevel);
        unlockAchievement('level_up', `Reached Level ${newLevel}`);
      }
      
      return newXP;
    });
  }, [level, calculateLevel]);
  
  const unlockAchievement = useCallback((id, name, description = '') => {
    setAchievements(prevAchievements => {
      // Check if already unlocked
      if (prevAchievements.find(a => a.id === id)) {
        return prevAchievements;
      }
      
      const achievement = {
        id,
        name,
        description,
        unlockedAt: new Date().toISOString()
      };
      
      // Trigger achievement notification/animation
      showAchievementNotification(achievement);
      
      return [...prevAchievements, achievement];
    });
    
    // Award XP for achievement
    addXP(50);
  }, [addXP]);
  
  const getUserTitle = useCallback((userLevel) => {
    // Find the highest title the user has earned
    const earnedTitles = LEVEL_TITLES.filter(t => userLevel >= t.level);
    return earnedTitles[earnedTitles.length - 1] || LEVEL_TITLES[0];
  }, []);
  
  const getXPProgress = useCallback((userLevel, userXP) => {
    const currentLevelXP = Math.pow(userLevel - 1, 2) * 50;
    const nextLevelXP = Math.pow(userLevel, 2) * 50;
    const progressInLevel = userXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    
    return Math.min(100, (progressInLevel / xpNeededForLevel) * 100);
  }, []);
  
  const showLevelUpAnimation = (newLevel) => {
    // Create level up animation
    const levelUpElement = document.createElement('div');
    levelUpElement.className = 'level-up-animation';
    levelUpElement.innerHTML = `
      <div class="level-up-content">
        <div class="level-up-title">LEVEL UP!</div>
        <div class="level-up-level">${newLevel}</div>
        <div class="level-up-subtitle">${getUserTitle(newLevel).title}</div>
      </div>
    `;
    
    document.body.appendChild(levelUpElement);
    
    // Remove after animation
    setTimeout(() => {
      if (levelUpElement.parentNode) {
        levelUpElement.parentNode.removeChild(levelUpElement);
      }
    }, 3000);
    
    // Play level up sound
    playLevelUpSound();
  };
  
  const showAchievementNotification = (achievement) => {
    // Create achievement notification
    const achievementElement = document.createElement('div');
    achievementElement.className = 'achievement-notification';
    achievementElement.innerHTML = `
      <div class="achievement-content">
        <div class="achievement-icon">🏆</div>
        <div class="achievement-text">
          <div class="achievement-title">Achievement Unlocked!</div>
          <div class="achievement-name">${achievement.name}</div>
        </div>
      </div>
    `;
    
    document.body.appendChild(achievementElement);
    
    // Remove after animation
    setTimeout(() => {
      if (achievementElement.parentNode) {
        achievementElement.parentNode.removeChild(achievementElement);
      }
    }, 4000);
    
    // Play achievement sound
    playAchievementSound();
  };
  
  const playLevelUpSound = () => {
    // Web Audio API level up sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 0.3);
    oscillator.frequency.exponentialRampToValueAtTime(1100, audioContext.currentTime + 0.6);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.8);
  };
  
  const playAchievementSound = () => {
    // Web Audio API achievement sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1047, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };
  
  return {
    xp,
    level,
    achievements,
    addXP,
    unlockAchievement,
    getUserTitle,
    getXPProgress,
    levelTitles: LEVEL_TITLES
  };
};