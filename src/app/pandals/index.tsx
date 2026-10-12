import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DistanceFilter } from '@/components/distance-filter';
import { PlaceCard } from '@/components/place-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, MaxContentWidth, Radius, Spacing, WebNavInset } from '@/constants/theme';
import { useLocation } from '@/hooks/use-location';
import { useTheme } from '@/hooks/use-theme';
import { getDistanceKm } from '@/utils/distance';

export default function PandalsScreen() {
  const { content } = useAppContent();
  const { config, pandals } = content;
  const colors = useTheme();
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
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
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
              <View style={styles.titleRow}>
                <View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}>
                  <FontAwesome6 name="gopuram" size={22} color={colors.accent} />
                </View>
                <View style={styles.titleCopy}>
                  <ThemedText type="smallBold" style={[styles.eyebrow, { color: colors.accent }]}>
                    {getCopy(config, 'pandalsEyebrow', 'DURGA PUJA 2026')}
                  </ThemedText>
                  <ThemedText type="title" style={styles.title}>
                    {getCopy(config, 'pandalsTitle', 'Pandals')}
                  </ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {pandals.length} pandals across {areas.length - 1} police stations
                  </ThemedText>
                </View>
              </View>
              <View style={[styles.searchShell, { backgroundColor: colors.input, borderColor: colors.border }]}>
                <FontAwesome6 name="magnifying-glass" size={16} color={colors.textSecondary} />
                <TextInput
                  accessibilityLabel={getCopy(config, 'pandalsSearchAccessibility', 'Search pandals')}
                  value={query}
                  onChangeText={setQuery}
                  placeholder={getCopy(config, 'pandalsSearchPlaceholder', 'Search name, address or police station')}
                  placeholderTextColor={colors.textSecondary}
                  style={[styles.search, { color: colors.text }]}
                  returnKeyType="search"
                />
              </View>
              <ThemedText type="smallBold" style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {getCopy(config, 'pandalsPoliceStationFilter', 'POLICE STATION')}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRail}>
                {areas.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setArea(item)}
                    style={[styles.chip, { backgroundColor: colors.input, borderColor: colors.border }, item === area && { backgroundColor: colors.accent, borderColor: colors.accent }]}>
                    <ThemedText type="small" style={{ color: item === area ? colors.inverseText : colors.text }}>
                      {item}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
              <ThemedText type="smallBold" style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {getCopy(config, 'pandalsBudgetFilter', 'BUDGET CATEGORY')}
              </ThemedText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRail}>
                {budgets.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setBudget(item)}
                    style={[styles.chip, { backgroundColor: colors.input, borderColor: colors.border }, item === budget && { backgroundColor: colors.accent, borderColor: colors.accent }]}>
                    <ThemedText type="small" style={{ color: item === budget ? colors.inverseText : colors.text }}>
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
              <ThemedText type="smallBold" style={[styles.filterLabel, { color: colors.textSecondary }]}>
                {getCopy(config, 'distanceFromYou', 'DISTANCE FROM YOU')}
              </ThemedText>
              <DistanceFilter value={radiusKm} onChange={setRadiusKm} />
              <ThemedText type="smallBold" style={[styles.results, { color: colors.accent }]}>
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
    paddingHorizontal: Spacing.three,
    paddingTop: WebNavInset,
    paddingBottom: BottomTabInset + Spacing.four,
  },
  header: {
    gap: 14,
    marginBottom: Spacing.three,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: Spacing.two },
  titleIcon: { width: 52, height: 52, borderRadius: Radius.medium, alignItems: 'center', justifyContent: 'center' },
  titleCopy: { flex: 1 },
  eyebrow: { fontSize: 9, lineHeight: 13, letterSpacing: 1.2 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700' },
  searchShell: {
    height: 50,
    borderRadius: Radius.medium,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 2px 10px rgba(106,56,12,0.08)',
  },
  search: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  filterLabel: {
    fontSize: 9,
    letterSpacing: 1.1,
    marginTop: Spacing.one,
  },
  chipRail: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
  },
  chip: {
    borderRadius: Radius.full,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  results: {
    marginTop: Spacing.one,
  },
  hint: {
    marginTop: Spacing.one,
  },
  empty: {
    paddingVertical: 28,
    textAlign: 'center',
  },
});
