import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallButton } from '@/components/call-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';

export default function EmergencyScreen() {
  const { content } = useAppContent();
  const { config, emergencyContacts } = content;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.brandHeader}>
            <Image
              source={config.media.policeLogoImageUrl ?? require('@/assets/images/bidhannagar_police.jpg')}
              placeholder={require('@/assets/images/bidhannagar_police.jpg')}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.brandCopy}>
              <ThemedText type="title" style={styles.title}>
                {getCopy(config, 'emergencyTitle', 'Emergency')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {getCopy(config, 'emergencySubtitle', `${config.policeName} Helpline Directory`)}
              </ThemedText>
            </View>
          </View>

          <Pressable style={styles.sos} onPress={() => Linking.openURL(`tel:${config.emergency.phone}`)}>
            <ThemedText type="subtitle" style={styles.sosText} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>
              {getCopy(config, 'emergencySosLabel', `SOS — Call ${config.emergency.label}`)}
            </ThemedText>
          </Pressable>

          <ThemedView style={styles.grid}>
            {emergencyContacts.map((c) => (
              <ThemedView key={c.id} type="backgroundElement" style={styles.card}>
                <ThemedText type="smallBold">{c.label}</ThemedText>
                {c.phone ? (
                  <ThemedText type="small" themeColor="textSecondary">
                    {c.phone}
                  </ThemedText>
                ) : null}
                <CallButton phone={c.phone} label={`${getCopy(config, 'callAction', 'Call')} ${c.label}`} style={styles.callBtn} />
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
  brandCopy: {
    flex: 1,
    minWidth: 0,
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
    paddingHorizontal: Spacing.three,
  },
  sosText: {
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 27,
    textAlign: 'center',
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
    alignSelf: 'stretch',
  },
});
