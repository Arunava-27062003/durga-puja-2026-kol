import { useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlaceCard } from '@/components/place-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import places from '@/data/nearby-places.json';
import { useLocation } from '@/hooks/use-location';
import { getDistanceKm } from '@/utils/distance';

const CATEGORIES = ['all', ...new Set(places.map((p) => p.category))] as const;

export default function NearbyScreen() {
  const location = useLocation();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');

  const filtered = category === 'all' ? places : places.filter((p) => p.category === category);
  const sorted: (typeof places[number] & { distanceKm?: number })[] =
    location.status === 'ready'
      ? filtered
          .map((p) => ({ ...p, distanceKm: getDistanceKm(location.coords, p) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
      : filtered;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              <ThemedText type="title" style={styles.title}>
                Nearby
              </ThemedText>
              {location.status === 'denied' && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  Enable location to see places sorted by distance.
                </ThemedText>
              )}
              <ThemedView style={styles.filterRow}>
                {CATEGORIES.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.chip, category === c && styles.chipActive]}>
                    <ThemedText type="small">{c}</ThemedText>
                  </Pressable>
                ))}
              </ThemedView>
            </>
          }
          renderItem={({ item }) => (
            <PlaceCard
              name={item.name}
              address={item.address}
              distanceKm={item.distanceKm}
              lat={item.lat}
              lng={item.lng}
            />
          )}
        />
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
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    marginBottom: Spacing.three,
  },
  hint: {
    marginBottom: Spacing.three,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  chip: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
    backgroundColor: '#F0F0F3',
  },
  chipActive: {
    backgroundColor: '#E0E1E6',
  },
});
