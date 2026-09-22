import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DistanceFilter } from '@/components/distance-filter';
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
  const params = useLocalSearchParams<{ radiusKm?: string }>();
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>('all');
  const [radiusKm, setRadiusKm] = useState<number | null>(
    params.radiusKm ? Number(params.radiusKm) : null
  );
  // See pandals/index.tsx — a persisted screen instance won't re-run the
  // useState initializer on a later navigation with a new radiusKm param.
  // Comparing during render is React's documented pattern for this reset.
  const [syncedParam, setSyncedParam] = useState(params.radiusKm);
  if (params.radiusKm !== syncedParam) {
    setSyncedParam(params.radiusKm);
    setRadiusKm(params.radiusKm ? Number(params.radiusKm) : null);
  }

  const filtered = category === 'all' ? places : places.filter((p) => p.category === category);
  const withDistance: (typeof places[number] & { distanceKm?: number })[] =
    location.status === 'ready'
      ? filtered
          .map((p) => ({ ...p, distanceKm: getDistanceKm(location.coords, p) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
      : filtered;
  const sorted =
    radiusKm !== null && location.status === 'ready'
      ? withDistance.filter((p) => (p.distanceKm ?? Infinity) <= radiusKm)
      : withDistance;

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
              <DistanceFilter value={radiusKm} onChange={setRadiusKm} />
              {sorted.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  No places within {radiusKm} KM. Try a wider radius.
                </ThemedText>
              )}
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
