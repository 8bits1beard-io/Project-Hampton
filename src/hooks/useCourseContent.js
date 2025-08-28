import { useState, useCallback } from 'react';

export const useCourseContent = () => {
  const [currentDayContent, setCurrentDayContent] = useState(null);
  const [currentWeekContent, setCurrentWeekContent] = useState(null);
  const [curriculumData, setCurriculumData] = useState(null);
  
  const loadCurriculum = useCallback(async () => {
    try {
      const response = await fetch('/content/curriculum_30day.json');
      if (response.ok) {
        const data = await response.json();
        setCurriculumData(data);
        return data;
      }
    } catch (error) {
      console.error('Failed to load 30-day curriculum:', error);
    }
    return null;
  }, []);
  
  const loadDay = useCallback(async (dayNumber, projectType) => {
    if (!curriculumData) {
      await loadCurriculum();
    }
    
    if (curriculumData && 
        curriculumData.projects[projectType] && 
        curriculumData.projects[projectType].days[`day${dayNumber}`]) {
      
      const dayData = curriculumData.projects[projectType].days[`day${dayNumber}`];
      setCurrentDayContent(dayData);
      return dayData;
    }
    
    // Return default day content if not found
    const defaultDay = {
      day: dayNumber,
      title: `Day ${dayNumber}`,
      lessons: [
        `Lesson 1 for Day ${dayNumber}`,
        `Lesson 2 for Day ${dayNumber}`,
        `Lesson 3 for Day ${dayNumber}`,
        `Lesson 4 for Day ${dayNumber}`
      ],
      deliverable: `Complete Day ${dayNumber} objectives`,
      xp: 200
    };
    
    setCurrentDayContent(defaultDay);
    return defaultDay;
  }, [curriculumData, loadCurriculum]);
  
  const loadWeek = useCallback(async (weekNumber) => {
    try {
      // Try to load week content from JSON
      const response = await fetch(`/content/week${weekNumber}/modules.json`);
      if (response.ok) {
        const data = await response.json();
        setCurrentWeekContent(data);
        return data;
      }
    } catch (error) {
      console.warn(`Could not load week ${weekNumber} from file, using defaults`);
    }

    // Return default content if file doesn't exist
    const defaultWeek = getDefaultWeekContent(weekNumber);
    setCurrentWeekContent(defaultWeek);
    return defaultWeek;
  }, []);
  
  const getDefaultWeekContent = (weekNumber) => {
    const weekTitles = {
      tictactoe: {
        1: "Game Fundamentals & Basic UI",
        2: "AI Opponents & Difficulty Levels", 
        3: "Network Foundation & Server Setup",
        4: "Real-Time Multiplayer Gameplay",
        5: "Advanced Game Modes",
        6: "Spectator Mode & Broadcasting",
        7: "Polish & User Experience",
        8: "Deployment & Scaling"
      },
      servicenow: {
        1: "Foundation & ServiceNow Basics",
        2: "Building Core Metrics Components",
        3: "Time-Based Analytics",
        4: "Category & Assignment Analysis", 
        5: "Advanced Visualizations",
        6: "Real-Time Updates & API Integration",
        7: "User Experience & Interactivity",
        8: "Deployment & Business Value"
      },
      automation: {
        1: "Node.js & Bot Fundamentals",
        2: "Discord Bot Development",
        3: "Web Scraping with Puppeteer",
        4: "Task Automation",
        5: "Database Integration",
        6: "Advanced Bot Features",
        7: "Error Handling & Monitoring",
        8: "Deployment & Scaling"
      },
      msgraph: {
        1: "Foundation & Authentication",
        2: "Core Analytics & Visualization",
        3: "Advanced Features & Integration", 
        4: "Enterprise Features & Deployment",
        5: "Multi-Tenant Architecture",
        6: "Security & Compliance Analytics",
        7: "Performance & Monitoring",
        8: "Production Deployment & Optimization"
      }
    };
    
    const projectType = 'tictactoe'; // Default
    const title = weekTitles[projectType][weekNumber] || `Week ${weekNumber}`;

    return {
      week: weekNumber,
      title: title,
      description: `Learn essential skills in Week ${weekNumber}`,
      modules: generateDefaultModules(weekNumber)
    };
  };
  
  const generateDefaultModules = (weekNumber) => {
    const modules = [];
    const moduleNames = [
      "Introduction & Setup",
      "Core Concepts", 
      "Hands-on Practice",
      "Advanced Techniques",
      "Weekly Project"
    ];

    for (let i = 1; i <= 5; i++) {
      modules.push({
        id: `w${weekNumber}m${i}`,
        number: i,
        title: moduleNames[i - 1],
        duration: `${30 + (i * 10)} minutes`,
        difficulty: weekNumber <= 2 ? "beginner" : weekNumber <= 5 ? "intermediate" : "advanced",
        xp: 100 + (weekNumber * 10),
        skills: getModuleSkills(weekNumber, i),
        objectives: [
          `Learn ${moduleNames[i - 1].toLowerCase()}`,
          "Apply AI assistance effectively",
          "Complete hands-on exercises", 
          "Build toward your project"
        ],
        content: {
          introduction: `Welcome to ${moduleNames[i - 1]}. This module will teach you essential skills.`,
          exercises: [
            {
              id: `w${weekNumber}m${i}e1`,
              title: "Exercise 1: Fundamentals",
              description: "Practice the basic concepts",
              completed: false,
              xp: 25
            },
            {
              id: `w${weekNumber}m${i}e2`, 
              title: "Exercise 2: Application",
              description: "Apply what you've learned",
              completed: false,
              xp: 25
            }
          ],
          project: {
            title: `${moduleNames[i - 1]} Implementation`,
            description: "Apply what you've learned in this module",
            requirements: [
              "Complete the implementation",
              "Test your code",
              "Document your work"
            ],
            xp: 50 + (weekNumber * 5)
          }
        }
      });
    }

    return modules;
  };
  
  const getModuleSkills = (weekNumber, moduleNumber) => {
    const skillsMap = {
      1: ["ai_prompting", "git"],
      2: ["html", "css"],
      3: ["javascript"],
      4: ["apis", "javascript"],
      5: ["databases", "javascript"], 
      6: ["debugging", "optimization"],
      7: ["testing", "accessibility"],
      8: ["deployment", "monitoring"]
    };

    return skillsMap[weekNumber] || ["general"];
  };
  
  return {
    currentDayContent,
    currentWeekContent,
    curriculumData,
    loadDay,
    loadWeek,
    loadCurriculum
  };
};