import { useState } from 'react';
import { Alert, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { SymbolView } from 'expo-symbols';

import { Brand, Radius } from '@/constants/theme';
import { getCopy, useAppContent } from '@/content/app-content';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  visible: boolean;
  phone: string;
  whatsapp?: string;
  onClose: () => void;
};

export function SosModal({ visible, phone, whatsapp, onClose }: Props) {
  const [sendingLocation, setSendingLocation] = useState(false);
  const { content } = useAppContent();
  const colors = useTheme();

  const handleCall = () => {
    onClose();
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleWhatsApp = async () => {
    setSendingLocation(true);
    let message = getCopy(content.config, 'whatsappHelpMessage', 'Hello, I need assistance.');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        message = `${getCopy(content.config, 'whatsappLocationMessage', 'Hello, I need assistance. Here is my location:')} https://maps.google.com/?q=${latitude},${longitude}`;
      }
    } catch {
      // Fall back to sending without a location.
    }
    setSendingLocation(false);
    onClose();
    Linking.openURL(
      `https://wa.me/${whatsapp ?? phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    ).catch(() => {
      Alert.alert(
        getCopy(content.config, 'whatsappUnavailableTitle', 'WhatsApp not available'),
        getCopy(content.config, 'whatsappUnavailableBody', 'Could not open WhatsApp on this device.')
      );
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.surface }]} onPress={() => {}}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          <Text style={[styles.title, { color: colors.text }]}>{getCopy(content.config, 'sosTitle', 'Need Help?')}</Text>

          <View style={styles.tileRow}>
            <Pressable
              onPress={handleWhatsApp}
              disabled={sendingLocation}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
                pressed && styles.tilePressed,
              ]}>
              <SymbolView
                name={{ ios: 'message.fill', android: 'chat', web: 'chat' }}
                size={30}
                tintColor="#25D366"
              />
              <Text style={[styles.tileLabel, { color: colors.text }]}>
                {sendingLocation
                  ? getCopy(content.config, 'locatingLabel', 'Locating…')
                  : getCopy(content.config, 'whatsappLabel', 'WhatsApp')}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: colors.surfaceRaised, borderColor: colors.border },
                pressed && styles.tilePressed,
              ]}>
              <SymbolView
                name={{ ios: 'phone.fill', android: 'call', web: 'call' }}
                size={30}
                tintColor={colors.accent}
              />
              <Text style={[styles.tileLabel, { color: colors.text }]}>{getCopy(content.config, 'callLabel', 'Call')}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Radius.large,
    borderTopRightRadius: Radius.large,
    borderCurve: 'continuous',
    borderTopWidth: 3,
    borderTopColor: Brand.saffron,
    paddingTop: 10,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  tile: {
    flex: 1,
    borderWidth: 1,
    borderRadius: Radius.medium,
    borderCurve: 'continuous',
    paddingVertical: 22,
    alignItems: 'center',
    gap: 10,
    boxShadow: '0 3px 12px rgba(106,56,12,0.1)',
  },
  tilePressed: {
    opacity: 0.75,
  },
  tileLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '600',
  },
});
