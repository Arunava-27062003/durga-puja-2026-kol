import { router } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PlaceCard } from '@/components/place-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import pandals from '@/data/pandals.json';
import { useLocation } from '@/hooks/use-location';
import { getDistanceKm } from '@/utils/distance';

export default function PandalsScreen() {
  const location = useLocation();

  const sorted: (typeof pandals[number] & { distanceKm?: number })[] =
    location.status === 'ready'
      ? pandals
          .map((p) => ({ ...p, distanceKm: getDistanceKm(location.coords, p) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)
      : pandals;

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
