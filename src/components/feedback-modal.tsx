import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SymbolView } from 'expo-symbols';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function FeedbackModal({ visible, onClose }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      Alert.alert('Required', 'Please enter your feedback message.');
      return;
    }

    try {
      // Try sending to the backend feedback endpoint if online
      fetch('https://durgapuja.sanjhbati.click/contact/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message, rating }),
      }).catch(() => {});
    } catch {
      // Ignore network errors
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('');
      setMessage('');
      setRating(5);
      onClose();
      Alert.alert('Thank You!', 'Your feedback has been received.');
    }, 1200);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <View style={styles.header}>
            <Text style={styles.title}>Send Feedback</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <SymbolView name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }} size={22} tintColor="#757575" />
            </Pressable>
          </View>

          <Text style={styles.subtitle}>
            Help Bidhannagar Police improve your Durga Puja experience.
          </Text>

          {/* Star Rating */}
          <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable key={star} onPress={() => setRating(star)} style={styles.starBtn}>
                <SymbolView
                  name={{
                    ios: star <= rating ? 'star.fill' : 'star',
                    android: star <= rating ? 'star' : 'star_border',
                    web: star <= rating ? 'star' : 'star_outline',
                  }}
                  size={28}
                  tintColor={star <= rating ? '#FFB300' : '#BDBDBD'}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            placeholder="Your Name (Optional)"
            placeholderTextColor="#9E9E9E"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Phone Number (Optional)"
            placeholderTextColor="#9E9E9E"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            placeholder="Write your feedback or issue..."
            placeholderTextColor="#9E9E9E"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
          />

          <Pressable
            onPress={handleSubmit}
            disabled={submitted}
            style={({ pressed }) => [
              styles.submitBtn,
              pressed && styles.submitPressed,
              submitted && styles.submitDone,
            ]}>
            <Text style={styles.submitText}>
              {submitted ? 'Submitted ✓' : 'Submit Feedback'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 13,
    color: '#616161',
    marginBottom: 16,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 18,
  },
  starBtn: {
    padding: 4,
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#212121',
    marginBottom: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: '#3595FF',
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  submitPressed: {
    opacity: 0.85,
  },
  submitDone: {
    backgroundColor: '#2E7D32',
  },
  submitText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
