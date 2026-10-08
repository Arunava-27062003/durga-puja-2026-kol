import { DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { AppContentProvider } from '@/content/app-content';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AppContentProvider>
        <StatusBar style="dark" />
        <AnimatedSplashOverlay />
        <AppTabs />
      </AppContentProvider>
    </ThemeProvider>
  );
}
