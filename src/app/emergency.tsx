import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallButton } from '@/components/call-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import contacts from '@/data/emergency-contacts.json';

export default function EmergencyScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.brandHeader}>
            <Image
              source={require('@/assets/images/bidhannagar_police.png')}
              style={styles.logo}
              contentFit="contain"
            />
            <View>
              <ThemedText type="title" style={styles.title}>
                Emergency
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Bidhannagar Police Helpline Directory
              </ThemedText>
            </View>
          </View>

          <Pressable style={styles.sos} onPress={() => Linking.openURL('tel:100')}>
            <ThemedText type="subtitle" style={styles.sosText}>
              SOS — Call Police (100)
            </ThemedText>
          </Pressable>

          <ThemedView style={styles.grid}>
            {contacts.map((c) => (
              <ThemedView key={c.id} type="backgroundElement" style={styles.card}>
                <ThemedText type="smallBold">{c.label}</ThemedText>
                {c.phone ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {c.phone}
                  </ThemedText>
                ) : null}
                <CallButton phone={c.phone} label={`Call ${c.label}`} style={styles.callBtn} />
              </ThemedView>
            ))}
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
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
  },
  sos: {
    backgroundColor: '#D32F2F',
    borderRadius: Spacing.three,
    paddingVertical: Spacing.four,
    alignItems: 'center',
  },
  sosText: {
    color: '#ffffff',
    fontSize: 24,
    lineHeight: 30,
  },
  grid: {
    gap: Spacing.two,
  },
  card: {
    borderRadius: Spacing.two,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  callBtn: {
    marginTop: Spacing.one,
    alignSelf: 'flex-start',
  },
});
