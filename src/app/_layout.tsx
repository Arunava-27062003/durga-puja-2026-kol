import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppContentProvider } from '@/content/app-content';
import { ThemePreferenceProvider, useAppTheme } from '@/theme/theme-context';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ThemePreferenceProvider>
      <ThemedApp />
    </ThemePreferenceProvider>
  );
}

function ThemedApp() {
  const { colors, resolvedTheme } = useAppTheme();
  const baseTheme = resolvedTheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.accent,
      background: colors.background,
      card: colors.navBackground,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  };

  return (
    <ThemeProvider value={navigationTheme}>
      <AppContentProvider>
        <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
        <AnimatedSplashOverlay />
        <AppTabs />
      </AppContentProvider>
    </ThemeProvider>
  );
}
