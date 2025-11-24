import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
 
export const THEME = {
  light: {
    background: '#FFFFFF', // White
    foreground: '#000000', // Black
    card: '#FFFFFF',
    cardForeground: '#000000',
    popover: '#FFFFFF',
    popoverForeground: '#000000',
    primary: '#0F62FE', // IBM Blue
    primaryForeground: '#FFFFFF',
    secondary: '#393939', // Gray 100
    secondaryForeground: '#FFFFFF',
    muted: '#F4F4F4', // Gray 10
    mutedForeground: '#6F6F6F', // Gray 60
    accent: '#08BDBA', // IBM Teal
    accentForeground: '#FFFFFF',
    destructive: '#DA1E28', // IBM Red
    destructiveForeground: '#FFFFFF',
    border: '#E0E0E0', // Gray 20
    input: '#E0E0E0', // Gray 20
    ring: '#0F62FE', // IBM Blue
    radius: '0rem', // Sharp corners
    chart1: '#FF6B6B',
    chart2: '#4ECDC4',
    chart3: '#45B7D1',
    chart4: '#FFA07A',
    chart5: '#98D8C8',
  },
  dark: {
    background: '#161616', // Gray 100
    foreground: '#FFFFFF',
    card: '#161616',
    cardForeground: '#FFFFFF',
    popover: '#161616',
    popoverForeground: '#FFFFFF',
    primary: '#4589FF', // IBM Blue 60
    primaryForeground: '#FFFFFF',
    secondary: '#525252', // Gray 70
    secondaryForeground: '#FFFFFF',
    muted: '#262626', // Gray 90
    mutedForeground: '#A8A8A8', // Gray 40
    accent: '#3DDBD9', // IBM Teal 60
    accentForeground: '#FFFFFF',
    destructive: '#FA4D56', // IBM Red 60
    destructiveForeground: '#FFFFFF',
    border: '#393939', // Gray 80
    input: '#393939', // Gray 80
    ring: '#4589FF', // IBM Blue 60
    radius: '0rem', // Sharp corners
    chart1: '#FF6B6B',
    chart2: '#4ECDC4',
    chart3: '#45B7D1',
    chart4: '#FFA07A',
    chart5: '#98D8C8',
  },
};
 
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};