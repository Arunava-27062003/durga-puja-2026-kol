import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DistanceFilter } from '@/components/distance-filter';
import { PlaceCard } from '@/components/place-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useLocation } from '@/hooks/use-location';
import { getDistanceKm } from '@/utils/distance';

export default function PandalsScreen() {
  const { content } = useAppContent();
  const { config, pandals } = content;
  const location = useLocation();
  const params = useLocalSearchParams<{ radiusKm?: string }>();
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('All');
  const [budget, setBudget] = useState('All');
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

  const areas = useMemo(
    () => ['All', ...[...new Set(pandals.map((pandal) => pandal.area).filter(Boolean))].sort()],
    [pandals],
  );
  const budgets = useMemo(() => {
    const preferred = ['Biggest Budget', 'Big Budget', 'Medium Budget', 'Low Budget'];
    const available = new Set(pandals.map((pandal) => pandal.budgetCategory).filter(Boolean));
    return ['All', ...preferred.filter((item) => available.has(item))];
  }, [pandals]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matching = pandals.filter((pandal) => {
      const matchesArea = area === 'All' || pandal.area === area;
      const matchesBudget = budget === 'All' || pandal.budgetCategory === budget;
      const matchesQuery =
        !normalizedQuery ||
        pandal.name.toLowerCase().includes(normalizedQuery) ||
        pandal.area.toLowerCase().includes(normalizedQuery) ||
        pandal.address.toLowerCase().includes(normalizedQuery);
      return matchesArea && matchesBudget && matchesQuery;
    });

    const withDistance: (typeof pandals[number] & { distanceKm?: number })[] =
      location.status === 'ready'
        ? matching
            .map((pandal) => ({
              ...pandal,
              ...(pandal.lat !== null && pandal.lng !== null
                ? {
                    distanceKm: getDistanceKm(location.coords, {
                      lat: pandal.lat,
                      lng: pandal.lng,
                    }),
                  }
                : {}),
            }))
            .sort((first, second) => (first.distanceKm ?? Infinity) - (second.distanceKm ?? Infinity))
        : matching;

    return radiusKm !== null && location.status === 'ready'
      ? withDistance.filter((pandal) => (pandal.distanceKm ?? Infinity) <= radiusKm)
      : withDistance;
  }, [area, budget, location, pandals, query, radiusKm]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={7}
          removeClippedSubviews
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                {getCopy(config, 'pandalsTitle', 'Pandals')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {pandals.length} pandals across {areas.length - 1} police stations
              </ThemedText>
              <TextInput
                accessibilityLabel={getCopy(config, 'pandalsSearchAccessibility', 'Search pandals')}
                value={query}
                onChangeText={setQuery}
                placeholder={getCopy(config, 'pandalsSearchPlaceholder', 'Search name, address or police station')}
                placeholderTextColor="#60646C"
                style={styles.search}
                returnKeyType="search"
              />
              <ThemedText type="smallBold" style={styles.filterLabel}>
                {getCopy(config, 'pandalsPoliceStationFilter', 'POLICE STATION')}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRail}>
                {areas.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setArea(item)}
                    style={[styles.chip, item === area && styles.chipActive]}>
                    <ThemedText type="small" style={item === area ? styles.chipTextActive : undefined}>
                      {item}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
              <ThemedText type="smallBold" style={styles.filterLabel}>
                {getCopy(config, 'pandalsBudgetFilter', 'BUDGET CATEGORY')}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRail}>
                {budgets.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setBudget(item)}
                    style={[styles.chip, item === budget && styles.chipActive]}>
                    <ThemedText type="small" style={item === budget ? styles.chipTextActive : undefined}>
                      {item}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
              {location.status === 'denied' && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  {getCopy(config, 'pandalsLocationDenied', 'Enable location to see pandals sorted by distance.')}
                </ThemedText>
              )}
              <ThemedText type="smallBold" style={styles.filterLabel}>
                {getCopy(config, 'distanceFromYou', 'DISTANCE FROM YOU')}
              </ThemedText>
              <DistanceFilter value={radiusKm} onChange={setRadiusKm} />
              <ThemedText type="smallBold" style={styles.results}>
                {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
              </ThemedText>
            </View>
          }
          ListEmptyComponent={
            <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
              {getCopy(config, 'pandalsEmptyFiltered', 'No pandals match these filters. Try clearing a filter or widening the distance.')}
            </ThemedText>
          }
          renderItem={({ item }) => (
            <PlaceCard
              name={item.name}
              address={item.address}
              meta={[item.area, item.budgetCategory].filter(Boolean).join(' · ')}
              distanceKm={item.distanceKm}
              lat={item.lat}
              lng={item.lng}
              directionsQuery={[item.name, item.address, config.district].filter(Boolean).join(', ')}
              kind="pandal"
              thumbnailSource={item.imageUrl ?? config.media.pandalFallbackImageUrl}
              directionsLabel={getCopy(config, 'directionsAction', 'Get Directions')}
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
  header: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  search: {
    height: 48,
    borderWidth: 1,
    borderColor: '#D9D9DF',
    borderRadius: 14,
    paddingHorizontal: 14,
    color: '#212121',
    backgroundColor: '#F7F7F9',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  filterLabel: {
    color: '#60646C',
    fontSize: 10,
    letterSpacing: 1,
    marginTop: Spacing.one,
  },
  chipRail: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D9D9DF',
    backgroundColor: '#F7F7F9',
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: '#1E3A8A',
    backgroundColor: '#1E3A8A',
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  results: {
    color: '#1E3A8A',
    marginTop: Spacing.one,
  },
  hint: {
    marginTop: Spacing.one,
  },
  empty: {
    paddingVertical: Spacing.four,
    textAlign: 'center',
  },
});
