// theme.js - Theme management functionality

export function initializeTheme() {
  const theme = localStorage.getItem('theme') || 'light';
  if (theme === 'dark') {
    document.documentElement.classList.add('dark-mode');
  } else {
    document.documentElement.classList.remove('dark-mode');
  }
}

export function toggleTheme() {
  try {
    const isDark = document.documentElement.classList.contains('dark-mode');
    if (isDark) {
      document.documentElement.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    }
  } catch (error) {
    console.error('Error toggling theme:', error);
  }
} 