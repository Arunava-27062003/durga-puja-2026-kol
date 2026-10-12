import { Image } from 'expo-image';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, Brand, MaxContentWidth, Radius, Spacing, WebNavInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function PandalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { content } = useAppContent();
  const { config, pandals } = content;
  const colors = useTheme();
  const pandal = pandals.find((p) => p.id === id);
  const directionsQuery = pandal
    ? pandal.lat !== null && pandal.lng !== null
      ? `${pandal.lat},${pandal.lng}`
      : [pandal.name, pandal.address, config.district].filter(Boolean).join(', ')
    : '';

  if (!pandal) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ThemedText>{getCopy(config, 'pandalNotFound', 'Pandal not found.')}</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Image
            source={pandal.imageUrl ?? config.media.pandalFallbackImageUrl ?? require('@/assets/images/durga-bg-card.jpg')}
            placeholder={require('@/assets/images/durga-bg-card.jpg')}
            style={styles.heroImage}
            contentFit="cover"
          />
          <ThemedText type="title" style={styles.title}>
            {pandal.name}
          </ThemedText>
          <ThemedText type="smallBold" style={{ color: colors.accent }}>
            {pandal.area}
          </ThemedText>
          {pandal.budgetCategory ? (
            <ThemedText type="small" themeColor="textSecondary">
              {pandal.budgetCategory}
            </ThemedText>
          ) : null}
          <ThemedText type="default" themeColor="textSecondary" style={styles.description}>
            {pandal.description}
          </ThemedText>

          <ThemedView style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <ThemedText type="smallBold">{getCopy(config, 'pandalAddress', 'Address')}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {pandal.address}
            </ThemedText>
          </ThemedView>

          {pandal.timings ? (
            <ThemedView style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <ThemedText type="smallBold">{getCopy(config, 'pandalTimings', 'Timings')}</ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {pandal.timings}
              </ThemedText>
            </ThemedView>
          ) : null}

          <ThemedText
            type="linkPrimary"
            style={[styles.directions, { backgroundColor: colors.accent, color: colors.inverseText }]}
            onPress={() =>
              Linking.openURL(
                `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(directionsQuery)}`,
              )
            }>
            {getCopy(config, 'directionsAction', 'Get Directions')}
          </ThemedText>
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
    gap: Spacing.two,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    marginBottom: Spacing.two,
    backgroundColor: Brand.creamDeep,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  description: {
    marginTop: Spacing.two,
  },
  section: {
    marginTop: Spacing.two,
    gap: Spacing.one,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: Brand.saffron,
    borderRadius: Radius.medium,
    padding: Spacing.three,
  },
  directions: {
    marginTop: Spacing.three,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    textAlign: 'center',
    fontWeight: '700',
  },
});
