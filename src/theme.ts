import { createTheme } from '@mui/material/styles';
import { ContrastMode } from '@/store/uiSlice';

// Color-blind friendly palette using colors that are distinguishable for all types of color blindness
const colors = {
  primary: {
    main: '#2563EB', // Blue - distinguishable for all types
    light: '#60A5FA',
    dark: '#1D4ED8',
  },
  secondary: {
    main: '#7C3AED', // Purple - distinct from primary
    light: '#A78BFA',
    dark: '#5B21B6',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
  },
  error: {
    main: '#DC2626', // Red - distinguishable
    light: '#EF4444',
    dark: '#B91C1C',
  },
  warning: {
    main: '#D97706', // Orange - distinguishable
    light: '#F59E0B',
    dark: '#B45309',
  },
  success: {
    main: '#059669', // Green - distinguishable
    light: '#10B981',
    dark: '#047857',
  },
  info: {
    main: '#0284C7', // Blue - distinguishable
    light: '#0EA5E9',
    dark: '#0369A1',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Dark mode colors with improved contrast ratios
const darkColors = {
  primary: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#2563EB',
  },
  secondary: {
    main: '#A78BFA',
    light: '#C4B5FD',
    dark: '#7C3AED',
  },
  background: {
    default: '#111827',
    paper: '#1F2937',
  },
  text: {
    primary: '#F9FAFB',
    secondary: '#D1D5DB',
  },
  error: {
    main: '#EF4444',
    light: '#F87171',
    dark: '#DC2626',
  },
  warning: {
    main: '#F59E0B',
    light: '#FBBF24',
    dark: '#D97706',
  },
  success: {
    main: '#10B981',
    light: '#34D399',
    dark: '#059669',
  },
  info: {
    main: '#60A5FA',
    light: '#93C5FD',
    dark: '#2563EB',
  },
  grey: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// High contrast mode for maximum accessibility
const highContrastColors = {
  primary: {
    main: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#FFFFFF',
  },
  secondary: {
    main: '#FFD700', // Gold for high contrast
    light: '#FFD700',
    dark: '#FFD700',
  },
  background: {
    default: '#000000',
    paper: '#000000',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
  },
  error: {
    main: '#FF0000',
    light: '#FF0000',
    dark: '#FF0000',
  },
  warning: {
    main: '#FFFF00',
    light: '#FFFF00',
    dark: '#FFFF00',
  },
  success: {
    main: '#00FF00',
    light: '#00FF00',
    dark: '#00FF00',
  },
  info: {
    main: '#00FFFF',
    light: '#00FFFF',
    dark: '#00FFFF',
  },
  grey: {
    50: '#FFFFFF',
    100: '#FFFFFF',
    200: '#FFFFFF',
    300: '#FFFFFF',
    400: '#FFFFFF',
    500: '#FFFFFF',
    600: '#FFFFFF',
    700: '#FFFFFF',
    800: '#FFFFFF',
    900: '#FFFFFF',
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

export const createAppTheme = (mode: 'light' | 'dark', contrastMode: ContrastMode = 'normal') => {
  const baseColors = mode === 'dark' ? darkColors : colors;
  const finalColors = contrastMode === 'high' ? highContrastColors : baseColors;

  return createTheme({
    palette: {
      mode,
      ...finalColors,
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
};

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