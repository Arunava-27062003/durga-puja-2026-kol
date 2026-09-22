import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DistanceFilter } from '@/components/distance-filter';
import { PlaceCard } from '@/components/place-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import pandals from '@/data/pandals.json';
import { useLocation } from '@/hooks/use-location';
import { getDistanceKm } from '@/utils/distance';

export default function PandalsScreen() {
  const location = useLocation();
  const params = useLocalSearchParams<{ radiusKm?: string }>();
  const [radiusKm, setRadiusKm] = useState<number | null>(
    params.radiusKm ? Number(params.radiusKm) : null
  );
  // NativeTabs keeps this screen mounted across tab switches, so a later
  // navigation's radiusKm must be re-synced here — the useState initializer
  // above only runs once, on the very first mount. Comparing during render
  // (not in an effect) is React's documented pattern for this reset case.
  const [syncedParam, setSyncedParam] = useState(params.radiusKm);
  if (params.radiusKm !== syncedParam) {
    setSyncedParam(params.radiusKm);
    setRadiusKm(params.radiusKm ? Number(params.radiusKm) : null);
  }

  const withDistance: (typeof pandals[number] & { distanceKm?: number })[] =
    location.status === 'ready'
      ? pandals
          .map((p) => ({ ...p, distanceKm: getDistanceKm(location.coords, p) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
      : pandals;

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
                Pandals
              </ThemedText>
              {location.status === 'denied' && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  Enable location to see pandals sorted by distance.
                </ThemedText>
              )}
              <DistanceFilter value={radiusKm} onChange={setRadiusKm} />
              {sorted.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  No pandals within {radiusKm} KM. Try a wider radius.
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
              onPress={() => router.push({ pathname: '/pandals/[id]', params: { id: item.id } })}
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
});
