import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { Spacing } from '@/constants/theme';

const SOURCE_DETAILS = {
  remote: { labelKey: 'sourceRemote', fallback: 'Live server', color: '#18794E', backgroundColor: '#E9F7EF' },
  cached: { labelKey: 'sourceCached', fallback: 'Saved server data', color: '#8A5700', backgroundColor: '#FFF4D6' },
  bundled: { labelKey: 'sourceBundled', fallback: 'Built-in data', color: '#60646C', backgroundColor: '#EEF1F5' },
} as const;

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export function ContentStatusCard() {
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
    <ThemedView style={styles.card}>
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
          pressed && !isRefreshing && styles.refreshButtonPressed,
          isRefreshing && styles.refreshButtonDisabled,
        ]}>
        {isRefreshing ? <ActivityIndicator color="#FFFFFF" size="small" /> : null}
        <ThemedText type="smallBold" style={styles.refreshButtonText}>
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
    borderColor: '#E0E1E6',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
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
    borderRadius: 999,
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
    borderRadius: 10,
    backgroundColor: '#225EA8',
  },
  refreshButtonPressed: {
    opacity: 0.82,
  },
  refreshButtonDisabled: {
    opacity: 0.68,
  },
  refreshButtonText: {
    color: '#FFFFFF',
  },
});
