import { Link } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExternalLink } from '@/components/external-link';
import { PlaceCard } from '@/components/place-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import pandals from '@/data/pandals.json';
import { useLocation } from '@/hooks/use-location';
import { getDistanceKm } from '@/utils/distance';

const SOCIAL_LINKS: { label: string; href: `https://${string}` }[] = [
  { label: 'Facebook', href: 'https://www.facebook.com/BidhannagarPoliceCommissionerate' },
  { label: 'Twitter / X', href: 'https://twitter.com/BidhannagarPC' },
];

export default function HomeScreen() {
  const location = useLocation();

  const nearestPandal =
    location.status === 'ready'
      ? [...pandals]
          .map((p) => ({ ...p, distanceKm: getDistanceKm(location.coords, p) }))
          .sort((a, b) => a.distanceKm - b.distanceKm)[0]
      : undefined;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <ThemedText type="title" style={styles.title}>
            Bidhannagar{'\n'}Durga Puja
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            Bidhannagar Police Commissionerate
          </ThemedText>

          {nearestPandal && (
            <ThemedView style={styles.section}>
              <ThemedText type="smallBold">Nearest Pandal</ThemedText>
              <PlaceCard
                name={nearestPandal.name}
                address={nearestPandal.address}
                distanceKm={nearestPandal.distanceKm}
                lat={nearestPandal.lat}
                lng={nearestPandal.lng}
              />
            </ThemedView>
          )}

          <ThemedView style={styles.section}>
            <Link href="/nearby" style={styles.linkRow}>
              <ThemedText type="linkPrimary" style={styles.linkPrimaryText}>
                Nearby Hospitals, Pharmacy & More →
              </ThemedText>
            </Link>
            <Link href="/about" style={styles.linkRow}>
              <ThemedText type="linkPrimary" style={styles.linkPrimaryText}>
                About Durga Puja & This App →
              </ThemedText>
            </Link>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="smallBold">Follow Us</ThemedText>
            <ThemedView style={styles.socialRow}>
              {SOCIAL_LINKS.map((link) => (
                <ExternalLink key={link.href} href={link.href}>
                  <ThemedText type="linkPrimary">{link.label}</ThemedText>
                </ExternalLink>
              ))}
            </ThemedView>
          </ThemedView>
        </ScrollView>
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
    gap: Spacing.four,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
  },
  section: {
    gap: Spacing.two,
  },
  socialRow: {
    flexDirection: 'row',
    gap: Spacing.four,
  },
  linkRow: {
    paddingVertical: Spacing.one,
  },
  linkPrimaryText: {
    fontSize: 16,
  },
});
