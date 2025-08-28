import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('hampton_theme');
    return saved || 'light';
  });
  
  const [toolTheme, setToolTheme] = useState(() => {
    const saved = localStorage.getItem('hampton_tool_theme');
    return saved || 'claude';
  });
  
  useEffect(() => {
    localStorage.setItem('hampton_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    localStorage.setItem('hampton_tool_theme', toolTheme);
    document.documentElement.setAttribute('data-tool', toolTheme);
  }, [toolTheme]);
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return {
    theme,
    toolTheme,
    setTheme,
    setToolTheme,
    toggleTheme
  };
};