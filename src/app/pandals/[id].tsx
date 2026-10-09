import { Image } from 'expo-image';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function PandalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { content } = useAppContent();
  const { config, pandals } = content;
  const pandal = pandals.find((p) => p.id === id);

  if (!pandal) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ThemedText>{getCopy(config, 'pandalNotFound', 'Pandal not found.')}</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Image
            source={pandal.imageUrl ?? config.media.pandalFallbackImageUrl ?? require('@/assets/images/durga-bg-card.jpg')}
            placeholder={require('@/assets/images/durga-bg-card.jpg')}
            style={styles.heroImage}
            contentFit="cover"
          />
          <ThemedText type="title" style={styles.title}>
            {pandal.name}
          </ThemedText>
          <ThemedText type="smallBold" themeColor="textSecondary">
            {pandal.area}
          </ThemedText>
          <ThemedText type="default" style={styles.description}>
            {pandal.description}
          </ThemedText>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">{getCopy(config, 'pandalAddress', 'Address')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {pandal.address}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">{getCopy(config, 'pandalTimings', 'Timings')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {pandal.timings}
            </ThemedText>
          </ThemedView>

          {pandal.lat !== null && pandal.lng !== null ? (
            <ThemedText
              type="linkPrimary"
              onPress={() =>
                Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${pandal.lat},${pandal.lng}`,
                )
              }>
              {getCopy(config, 'directionsAction', 'Get Directions')}
            </ThemedText>
          ) : null}
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
    gap: Spacing.two,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: Spacing.three,
    marginBottom: Spacing.two,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  description: {
    marginTop: Spacing.two,
  },
  section: {
    marginTop: Spacing.three,
    gap: Spacing.half,
  },
});
