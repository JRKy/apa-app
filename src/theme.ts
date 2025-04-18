import { createTheme } from '@mui/material/styles';

// Modern color palette
const colors = {
  primary: {
    main: '#0066FF', // Vibrant blue
    light: '#4D94FF',
    dark: '#0047B3',
  },
  secondary: {
    main: '#6B46C1', // Rich purple
    light: '#9F7AEA',
    dark: '#553C9A',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1A202C',
    secondary: '#4A5568',
  },
  error: {
    main: '#E53E3E',
  },
  warning: {
    main: '#DD6B20',
  },
  success: {
    main: '#38A169',
  },
  info: {
    main: '#3182CE',
  },
};

// Dark mode colors
const darkColors = {
  primary: {
    main: '#4299E1',
    light: '#63B3ED',
    dark: '#3182CE',
  },
  secondary: {
    main: '#9F7AEA',
    light: '#B794F4',
    dark: '#805AD5',
  },
  background: {
    default: '#1A202C',
    paper: '#2D3748',
  },
  text: {
    primary: '#F7FAFC',
    secondary: '#CBD5E0',
  },
  error: {
    main: '#FC8181',
  },
  warning: {
    main: '#F6AD55',
  },
  success: {
    main: '#68D391',
  },
  info: {
    main: '#63B3ED',
  },
};

// Responsive breakpoints
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    ...colors,
  },
  breakpoints,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      [breakpoints.values.sm]: {
        fontSize: '3rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      [breakpoints.values.sm]: {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '2rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '1.25rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0',
          boxShadow: 'none',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          [breakpoints.values.sm]: {
            width: '320px',
          },
          [breakpoints.values.xs]: {
            width: '100%',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          [breakpoints.values.sm]: {
            backgroundColor: 'rgba(26, 32, 44, 0.8)',
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    ...darkColors,
  },
  breakpoints,
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      [breakpoints.values.sm]: {
        fontSize: '3rem',
      },
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      [breakpoints.values.sm]: {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '2rem',
      },
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '1.5rem',
      },
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      [breakpoints.values.sm]: {
        fontSize: '1.25rem',
      },
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease-in-out',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: '0',
          boxShadow: 'none',
          borderRight: '1px solid rgba(255, 255, 255, 0.12)',
          [breakpoints.values.sm]: {
            width: '320px',
          },
          [breakpoints.values.xs]: {
            width: '100%',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(26, 32, 44, 0.8)',
        },
      },
    },
  },
});

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const zIndex = {
  drawer: 1200,
  appBar: 1100,
  modal: 1300,
  tooltip: 1500,
}; 