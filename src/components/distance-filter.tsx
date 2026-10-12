import { Pressable, StyleSheet, View } from 'react-native';

import { Brand, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

const OPTIONS = ['All', '0.5 KM', '1 KM', '2 KM', '3 KM'] as const;

type Props = {
  value: number | null;
  onChange: (km: number | null) => void;
};

export function DistanceFilter({ value, onChange }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.row}>
      {OPTIONS.map((opt) => {
        const km = opt === 'All' ? null : parseFloat(opt);
        const active = value === km;
        return (
          <Pressable
            key={opt}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(km)}
            style={({ pressed }) => [
              styles.chip,
              { backgroundColor: colors.input, borderColor: colors.border },
              active && { backgroundColor: colors.accent, borderColor: colors.accent },
              pressed && styles.pressed,
            ]}>
            <ThemedText
              type="smallBold"
              style={[styles.text, { color: colors.text }, active && { color: colors.inverseText }]}>
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
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  chip: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Brand.divider,
  },
  text: { fontSize: 12 },
  pressed: { opacity: 0.72 },
});
