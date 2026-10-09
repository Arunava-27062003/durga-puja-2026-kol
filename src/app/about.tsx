import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ContentStatusCard } from '@/components/content-status-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AboutScreen() {
  const { content } = useAppContent();
  const { config } = content;
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            {getCopy(config, 'aboutTitle', 'About')}
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">{config.about?.festivalTitle ?? 'Durga Puja'}</ThemedText>
            <ThemedText type="default">
              {config.about?.festivalBody ?? 'Durga Puja is the biggest festival of Bengal, celebrating the goddess Durga’s victory over evil. Neighbourhoods across Bidhannagar put up elaborate pandals for five days of celebration, culminating in Vijaya Dashami immersion.'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">{config.about?.appTitle ?? 'This App'}</ThemedText>
            <ThemedText type="default">
              {config.about?.appBody ?? 'Built to help visitors find pandals, hospitals, police stations, and other essential services near them during the pujas, with one-tap emergency calling.'}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">{config.about?.organizerTitle ?? 'Organized by'}</ThemedText>
            <ThemedText type="default">{config.about?.organizerName ?? config.policeName}</ThemedText>
          </ThemedView>

          <ContentStatusCard />

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">{getCopy(config, 'aboutFeedbackTitle', 'Feedback')}</ThemedText>
            <ExternalLink href={config.externalLinks.feedback ?? config.socialLinks.facebook}>
              <ThemedText type="linkPrimary">{getCopy(config, 'aboutFeedbackLink', 'Send us feedback →')}</ThemedText>
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
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.four,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  section: {
    gap: Spacing.one,
  },
});
