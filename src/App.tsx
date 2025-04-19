import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { createAppTheme } from '@/theme';
import MainLayout from '@/components/layouts/MainLayout';

const App: React.FC = () => {
  const theme = useSelector((state: RootState) => state.ui.theme);
  const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    // Clean up old theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add new theme class
    document.documentElement.classList.add(isDarkMode ? 'dark-theme' : 'light-theme');
    
    // Set data-theme attribute for system preference
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const muiTheme = createAppTheme(isDarkMode ? 'dark' : 'light');

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline enableColorScheme />
      <MainLayout />
    </ThemeProvider>
  );
};

export default App;
