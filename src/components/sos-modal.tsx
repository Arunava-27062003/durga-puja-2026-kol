import { useState } from 'react';
import { Alert, Linking, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { SymbolView } from 'expo-symbols';

const SOS_PHONE = '+919147889470';
const SOS_WHATSAPP = '919147889470';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function SosModal({ visible, onClose }: Props) {
  const [sendingLocation, setSendingLocation] = useState(false);

  const handleCall = () => {
    onClose();
    Linking.openURL(`tel:${SOS_PHONE}`).catch(() => {});
  };

  const handleWhatsApp = async () => {
    setSendingLocation(true);
    let message = 'Hello, I need assistance.';
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const position = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = position.coords;
        message = `Hello, I need assistance. Here is my location: https://maps.google.com/?q=${latitude},${longitude}`;
      }
    } catch {
      // Fall back to sending without a location.
    }
    setSendingLocation(false);
    onClose();
    Linking.openURL(
      `https://wa.me/${SOS_WHATSAPP}?text=${encodeURIComponent(message)}`
    ).catch(() => {
      Alert.alert('WhatsApp not available', 'Could not open WhatsApp on this device.');
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>Need Help?</Text>

          <View style={styles.tileRow}>
            <Pressable
              onPress={handleWhatsApp}
              disabled={sendingLocation}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
              <SymbolView
                name={{ ios: 'message.fill', android: 'chat', web: 'chat' }}
                size={30}
                tintColor="#25D366"
              />
              <Text style={styles.tileLabel}>
                {sendingLocation ? 'Locating…' : 'WhatsApp'}
              </Text>
            </Pressable>

            <Pressable
              onPress={handleCall}
              style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}>
              <SymbolView
                name={{ ios: 'phone.fill', android: 'call', web: 'call' }}
                size={30}
                tintColor="#1976D2"
              />
              <Text style={styles.tileLabel}>Call</Text>
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
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 36,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 18,
  },
  title: {
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  tileRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  tile: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 22,
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tilePressed: {
    opacity: 0.75,
  },
  tileLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
});
