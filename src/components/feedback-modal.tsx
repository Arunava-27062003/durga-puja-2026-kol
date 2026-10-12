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

import { Brand } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  visible: boolean;
  endpoint?: string;
  policeName?: string;
  onClose: () => void;
};

export function FeedbackModal({ visible, endpoint, policeName = 'Bidhannagar Police', onClose }: Props) {
  const colors = useTheme();
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

    if (!endpoint) {
      Alert.alert('Unavailable', 'Feedback is temporarily unavailable. Please try again later.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message, rating }),
      });
      if (!response.ok) throw new Error(`Feedback request failed with ${response.status}`);
    } catch {
      Alert.alert('Could not send feedback', 'Check your internet connection and try again.');
      return;
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
        <View style={[styles.modalCard, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Send Feedback</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <SymbolView name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }} size={22} tintColor={colors.accent} />
            </Pressable>
          </View>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Help {policeName} improve your Durga Puja experience.
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
                  tintColor={star <= rating ? Brand.saffron : colors.border}
                />
              </Pressable>
            ))}
          </View>

          <TextInput
            placeholder="Your Name (Optional)"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          />

          <TextInput
            placeholder="Phone Number (Optional)"
            placeholderTextColor={colors.textSecondary}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            style={[styles.input, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          />

          <TextInput
            placeholder="Write your feedback or issue..."
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea, { backgroundColor: colors.input, borderColor: colors.border, color: colors.text }]}
          />

          <Pressable
            onPress={handleSubmit}
            disabled={submitted}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: colors.accent },
              pressed && styles.submitPressed,
              submitted && styles.submitDone,
            ]}>
            <Text style={[styles.submitText, { color: colors.inverseText }]}>
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
    backgroundColor: Brand.saffronWash,
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
    color: Brand.navyDeep,
  },
  subtitle: {
    fontSize: 13,
    color: Brand.muted,
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
    backgroundColor: Brand.surface,
    borderWidth: 1,
    borderColor: Brand.divider,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: Brand.navyDeep,
    marginBottom: 12,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: Brand.saffronDeep,
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
