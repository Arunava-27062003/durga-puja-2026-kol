import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const SOURCE_DETAILS = {
  remote: { labelKey: 'sourceRemote', fallback: 'Live server', color: '#18794E', backgroundColor: '#E9F7EF' },
  cached: { labelKey: 'sourceCached', fallback: 'Saved server data', color: '#8A5700', backgroundColor: '#FFF4D6' },
  bundled: { labelKey: 'sourceBundled', fallback: 'Built-in data', color: '#687286', backgroundColor: '#EEF1F5' },
} as const;

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function ContentStatusCard() {
  const colors = useTheme();
  const { content, refresh, source } = useAppContent();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const sourceDetails = SOURCE_DETAILS[source];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setMessage(null);
    const succeeded = await refresh();
    setMessage(
      succeeded
        ? getCopy(content.config, 'refreshSuccess', 'Latest server data loaded.')
        : getCopy(content.config, 'refreshFailure', 'Server unavailable. Existing data is still available.')
    );
    setIsRefreshing(false);
  };

  return (
    <ThemedView style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.headingRow}>
        <ThemedText type="smallBold">{getCopy(content.config, 'appDataTitle', 'App data')}</ThemedText>
        <View style={[styles.statusBadge, { backgroundColor: sourceDetails.backgroundColor }]}>
          <View style={[styles.statusDot, { backgroundColor: sourceDetails.color }]} />
          <ThemedText type="smallBold" style={{ color: sourceDetails.color }}>
            {getCopy(content.config, sourceDetails.labelKey, sourceDetails.fallback)}
          </ThemedText>
        </View>
      </View>

      <View style={styles.details}>
        <ThemedText type="small" themeColor="textSecondary">
          {getCopy(content.config, 'contentVersionLabel', 'Content version')}
        </ThemedText>
        <ThemedText type="smallBold">{content.contentVersion}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">
          {getCopy(content.config, 'lastUpdatedLabel', 'Last updated')}
        </ThemedText>
        <ThemedText type="smallBold">{formatUpdatedAt(content.updatedAt)}</ThemedText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={getCopy(content.config, 'refreshAccessibilityLabel', 'Refresh app data from the server')}
        disabled={isRefreshing}
        onPress={handleRefresh}
        style={({ pressed }) => [
          styles.refreshButton,
          { backgroundColor: colors.accent },
          pressed && !isRefreshing && styles.refreshButtonPressed,
          isRefreshing && styles.refreshButtonDisabled,
        ]}>
        {isRefreshing ? <ActivityIndicator color={Brand.white} size="small" /> : null}
        <ThemedText type="smallBold" style={[styles.refreshButtonText, { color: colors.inverseText }]}>
          {isRefreshing
            ? getCopy(content.config, 'checkingServerLabel', 'Checking server…')
            : getCopy(content.config, 'refreshDataLabel', 'Refresh data')}
        </ThemedText>
      </Pressable>

      {message ? (
        <ThemedText type="small" accessibilityLiveRegion="polite" themeColor="textSecondary">
          {message}
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.three,
    padding: Spacing.three,
    borderWidth: 1,
    borderColor: Brand.divider,
    borderRadius: Radius.medium,
    backgroundColor: Brand.surface,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Radius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  details: {
    gap: Spacing.one,
  },
  refreshButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: Radius.small,
    backgroundColor: Brand.saffronDeep,
  },
  refreshButtonPressed: {
    opacity: 0.82,
  },
  refreshButtonDisabled: {
    opacity: 0.68,
  },
  refreshButtonText: {
    color: Brand.white,
  },
});
