import { Image, type ImageSource } from 'expo-image';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDistance } from '@/utils/distance';

type Props = {
  name: string;
  address: string;
  distanceKm?: number;
  lat: number | null;
  lng: number | null;
  kind: 'pandal' | 'nearby';
  thumbnailSource?: ImageSource | string;
  onPress?: () => void;
  directionsLabel?: string;
  directionsQuery?: string;
  meta?: string;
};

/** Shared list row for a pandal or nearby service: name, address, optional distance badge, directions link. */
export function PlaceCard({ name, address, distanceKm, lat, lng, kind, thumbnailSource, onPress, directionsLabel = 'Get Directions', directionsQuery, meta }: Props) {
  const fallback = kind === 'pandal'
    ? require('@/assets/images/durga-bg-card.jpg')
    : require('@/assets/images/police-bg-card.jpg');
  const colors = useTheme();
  const mapQuery = lat !== null && lng !== null ? `${lat},${lng}` : directionsQuery?.trim();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      <ThemedView style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Image
          source={thumbnailSource ?? fallback}
          placeholder={fallback}
          style={styles.thumbnail}
          contentFit="cover"
          transition={180}
        />
        <ThemedView style={styles.copy} type="surface">
          <ThemedView style={styles.header} type="surface">
            <ThemedText type="smallBold" style={styles.name}>
              {name}
            </ThemedText>
            {distanceKm !== undefined && (
              <ThemedText type="small" style={[styles.distance, { color: colors.accent }]}>
                {formatDistance(distanceKm)}
              </ThemedText>
            )}
          </ThemedView>
          {meta ? (
            <ThemedText type="smallBold" themeColor="textSecondary" numberOfLines={1}>
              {meta}
            </ThemedText>
          ) : null}
          <ThemedText type="small" themeColor="textSecondary" numberOfLines={2}>
            {address}
          </ThemedText>
          {mapQuery ? (
            <Pressable
              onPress={(event) => {
                event.stopPropagation();
                void Linking.openURL(
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`,
                );
              }}>
              <ThemedText type="linkPrimary" style={styles.directionsText}>{directionsLabel}</ThemedText>
            </Pressable>
          ) : null}
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 126,
    padding: 10,
    gap: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: Radius.large,
    borderCurve: 'continuous',
    borderWidth: 1,
    boxShadow: '0 3px 12px rgba(106,56,12,0.1)',
  },
  pressed: { opacity: 0.82, transform: [{ scale: 0.995 }] },
  thumbnail: {
    width: 88,
    height: 106,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    backgroundColor: Brand.creamDeep,
  },
  distance: { fontSize: 11, fontVariant: ['tabular-nums'] },
  directionsText: { color: Brand.policeBlue, fontSize: 12 },
  copy: {
    flex: 1,
    minHeight: 106,
    gap: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.two,
  },
  name: {
    flexShrink: 1,
  },
});
