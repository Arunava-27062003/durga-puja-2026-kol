import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from './themed-text';

const OPTIONS = ['All', '0.5 KM', '1 KM', '2 KM', '3 KM'] as const;

type Props = {
  value: number | null;
  onChange: (km: number | null) => void;
};

export function DistanceFilter({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const km = opt === 'All' ? null : parseFloat(opt);
        const active = value === km;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(km)}
            style={[styles.chip, active && styles.chipActive]}>
            <ThemedText type="small" style={active ? styles.textActive : undefined}>
              {opt}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F0F0F3',
  },
  chipActive: {
    backgroundColor: '#3595FF',
  },
  textActive: {
    color: '#ffffff',
  },
});
