import { Linking, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import pandals from '@/data/pandals.json';

export default function PandalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const pandal = pandals.find((p) => p.id === id);

  if (!pandal) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ThemedText>Pandal not found.</ThemedText>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, styles.content]} edges={['top']}>
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
          <ThemedText type="smallBold">Address</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {pandal.address}
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.section}>
          <ThemedText type="smallBold">Timings</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {pandal.timings}
          </ThemedText>
        </ThemedView>

        <ThemedText
          type="linkPrimary"
          onPress={() =>
            Linking.openURL(
              `https://www.google.com/maps/search/?api=1&query=${pandal.lat},${pandal.lng}`,
            )
          }>
          Get Directions
        </ThemedText>
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
