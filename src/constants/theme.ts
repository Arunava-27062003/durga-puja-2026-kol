/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

const LightColors = {
  text: '#15223A',
  background: '#FFF1DE',
  backgroundElement: '#FFD59A',
  backgroundSelected: '#F7AF45',
  textSecondary: '#657083',
  surface: '#FFF9F0',
  surfaceRaised: '#FFF3E2',
  border: '#E9C79B',
  input: '#FFF0DA',
  accent: '#B85100',
  accentSoft: '#FFD9A6',
  inverseText: '#FFFFFF',
  navBackground: '#FFD59A',
} as const;

const DarkColors: { [Key in keyof typeof LightColors]: string } = {
  text: '#FFF4E4',
  background: '#140C06',
  backgroundElement: '#2A180C',
  backgroundSelected: '#81400D',
  textSecondary: '#D2B99B',
  surface: '#211208',
  surfaceRaised: '#2B190C',
  border: '#67401F',
  input: '#2A180C',
  accent: '#FFB547',
  accentSoft: '#543015',
  inverseText: '#1A0E06',
  navBackground: '#211208',
};

export const Brand = {
  navy: '#102A56',
  navyDeep: '#071A38',
  policeBlue: '#275CA8',
  vermilion: '#C83B2B',
  vermilionDeep: '#A72D24',
  vermilionSoft: '#FBE9E6',
  saffron: '#F28C18',
  saffronDeep: '#B85100',
  saffronDark: '#6A380C',
  saffronSoft: '#FFD9A6',
  saffronWash: '#FFF0DA',
  /** Launcher icon and splash background. */
  splash: '#D9730D',
  marigold: '#FFAD2F',
  cream: '#FFF2E2',
  creamDeep: '#FFE5C2',
  surface: '#FFF9F0',
  ink: '#10203B',
  muted: '#687286',
  divider: '#E9C79B',
  gold: '#FFB547',
  white: '#FFFFFF',
} as const;

export const Colors = {
  light: LightColors,
  dark: DarkColors,
} as const;

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 10,
  medium: 16,
  large: 24,
  full: 999,
} as const;

export const Shadows = {
  card: '0 2px 10px rgba(106, 56, 12, 0.08)',
  raised: '0 8px 24px rgba(106, 56, 12, 0.13)',
} as const;

export const Motion = {
  fast: 120,
  base: 240,
  splash: 1900,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const WebNavInset = Platform.select({ web: 78, default: 0 }) ?? 0;
export const MaxContentWidth = 800;
