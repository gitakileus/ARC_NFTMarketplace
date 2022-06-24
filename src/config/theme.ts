import ECABold from '../assets/Fonts/EuclidCircularA-Bold.woff2';
import ECALight from '../assets/Fonts/EuclidCircularA-Light.woff2';
import ECAMedium from '../assets/Fonts/EuclidCircularA-Medium.woff2';
import ECARegular from '../assets/Fonts/EuclidCircularA-Regular.woff2';
import ECASemiBold from '../assets/Fonts/EuclidCircularA-SemiBold.woff2';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { fontFamily } from '@mui/system';

// A custom theme for this app
let theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#007AFF',
    },
    secondary: {
      main: '#1E1E1E',
    },
    background: {
      default: '#1A1919',
    },
    text: {
      primary: '#fff',
      secondary: '#8d8d8d',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'EuclidCircularA';
          font-style: block;
          font-display: swap;
          font-weight: 700;
          src: local('EuclidCirculaA'), local('ECABold'), url(${ECABold}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'EuclidCircularA';
          font-style: semi-bold;
          font-display: block;
          font-weight: 600;
          src: local('EuclidCirculaA'), local('ECASemiBold'), url(${ECASemiBold}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'EuclidCircularA';
          font-style: medium;
          font-display: block;
          font-weight: 500;
          src: local('EuclidCirculaA'), local('ECAMedium'), url(${ECAMedium}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'EuclidCircularA';
          font-style: regular;
          font-display: block;
          font-weight: 400;
          src: local('EuclidCirculaA'), local('ECARegular'), url(${ECARegular}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
        @font-face {
          font-family: 'EuclidCircularA';
          font-style: light;
          font-display: block;
          font-weight: 300;
          src: local('EuclidCirculaA'), local('ECALight'), url(${ECALight}) format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        };
      `,
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        containedPrimary: {
          background: '#007AFF',
          color: '#fff',
          textTransform: 'none',
          boxShadow: '0px 0px 10px 10px rgba(0, 122, 255, 0.2)  !important',
          height: '60px',
          fontWeight: 700,
        },
        outlinedPrimary: {
          color: '#fff',
          textTransform: 'none',
          height: '60px',
          fontWeight: 700,
        },
        containedSecondary: {
          background: '#007AFF',
          borderRadius: '20px',
          color: '#fff',
          textTransform: 'none',
          fontWeight: 700,
          height: '60px',
          ':hover': {
            background: '#0070FF',
          },
        },
        sizeLarge: {
          padding: '8px 50px',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        colorPrimary: {
          color: '#000',
          background: '#007AFF',
          ':hover': {
            background: '#007AFF80',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          ':last-child': {
            paddingBottom: 0,
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          ':hover': { background: 'transparent' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 6,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          padding: '0px 0px 16px 0px',
          minWidth: 'auto',
          fontWeight: 600,
          textTransform: 'none',
          marginRight: 64,

          '&:last-child': {
            marginRight: 0,
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          overflow: 'hidden',
          borderRadius: 10,
          '&:after': {
            display: 'none',
          },
          '&:before': {
            display: 'none',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          // minWidth: 276,
        },
        filled: {
          padding: '15px 16px',
          background: '#1e1e1e',
          fontSize: 14,
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          backgroundColor: '#000',
        },
      },
    },
  },
  typography: {
    fontFamily: 'EuclidCircularA, Montserrat',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
      fontSize: 80,
    },
    h3: {
      fontWeight: 600,
      fontSize: 56,
    },
    h4: {
      fontWeight: 600,
      fontSize: 48,
    },
    h5: {
      fontWeight: 600,
      fontSize: 32,
    },
    h6: {
      fontWeight: 500,
    },
    subtitle1: {
      fontSize: 24,
      lineHeight: 1.6,
      fontWeight: 500,
    },
    subtitle2: {},
    body1: {
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: 500,
    },
    body2: {
      fontSize: 14,
      lineHeight: 1.6,
      fontWeight: 500,
    },
    caption: {
      fontSize: 12,
      lineHeight: 1.6,
      fontWeight: 500,
    },
    button: {
      fontSize: 16,
      lineHeight: 1.5,
    },
  },
});

theme = responsiveFontSizes(theme);

export default theme;
