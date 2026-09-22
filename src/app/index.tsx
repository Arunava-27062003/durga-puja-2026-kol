import { useEffect, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { AudioPlayerButton } from '@/components/audio-player-button';
import { FeedbackModal } from '@/components/feedback-modal';
import { MapViewerModal } from '@/components/map-viewer-modal';
import { MarqueeTicker } from '@/components/marquee-ticker';
import { PujaGuideModal } from '@/components/puja-guide-modal';
import { PulseRing } from '@/components/pulse-ring';
import { SosModal } from '@/components/sos-modal';
import { VideoPromoPlayer } from '@/components/video-promo-player';

const SOCIAL_LINKS = [
  {
    name: 'whatsapp',
    url: 'https://whatsapp.com/channel/0029Vb6ktnC1Hsq1kV1ZEI04',
    bg: '#25D366',
    icon: 'whatsapp',
  },
  {
    name: 'youtube',
    url: 'https://www.youtube.com/',
    bg: '#FF0000',
    icon: 'youtube',
  },
  {
    name: 'facebook',
    url: 'https://www.facebook.com/bdncitypolice',
    bg: '#1877F2',
    icon: 'facebook',
  },
  {
    name: 'twitter',
    url: 'https://twitter.com/bidhannagarpc',
    bg: '#1DA1F2',
    icon: 'x-twitter',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/bidhannagarcitypolice',
    bg: '#E4405F',
    icon: 'instagram',
  },
] as const;

const QUICK_SERVICES = [
  { label: 'Police', query: 'police', icon: 'shield.lefthalf.filled', faIcon: 'shield-halved', color: '#1976D2' },
  { label: 'Hospital', query: 'hospital', icon: 'cross.fill', faIcon: 'hospital', color: '#D32F2F' },
  { label: 'Bus Stands', query: 'bus', icon: 'bus.fill', faIcon: 'bus', color: '#E64A19' },
  { label: 'Metro', query: 'metro', icon: 'tram.fill', faIcon: 'train', color: '#FFA000' },
  { label: 'Pharmacy', query: 'pharmacy', icon: 'pills.fill', faIcon: 'pills', color: '#388E3C' },
  { label: 'Toilets', query: 'toilets', icon: 'figure.stand', faIcon: 'restroom', color: '#7B1FA2' },
  { label: 'Cafe', query: 'cafe', icon: 'cup.and.saucer.fill', faIcon: 'mug-saucer', color: '#5D4037' },
] as const;

export default function HomeScreen() {
  const [showLanding, setShowLanding] = useState(true);
  const [showPujaGuide, setShowPujaGuide] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSos, setShowSos] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [selectedDistance, setSelectedDistance] = useState('1 KM');
  const [weather, setWeather] = useState({ temp: '33.0°C', location: 'Salt Lake, Kolkata' });

  useEffect(() => {
    // Fetch live weather from WeatherAPI with fallback
    fetch('https://api.weatherapi.com/v1/current.json?key=1a4352a1880b4ad3a6d71833230802&q=Kolkata')
      .then((res) => res.json())
      .then((data) => {
        if (data?.current?.temp_c) {
          setWeather({
            temp: `${data.current.temp_c.toFixed(1)}°C`,
            location: 'Salt Lake, Kolkata',
          });
        }
      })
      .catch(() => {});
  }, []);

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  const dial = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  // 1. LANDING / WELCOME SCREEN
  if (showLanding) {
    return (
      <View style={styles.landingContainer}>
        <ImageBackground
          source={require('@/assets/images/bg.png')}
          style={styles.landingBg}
          resizeMode="cover">
          <SafeAreaView style={styles.landingSafeArea} edges={['top', 'bottom']}>
            {/* Top Logo Badges & Audio Toggle */}
            <View style={styles.landingTopRow}>
              <View style={styles.badgesGroup}>
                <Pressable
                  onPress={() => openUrl('https://www.facebook.com/bdncitypolice')}
                  style={styles.badgeCircle}>
                  <Image
                    source={require('@/assets/images/bidhannagar_police.png')}
                    style={styles.badgeImg}
                    contentFit="contain"
                  />
                </Pressable>
                <Pressable
                  onPress={() => openUrl('https://www.wownews24x7.com/')}
                  style={styles.badgeCircle}>
                  <Image
                    source={require('@/assets/images/ad_logo.png')}
                    style={styles.badgeImg}
                    contentFit="contain"
                  />
                </Pressable>
                <Pressable
                  onPress={() => openUrl('https://www.facebook.com/iemlabs')}
                  style={styles.badgeCircle}>
                  <Image
                    source={require('@/assets/images/iem_labs.jpg')}
                    style={styles.badgeImg}
                    contentFit="contain"
                  />
                </Pressable>
              </View>

              {/* Floating Dhak audio toggle */}
              <View style={styles.audioWrapper}>
                <AudioPlayerButton />
              </View>
            </View>

            {/* Bottom Glassmorphism Cards */}
            <View style={styles.landingBottomSection}>
              {/* Wishes Card */}
              <View style={styles.glassCard}>
                <Text style={styles.wishesTitle}>
                  Bidhannagar Police wishes you{'\n'}Happy Durga Pujo
                </Text>
              </View>

              {/* Description Card */}
              <View style={[styles.glassCard, styles.descCard]}>
                <View style={styles.durgaIconBadge}>
                  <LottieView
                    source={require('@/assets/lottie/durga.json')}
                    style={styles.durgaSmallIcon}
                    autoPlay
                    loop
                  />
                </View>
                <Text style={styles.descText}>
                  Durga Puja also known as Durgotsava or Sharodotsav, is an annual Hindu festival
                  originating in the Indian subcontinent
                </Text>
              </View>

              {/* Explore Button */}
              <View style={styles.exploreBtnContainer}>
                <Pressable
                  onPress={() => setShowLanding(false)}
                  style={({ pressed }) => [styles.exploreBtn, pressed && styles.pressed]}>
                  <Text style={styles.exploreBtnText}>Explore →</Text>
                </Pressable>
              </View>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    );
  }

  // 2. MAIN DASHBOARD SCREEN
  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Top Header: Weather & Social Icons */}
        <LinearGradient
          colors={['#FFE0B2', '#FFF8F3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerBar}>
          <View style={styles.weatherBox}>
            <View style={styles.weatherRow}>
              <SymbolView
                name={{ ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' }}
                size={18}
                tintColor="#FFA000"
              />
              <Text style={styles.weatherTemp}>{weather.temp}</Text>
            </View>
            <Text style={styles.weatherLoc} numberOfLines={1}>
              {weather.location}
            </Text>
          </View>

          {/* Social Icons Row */}
          <View style={styles.socialGroup}>
            {SOCIAL_LINKS.map((s) => (
              <Pressable
                key={s.name}
                onPress={() => openUrl(s.url)}
                style={[styles.socialBtn, { backgroundColor: s.bg }]}>
                <FontAwesome6 name={s.icon} brand size={14} color="#ffffff" />
              </Pressable>
            ))}
          </View>
        </LinearGradient>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Return to Welcome link */}
          <Pressable onPress={() => setShowLanding(true)} style={styles.backToWelcome}>
            <Text style={styles.backToWelcomeText}>← Back to Welcome Art</Text>
          </Pressable>

          {/* 6 Quick Action Pills (2-Column Grid) */}
          <View style={styles.actionGrid}>
            <Pressable
              onPress={() => dial('102')}
              style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
              <FontAwesome6 name="truck-medical" size={16} color="#ffffff" />
              <Text style={styles.actionPillText}>AMBULANCE</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowPujaGuide(true)}
              style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
              <FontAwesome6 name="building-columns" size={16} color="#ffffff" />
              <Text style={styles.actionPillText}>PUJA GUIDE</Text>
            </Pressable>

            <Pressable
              onPress={() => dial('9147889448')}
              style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
              <SymbolView
                name={{ ios: 'phone.fill', android: 'call', web: 'call' }}
                size={18}
                tintColor="#ffffff"
              />
              <Text style={styles.actionPillText}>POLICE HELP</Text>
            </Pressable>

            <Pressable
              onPress={() => dial('101')}
              style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
              <SymbolView
                name={{ ios: 'flame.fill', android: 'local_fire_department', web: 'local_fire_department' }}
                size={18}
                tintColor="#ffffff"
              />
              <Text style={styles.actionPillText}>FIRE HELP</Text>
            </Pressable>

            <Pressable
              onPress={() => openUrl('https://www.bidhannagarpolice.in/parkingzones')}
              style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
              <SymbolView
                name={{ ios: 'parkingsign', android: 'local_parking', web: 'local_parking' }}
                size={18}
                tintColor="#ffffff"
              />
              <Text style={styles.actionPillText}>PARKING ZONE</Text>
            </Pressable>

            <Pressable
              onPress={() => dial('9147889470')}
              style={({ pressed }) => [styles.actionPill, pressed && styles.pressed]}>
              <SymbolView
                name={{ ios: 'car.fill', android: 'directions_car', web: 'directions_car' }}
                size={18}
                tintColor="#ffffff"
              />
              <Text style={styles.actionPillText}>BD VAN SUPPORT</Text>
            </Pressable>
          </View>

          {/* Tech Cyber Quiz Orange Pill Banner */}
          <Pressable onPress={() => openUrl('https://forms.gle/N7m5F7L1wqhArheb6')}>
            {({ pressed }) => (
              <LinearGradient
                colors={['#FF8A00', '#FFC266']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.quizBanner, pressed && styles.pressed]}>
                <View style={styles.quizHeader}>
                  <SymbolView
                    name={{ ios: 'quote.bubble.fill', android: 'chat', web: 'chat' }}
                    size={18}
                    tintColor="#ffffff"
                  />
                  <Text style={styles.quizTitle}>TECH CYBER QUIZ</Text>
                </View>
                <Text style={styles.quizSub}>🎁 Win Exciting Prizes! Play and Win! 🎁</Text>
              </LinearGradient>
            )}
          </Pressable>

          {/* Emergency High-Contrast Button */}
          <Pressable
            onPress={() => router.push('/emergency')}
            style={({ pressed }) => [styles.emergencyBtn, pressed && styles.pressed]}>
            <Text style={styles.emergencyBtnText}>✱ EMERGENCY</Text>
          </Pressable>

          {/* QUICK ACCESS Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚡ QUICK ACCESS</Text>
          </View>

          {/* Horizontal Quick Access Rail */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRail}>
            {QUICK_SERVICES.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => openUrl(`https://www.google.com/maps/search/${item.query}`)}
                style={styles.quickItem}>
                <View style={[styles.quickIconCircle, { backgroundColor: `${item.color}15` }]}>
                  <FontAwesome6 name={item.faIcon} size={20} color={item.color} />
                </View>
                <Text style={styles.quickLabel}>{item.label}</Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* Embedded Promo Video Player */}
          <View style={styles.videoSection}>
            <VideoPromoPlayer />
          </View>

          {/* Running Marquee Ticker */}
          <View style={styles.marqueeSection}>
            <MarqueeTicker />
          </View>

          {/* Explore Nearby Filter Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔍 Explore Nearby</Text>
          </View>

          {/* Distance Chips */}
          <View style={styles.distanceRow}>
            {['0.5 KM', '1 KM', '2 KM', '3 KM'].map((d) => (
              <Pressable
                key={d}
                onPress={() => setSelectedDistance(d)}
                style={[styles.distChip, selectedDistance === d && styles.distChipActive]}>
                <Text
                  style={[
                    styles.distChipText,
                    selectedDistance === d && styles.distChipTextActive,
                  ]}>
                  {d}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Puja Guide Map */}
          <Pressable onPress={() => setShowMap(true)} style={styles.adBannerCard}>
            <Image
              source={require('@/assets/images/puja_guide_1.jpg')}
              style={styles.adBannerImg}
              contentFit="cover"
            />
          </Pressable>

          {/* Feature Card 1: Nearby Durga Puja */}
          <View style={styles.featureCard}>
            <Image
              source={require('@/assets/images/durga-bg-card.jpg')}
              style={styles.featureCardImg}
              contentFit="cover"
            />
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Nearby Durga Puja</Text>
              <Text style={styles.featureCardSub}>
                Find nearby Durga Puja pandals in your area.
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/pandals',
                    params: { radiusKm: String(parseFloat(selectedDistance)) },
                  })
                }
                style={({ pressed }) => [styles.cardExploreBtn, pressed && styles.pressed]}>
                <Text style={styles.cardExploreBtnText}>EXPLORE →</Text>
              </Pressable>
            </View>
          </View>

          {/* Feature Card 2: Nearby Hospitals */}
          <View style={styles.featureCard}>
            <Image
              source={require('@/assets/images/hospital-bg-card.jpg')}
              style={styles.featureCardImg}
              contentFit="cover"
            />
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Nearby Hospitals</Text>
              <Text style={styles.featureCardSub}>
                Find nearby hospitals & emergency clinics in your area.
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/nearby',
                    params: { radiusKm: String(parseFloat(selectedDistance)) },
                  })
                }
                style={({ pressed }) => [styles.cardExploreBtn, pressed && styles.pressed]}>
                <Text style={styles.cardExploreBtnText}>EXPLORE →</Text>
              </Pressable>
            </View>
          </View>

          {/* Sponsor Ad Banner 2 */}
          <View style={styles.adBannerCard}>
            <Image
              source={require('@/assets/images/ads/ad_1.jpg')}
              style={styles.adBannerImg}
              contentFit="cover"
            />
          </View>

          {/* Feature Card 3: Nearby Pharmacy */}
          <View style={styles.featureCard}>
            <Image
              source={require('@/assets/images/pharmacy-bg-card.jpg')}
              style={styles.featureCardImg}
              contentFit="cover"
            />
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Nearby Pharmacy</Text>
              <Text style={styles.featureCardSub}>Find 24/7 pharmacies in your area.</Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/nearby',
                    params: { radiusKm: String(parseFloat(selectedDistance)) },
                  })
                }
                style={({ pressed }) => [styles.cardExploreBtn, pressed && styles.pressed]}>
                <Text style={styles.cardExploreBtnText}>EXPLORE →</Text>
              </Pressable>
            </View>
          </View>

          {/* Feature Card 4: Nearby Police Station */}
          <View style={styles.featureCard}>
            <Image
              source={require('@/assets/images/police-bg-card.jpg')}
              style={styles.featureCardImg}
              contentFit="cover"
            />
            <View style={styles.featureCardContent}>
              <Text style={styles.featureCardTitle}>Nearby Police Stations</Text>
              <Text style={styles.featureCardSub}>
                Find police stations & assistance booths across Bidhannagar.
              </Text>
              <Pressable
                onPress={() => router.push('/emergency')}
                style={({ pressed }) => [styles.cardExploreBtn, pressed && styles.pressed]}>
                <Text style={styles.cardExploreBtnText}>EXPLORE →</Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Art & Developer Credits */}
          <View style={styles.footerSection}>
            <Image
              source={require('@/assets/images/bg_down.jpg')}
              style={styles.footerArt}
              contentFit="contain"
            />
            <Text style={styles.footerCredit}>Developed with ❤ for BDNPC</Text>
          </View>
        </ScrollView>

        {/* Floating Controls */}
        {/* Bottom Left: Feedback Badge */}
        <View style={styles.floatingFeedbackWrap}>
          <PulseRing color="#FF8A00" />
          <Pressable
            onPress={() => setShowFeedback(true)}
            style={({ pressed }) => [styles.floatingFeedback, pressed && styles.pressed]}>
            <Image
              source={require('@/assets/images/feedback.gif')}
              style={styles.feedbackImg}
              contentFit="cover"
            />
          </Pressable>
        </View>

        {/* Bottom Right: SOS Red Circle Button */}
        <View style={styles.floatingSosWrap}>
          <PulseRing color="#FF1744" />
          <Pressable
            onPress={() => setShowSos(true)}
            style={({ pressed }) => [styles.floatingSos, pressed && styles.pressed]}>
            <Text style={styles.sosText}>SOS</Text>
          </Pressable>
        </View>

        {/* Modals */}
        <PujaGuideModal visible={showPujaGuide} onClose={() => setShowPujaGuide(false)} />
        <FeedbackModal visible={showFeedback} onClose={() => setShowFeedback(false)} />
        <SosModal visible={showSos} onClose={() => setShowSos(false)} />
        <MapViewerModal visible={showMap} onClose={() => setShowMap(false)} />
      </SafeAreaView>
    </View>
  );
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const styles = StyleSheet.create({
  // LANDING STYLES
  landingContainer: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  landingBg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  landingSafeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  landingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  badgesGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeImg: {
    width: '100%',
    height: '100%',
  },
  audioWrapper: {
    position: 'absolute',
    right: 4,
    top: 96,
  },
  landingBottomSection: {
    gap: 14,
    marginBottom: 24,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  wishesTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 19,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    lineHeight: 25,
  },
  descCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
  },
  durgaIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  durgaSmallIcon: {
    width: '100%',
    height: '100%',
  },
  descText: {
    fontFamily: 'Poppins-Regular',
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: '#374151',
    fontWeight: '500',
  },
  exploreBtnContainer: {
    alignItems: 'flex-end',
  },
  exploreBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  exploreBtnText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },

  // MAIN DASHBOARD STYLES
  mainContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  safeArea: {
    flex: 1,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  weatherBox: {
    flex: 1,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  weatherTemp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  weatherLoc: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#616161',
    marginTop: 1,
  },
  socialGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 90,
  },
  backToWelcome: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },
  backToWelcomeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 14,
  },
  actionPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3595FF',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
    shadowColor: '#3595FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  actionPillText: {
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  quizBanner: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF8A00',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quizHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  quizTitle: {
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  quizSub: {
    fontFamily: 'Poppins-Regular',
    color: '#FFF3E0',
    fontSize: 12,
    fontWeight: '600',
  },
  emergencyBtn: {
    backgroundColor: '#FF1744',
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emergencyBtnText: {
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: 0.3,
  },
  quickRail: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  quickItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  quickIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    fontWeight: '600',
    color: '#424242',
    textAlign: 'center',
  },
  videoSection: {
    marginBottom: 14,
  },
  marqueeSection: {
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  distanceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  distChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F5F5F7',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  distChipActive: {
    backgroundColor: '#3595FF',
    borderColor: '#3595FF',
  },
  distChipText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  distChipTextActive: {
    color: '#ffffff',
  },
  adBannerCard: {
    width: '100%',
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
  },
  adBannerImg: {
    width: '100%',
    height: '100%',
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  featureCardImg: {
    width: '100%',
    height: 140,
  },
  featureCardContent: {
    padding: 16,
  },
  featureCardTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  featureCardSub: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 14,
  },
  cardExploreBtn: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardExploreBtnText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    fontWeight: '700',
    color: '#3595FF',
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  footerArt: {
    width: SCREEN_WIDTH - 60,
    height: 220,
  },
  footerCredit: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
    fontWeight: '500',
  },

  // FLOATING BUTTONS
  floatingFeedbackWrap: {
    position: 'absolute',
    bottom: 24,
    left: 18,
    width: 60,
    height: 60,
    zIndex: 999,
  },
  floatingFeedback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  feedbackImg: {
    width: 60,
    height: 60,
  },
  floatingSosWrap: {
    position: 'absolute',
    bottom: 24,
    right: 18,
    width: 60,
    height: 60,
    zIndex: 999,
  },
  floatingSos: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF1744',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF1744',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 7,
  },
  sosText: {
    fontFamily: 'Poppins-Regular',
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
});
