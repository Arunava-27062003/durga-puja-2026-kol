import { Image, type ImageSource } from 'expo-image';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
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
  const mapQuery = lat !== null && lng !== null ? `${lat},${lng}` : directionsQuery?.trim();

  return (
    <Pressable onPress={onPress}>
      <ThemedView type="backgroundElement" style={styles.card}>
        <Image
          source={thumbnailSource ?? fallback}
          placeholder={fallback}
          style={styles.thumbnail}
          contentFit="cover"
          transition={180}
        />
        <ThemedView style={styles.copy} type="backgroundElement">
          <ThemedView style={styles.header} type="backgroundElement">
            <ThemedText type="smallBold" style={styles.name}>
              {name}
            </ThemedText>
            {distanceKm !== undefined && (
              <ThemedText type="small" themeColor="textSecondary">
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
              <ThemedText type="linkPrimary">{directionsLabel}</ThemedText>
            </Pressable>
          ) : null}
        </ThemedView>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.two,
    flexDirection: 'row',
  },
  thumbnail: {
    width: 84,
    height: 100,
    borderRadius: Spacing.two,
  },
  copy: {
    flex: 1,
    gap: Spacing.one,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  name: {
    flexShrink: 1,
  },
});
