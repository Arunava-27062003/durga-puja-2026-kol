import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
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

export default function NearbyScreen() {
  const { content } = useAppContent();
  const { config, nearbyPlaces: places } = content;
  const colors = useTheme();
  const location = useLocation();
  const params = useLocalSearchParams<{ radiusKm?: string }>();
  const [category, setCategory] = useState('all');
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

  const categories = useMemo(
    () => ['all', ...new Set(places.map((place) => place.category))],
    [places],
  );

  const filtered = category === 'all' ? places : places.filter((p) => p.category === category);
  const withDistance: (typeof places[number] & { distanceKm?: number })[] =
    location.status === 'ready'
      ? filtered
          .map((p) => ({
            ...p,
            ...(p.lat !== null && p.lng !== null
              ? { distanceKm: getDistanceKm(location.coords, { lat: p.lat, lng: p.lng }) }
              : {}),
          }))
          .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
      : filtered;
  const sorted =
    radiusKm !== null && location.status === 'ready'
      ? withDistance.filter((p) => (p.distanceKm ?? Infinity) <= radiusKm)
      : withDistance;

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <>
              <View style={styles.titleRow}>
                <View style={[styles.titleIcon, { backgroundColor: colors.accentSoft }]}>
                  <FontAwesome6 name="location-dot" size={22} color={colors.accent} />
                </View>
                <View style={styles.titleCopy}>
                  <ThemedText type="smallBold" style={[styles.eyebrow, { color: colors.accent }]}>
                    {config.displayName.toUpperCase()}
                  </ThemedText>
                  <ThemedText type="title" style={styles.title}>
                    {getCopy(config, 'nearbyTitle', 'Nearby')}
                  </ThemedText>
                </View>
              </View>
              {location.status === 'denied' && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  {getCopy(config, 'nearbyLocationDenied', 'Enable location to see places sorted by distance.')}
                </ThemedText>
              )}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}>
                {categories.map((c) => (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[
                      styles.chip,
                      { backgroundColor: colors.input, borderColor: colors.border },
                      category === c && { backgroundColor: colors.accent, borderColor: colors.accent },
                    ]}>
                    <ThemedText
                      type="small"
                      style={{ color: category === c ? colors.inverseText : colors.text }}>
                      {c}
                    </ThemedText>
                  </Pressable>
                ))}
              </ScrollView>
              <DistanceFilter value={radiusKm} onChange={setRadiusKm} />
              {sorted.length === 0 && (
                <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
                  {getCopy(config, 'nearbyEmpty', `No places within ${radiusKm} KM. Try a wider radius.`)}
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
              kind="nearby"
              thumbnailSource={
                item.imageUrl ??
                (item.category === 'hospital'
                  ? config.media.hospitalFallbackImageUrl
                  : item.category === 'pharmacy'
                    ? config.media.pharmacyFallbackImageUrl
                    : item.category === 'police'
                      ? config.media.policeFallbackImageUrl
                      : config.media.parkingFallbackImageUrl)
              }
              directionsLabel={getCopy(config, 'directionsAction', 'Get Directions')}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: Spacing.two,
    marginBottom: Spacing.three,
  },
  titleIcon: { width: 52, height: 52, borderRadius: Radius.medium, alignItems: 'center', justifyContent: 'center' },
  titleCopy: { flex: 1 },
  eyebrow: { fontSize: 9, lineHeight: 13, letterSpacing: 1.2 },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  hint: {
    marginBottom: Spacing.three,
  },
  filterRow: {
    gap: Spacing.two,
    paddingRight: Spacing.four,
    marginBottom: Spacing.three,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
});
