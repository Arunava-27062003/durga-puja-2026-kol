import { Linking, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { formatDistance } from '@/utils/distance';

type Props = {
  name: string;
  address: string;
  distanceKm?: number;
  lat: number;
  lng: number;
  onPress?: () => void;
};

/** Shared list row for a pandal or nearby service: name, address, optional distance badge, directions link. */
export function PlaceCard({ name, address, distanceKm, lat, lng, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <ThemedView type="backgroundElement" style={styles.card}>
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
        <ThemedText type="small" themeColor="textSecondary">
          {address}
        </ThemedText>
        <Pressable
          onPress={() =>
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`)
          }>
          <ThemedText type="linkPrimary">Get Directions</ThemedText>
        </Pressable>
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
