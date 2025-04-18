import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { lightTheme, darkTheme } from '@/theme';
import { RootState } from '@/store';
import { MainLayout } from '@/components/layouts';

const App: React.FC = () => {
  const isDarkMode = useSelector((state: RootState) => state.settings.isDarkMode);

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100%', position: 'relative' }}>
        <MainLayout />
      </Box>
    </ThemeProvider>
  );
};

export default App;
