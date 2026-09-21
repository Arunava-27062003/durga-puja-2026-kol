import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            About
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Durga Puja</ThemedText>
            <ThemedText type="default">
              Durga Puja is the biggest festival of Bengal, celebrating the goddess Durga&apos;s
              victory over evil. Neighbourhoods across Bidhannagar put up elaborate pandals for
              five days of celebration, culminating in Vijaya Dashami immersion.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">This App</ThemedText>
            <ThemedText type="default">
              Built to help visitors find pandals, hospitals, police stations, and other
              essential services near them during the pujas, with one-tap emergency calling.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Organized by</ThemedText>
            <ThemedText type="default">Bidhannagar Police Commissionerate</ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Feedback</ThemedText>
            <ExternalLink href="https://www.facebook.com/BidhannagarPoliceCommissionerate">
              <ThemedText type="linkPrimary">Send us feedback →</ThemedText>
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
