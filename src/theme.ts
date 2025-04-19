import { createTheme } from '@mui/material/styles';
import type { ContrastMode } from '@/store/uiSlice';

// Enhanced color-blind friendly palette with improved contrast ratios
const colors = {
  primary: {
    main: '#2563EB', // Blue - WCAG AA compliant
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#7C3AED', // Purple - distinct from primary
    light: '#A78BFA',
    dark: '#5B21B6',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1F2937', // Improved contrast ratio
    secondary: '#4B5563',
  },
  error: {
    main: '#DC2626', // Red - WCAG AA compliant
    light: '#EF4444',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#D97706', // Orange - WCAG AA compliant
    light: '#F59E0B',
    dark: '#B45309',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#059669', // Green - WCAG AA compliant
    light: '#10B981',
    dark: '#047857',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0284C7', // Blue - WCAG AA compliant
    light: '#0EA5E9',
    dark: '#0369A1',
    contrastText: '#FFFFFF',
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

// Enhanced responsive breakpoints with mobile-first approach
const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
};

// Enhanced typography with improved readability
const typography = {
  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  htmlFontSize: 16,
  h1: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    [breakpoints.values.sm]: {
      fontSize: '2.5rem',
    },
    [breakpoints.values.md]: {
      fontSize: '3rem',
    },
  },
  h2: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    [breakpoints.values.sm]: {
      fontSize: '2rem',
    },
    [breakpoints.values.md]: {
      fontSize: '2.5rem',
    },
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.3,
    [breakpoints.values.sm]: {
      fontSize: '1.75rem',
    },
    [breakpoints.values.md]: {
      fontSize: '2rem',
    },
  },
  h4: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4,
    [breakpoints.values.sm]: {
      fontSize: '1.5rem',
    },
  },
  h5: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.4,
    [breakpoints.values.sm]: {
      fontSize: '1.25rem',
    },
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.4,
    [breakpoints.values.sm]: {
      fontSize: '1.125rem',
    },
  },
  body1: {
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  },
  body2: {
    fontSize: '0.875rem',
    lineHeight: 1.6,
    letterSpacing: '0.01em',
  },
  button: {
    textTransform: 'none' as const,
    fontWeight: 500,
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
    typography,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            minHeight: '40px', // Minimum touch target size
            transition: 'all 0.2s ease-in-out',
            '&:focus-visible': {
              outline: '2px solid #2563EB',
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&:focus-within': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderWidth: '2px',
                },
              },
            },
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'underline',
            '&:hover': {
              textDecoration: 'none',
            },
            '&:focus-visible': {
              outline: '2px solid #2563EB',
              outlineOffset: '2px',
              borderRadius: '4px',
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: '8px', // Minimum touch target size
            '&:focus-visible': {
              outline: '2px solid #2563EB',
              outlineOffset: '2px',
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