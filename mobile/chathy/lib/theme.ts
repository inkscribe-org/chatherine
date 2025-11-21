import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
 
export const THEME = {
  light: {
    background: 'hsl(0 0% 100%)', // White
    foreground: 'hsl(0 0% 0%)', // Black
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 0%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 0%)',
    primary: 'hsl(214 100% 56%)', // IBM Blue #0F62FE
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(0 0% 22%)', // Gray 100 #393939
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(0 0% 96%)', // Gray 10 #F4F4F4
    mutedForeground: 'hsl(0 0% 47%)', // Gray 60 #6F6F6F
    accent: 'hsl(174 100% 37%)', // IBM Teal #08BDBA
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(0 79% 54%)', // IBM Red #DA1E28
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 88%)', // Gray 20 #E0E0E0
    input: 'hsl(0 0% 88%)', // Gray 20 #E0E0E0
    ring: 'hsl(214 100% 56%)', // IBM Blue #0F62FE
    radius: '0rem', // Sharp corners
    chart1: 'hsl(12 76% 61%)',
    chart2: 'hsl(173 58% 39%)',
    chart3: 'hsl(197 37% 24%)',
    chart4: 'hsl(43 74% 66%)',
    chart5: 'hsl(27 87% 67%)',
  },
  dark: {
    background: 'hsl(0 0% 9%)', // Gray 100 #161616
    foreground: 'hsl(0 0% 100%)',
    card: 'hsl(0 0% 9%)',
    cardForeground: 'hsl(0 0% 100%)',
    popover: 'hsl(0 0% 9%)',
    popoverForeground: 'hsl(0 0% 100%)',
    primary: 'hsl(214 100% 68%)', // IBM Blue 60 #4589FF
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(0 0% 32%)', // Gray 70 #525252
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(0 0% 15%)', // Gray 90 #262626
    mutedForeground: 'hsl(0 0% 65%)', // Gray 40 #a8a8a8
    accent: 'hsl(174 100% 59%)', // IBM Teal 60 #3DDBD9
    accentForeground: 'hsl(0 0% 100%)',
    destructive: 'hsl(0 79% 70%)', // IBM Red 60 #FA4D56
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 22%)', // Gray 80 #393939
    input: 'hsl(0 0% 22%)', // Gray 80 #393939
    ring: 'hsl(214 100% 68%)', // IBM Blue 60 #4589FF
    radius: '0rem', // Sharp corners
    chart1: 'hsl(220 70% 50%)',
    chart2: 'hsl(160 60% 45%)',
    chart3: 'hsl(30 80% 55%)',
    chart4: 'hsl(280 65% 60%)',
    chart5: 'hsl(340 75% 55%)',
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