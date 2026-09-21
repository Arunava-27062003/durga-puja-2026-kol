import { Linking, Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

type Props = {
  phone: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
};

/** Button that dials `phone` via the tel: scheme. Renders disabled if no number is set yet. */
export function CallButton({ phone, label = 'Call', style }: Props) {
  const disabled = !phone;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => Linking.openURL(`tel:${phone}`)}
      style={[styles.button, disabled && styles.disabled, style]}>
      <ThemedText type="smallBold" style={styles.text}>
        {disabled ? 'Unavailable' : label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D32F2F',
    borderRadius: Spacing.two,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#9E9E9E',
  },
  text: {
    color: '#ffffff',
  },
});
