import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import type { ComponentProps } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ContentStatusCard } from '@/components/content-status-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, Brand, MaxContentWidth, Radius, Spacing, WebNavInset } from '@/constants/theme';
import { useAppTheme, type ThemeMode } from '@/theme/theme-context';

const THEME_OPTIONS: {
  mode: ThemeMode;
  icon: ComponentProps<typeof FontAwesome6>['name'];
  labelKey: string;
  fallback: string;
}[] = [
  { mode: 'light', icon: 'sun', labelKey: 'themeLight', fallback: 'Light' },
  { mode: 'dark', icon: 'moon', labelKey: 'themeDark', fallback: 'Dark' },
  { mode: 'system', icon: 'mobile-screen', labelKey: 'themeSystem', fallback: 'System' },
];

export default function SettingsScreen() {
  const { content } = useAppContent();
  const { config } = content;
  const { colors, mode, setMode } = useAppTheme();
  const sectionStyle = [styles.section, { backgroundColor: colors.surface, borderColor: colors.border }];
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.titleRow}>
            <View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}>
              <FontAwesome6 name="gear" size={22} color={colors.accent} />
            </View>
            <View style={styles.titleCopy}>
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: colors.accent }]}>
                {config.displayName.toUpperCase()}
              </ThemedText>
              <ThemedText type="title" style={styles.title}>
                {getCopy(config, 'settingsTitle', 'Settings')}
              </ThemedText>
            </View>
          </View>

          <ThemedView style={sectionStyle}>
            <View style={styles.sectionHeading}>
              <ThemedText type="smallBold">
                {getCopy(config, 'settingsThemeTitle', 'Theme settings')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {getCopy(config, 'settingsThemeSubtitle', 'Choose how the app looks on this phone.')}
              </ThemedText>
            </View>

            <View accessibilityRole="radiogroup" style={styles.themeOptions}>
              {THEME_OPTIONS.map((option) => {
                const selected = mode === option.mode;
                const label = getCopy(config, option.labelKey, option.fallback);
                return (
                  <Pressable
                    key={option.mode}
                    accessibilityRole="radio"
                    accessibilityLabel={`${label} theme`}
                    accessibilityState={{ checked: selected }}
                    onPress={() => setMode(option.mode)}
                    style={({ pressed }) => [
                      styles.themeOption,
                      { backgroundColor: colors.input, borderColor: colors.border },
                      selected && { backgroundColor: colors.backgroundSelected, borderColor: colors.accent },
                      pressed && styles.pressed,
                    ]}>
                    <View style={[styles.optionIcon, { backgroundColor: selected ? colors.accent : colors.accentSoft }]}>
                      <FontAwesome6
                        name={option.icon}
                        size={17}
                        color={selected ? colors.inverseText : colors.accent}
                      />
                    </View>
                    <ThemedText type="smallBold" style={styles.optionLabel}>{label}</ThemedText>
                    <View style={[styles.radio, { borderColor: selected ? colors.accent : colors.textSecondary }]}>
                      {selected ? <View style={[styles.radioDot, { backgroundColor: colors.accent }]} /> : null}
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </ThemedView>

          <ThemedText type="smallBold" style={[styles.groupTitle, { color: colors.accent }]}>
            {getCopy(config, 'settingsAboutTitle', 'ABOUT')}
          </ThemedText>

          <ThemedView style={sectionStyle}>
            <ThemedText type="smallBold">{config.about?.festivalTitle ?? 'Durga Puja'}</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {config.about?.festivalBody ?? 'Durga Puja is the biggest festival of Bengal, celebrating the goddess Durga’s victory over evil. Neighbourhoods across Bidhannagar put up elaborate pandals for five days of celebration, culminating in Vijaya Dashami immersion.'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={sectionStyle}>
            <ThemedText type="smallBold">{config.about?.appTitle ?? 'This App'}</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">
              {config.about?.appBody ?? 'Built to help visitors find pandals, hospitals, police stations, and other essential services near them during the pujas, with one-tap emergency calling.'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={sectionStyle}>
            <ThemedText type="smallBold">{config.about?.organizerTitle ?? 'Organized by'}</ThemedText>
            <ThemedText type="default" themeColor="textSecondary">{config.about?.organizerName ?? config.policeName}</ThemedText>
          </ThemedView>

          <ContentStatusCard />

          <ThemedView style={sectionStyle}>
            <ThemedText type="smallBold">{getCopy(config, 'aboutFeedbackTitle', 'Feedback')}</ThemedText>
            <ExternalLink href={config.externalLinks.feedback ?? config.socialLinks.facebook}>
              <ThemedText type="linkPrimary" style={{ color: colors.accent }}>{getCopy(config, 'aboutFeedbackLink', 'Send us feedback →')}</ThemedText>
            </ExternalLink>
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    maxWidth: MaxContentWidth,
  },
  content: {
    paddingHorizontal: Spacing.three,
    paddingTop: WebNavInset + Spacing.two,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  titleIcon: { width: 52, height: 52, borderRadius: Radius.medium, alignItems: 'center', justifyContent: 'center' },
  titleCopy: { flex: 1 },
  eyebrow: { fontSize: 9, lineHeight: 13, letterSpacing: 1.2 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '700' },
  sectionHeading: { gap: 2 },
  themeOptions: { gap: Spacing.two, marginTop: Spacing.one },
  themeOption: {
    minHeight: 56,
    borderRadius: Radius.medium,
    borderWidth: 1,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  optionIcon: { width: 34, height: 34, borderRadius: Radius.small, alignItems: 'center', justifyContent: 'center' },
  optionLabel: { flex: 1 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  groupTitle: { fontSize: 10, lineHeight: 14, letterSpacing: 1.3, marginTop: Spacing.one },
  pressed: { opacity: 0.72 },
  section: {
    gap: Spacing.two,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: Brand.saffron,
    borderRadius: Radius.medium,
    padding: Spacing.three,
  },
});
