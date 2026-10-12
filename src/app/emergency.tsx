import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CallButton } from '@/components/call-button';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getCopy, useAppContent } from '@/content/app-content';
import { BottomTabInset, Brand, MaxContentWidth, Radius, Spacing, WebNavInset } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function EmergencyScreen() {
  const { content } = useAppContent();
  const { config, emergencyContacts } = content;
  const colors = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.brandHeader}>
            <Image
              source={config.media.policeLogoImageUrl ?? require('@/assets/images/bidhannagar_police.jpg')}
              placeholder={require('@/assets/images/bidhannagar_police.jpg')}
              style={styles.logo}
              contentFit="contain"
            />
            <View style={styles.brandCopy}>
              <ThemedText type="smallBold" style={[styles.eyebrow, { color: colors.accent }]}>
                {config.policeName.toUpperCase()}
              </ThemedText>
              <ThemedText type="title" style={styles.title}>
                {getCopy(config, 'emergencyTitle', 'Emergency')}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                {getCopy(config, 'emergencySubtitle', `${config.policeName} Helpline Directory`)}
              </ThemedText>
            </View>
          </View>

          <Pressable
            accessibilityRole="button"
            style={({ pressed }) => [styles.sos, pressed && styles.pressed]}
            onPress={() => Linking.openURL(`tel:${config.emergency.phone}`)}>
            <FontAwesome6 name="phone-volume" size={22} color={Brand.white} />
            <ThemedText type="subtitle" style={styles.sosText} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.75}>
              {getCopy(config, 'emergencySosLabel', `SOS — Call ${config.emergency.label}`)}
            </ThemedText>
          </Pressable>

          <ThemedView style={styles.grid}>
            {emergencyContacts.map((c) => (
              <ThemedView
                key={c.id}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
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
    paddingHorizontal: Spacing.three,
    paddingTop: WebNavInset + Spacing.two,
    paddingBottom: BottomTabInset + Spacing.four,
    gap: Spacing.three,
  },
  eyebrow: { fontSize: 9, lineHeight: 13, letterSpacing: 1.2 },
  pressed: { opacity: 0.78 },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: Radius.medium,
  },
  brandCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
  },
  sos: {
    backgroundColor: Brand.vermilion,
    borderRadius: Radius.medium,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
  },
  sosText: {
    flexShrink: 1,
    color: '#ffffff',
    fontSize: 20,
    lineHeight: 27,
    textAlign: 'center',
  },
  grid: {
    gap: Spacing.two,
  },
  card: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: Brand.saffron,
    borderRadius: Radius.medium,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  callBtn: {
    marginTop: Spacing.one,
    alignSelf: 'stretch',
  },
});
