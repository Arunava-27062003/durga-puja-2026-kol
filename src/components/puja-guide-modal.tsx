import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SymbolView } from 'expo-symbols';

import { getCopy, useAppContent } from '@/content/app-content';

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const AnimatedImage = Animated.createAnimatedComponent(Image);

type Props = {
  visible: boolean;
  imageUrls: string[];
  imageAspectRatios?: number[];
  pageLabels?: string[];
  onClose: () => void;
};

type ZoomableGuidePageProps = {
  imageUrl: string;
  aspectRatio: number;
  width: number;
};

function ZoomableGuidePage({ imageUrl, aspectRatio, width }: ZoomableGuidePageProps) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const reset = () => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(savedScale.value * event.scale, MIN_SCALE), MAX_SCALE);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= MIN_SCALE) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (savedScale.value <= MIN_SCALE) return;
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      if (scale.value > MIN_SCALE) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  const changeZoom = (amount: number) => {
    const nextScale = Math.min(Math.max(scale.value + amount, MIN_SCALE), MAX_SCALE);
    scale.value = withTiming(nextScale);
    savedScale.value = nextScale;
    if (nextScale === MIN_SCALE) reset();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  const gesture = Gesture.Race(doubleTapGesture, Gesture.Simultaneous(pinchGesture, panGesture));
  const imageWidth = width - 24;
  const safeAspectRatio = aspectRatio > 0 ? aspectRatio : 1;

  return (
    <View style={styles.viewer}>
      <GestureDetector gesture={gesture}>
        <Animated.View style={styles.gestureArea}>
          <AnimatedImage
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              { width: imageWidth, height: imageWidth / safeAspectRatio },
              animatedStyle,
            ]}
            resizeMode="contain"
          />
        </Animated.View>
      </GestureDetector>
      <Pressable
        accessibilityLabel="Zoom in"
        onPress={() => changeZoom(0.5)}
        style={({ pressed }) => [styles.zoomButton, styles.zoomInButton, pressed && styles.pressed]}>
        <SymbolView name={{ ios: 'plus', android: 'add', web: 'add' }} size={22} tintColor="#FFFFFF" />
      </Pressable>
      <Pressable
        accessibilityLabel="Zoom out"
        onPress={() => changeZoom(-0.5)}
        style={({ pressed }) => [styles.zoomButton, styles.zoomOutButton, pressed && styles.pressed]}>
        <SymbolView name={{ ios: 'minus', android: 'remove', web: 'remove' }} size={22} tintColor="#FFFFFF" />
      </Pressable>
    </View>
  );
}

export function PujaGuideModal({ visible, imageUrls, imageAspectRatios = [], pageLabels = [], onClose }: Props) {
  const { content } = useAppContent();
  const [selectedPage, setSelectedPage] = useState(0);
  const { width } = useWindowDimensions();
  if (imageUrls.length === 0) return null;

  const activePage = Math.min(selectedPage, imageUrls.length - 1);
  const pageLabel = (index: number) =>
    pageLabels[index] || `${getCopy(content.config, 'guidePageLabel', 'Guide Map')} ${index + 1}`;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.container}>
        <View style={styles.topBar}>
          <Text style={styles.headerTitle}>{getCopy(content.config, 'guideTitle', 'Official Puja Guide')}</Text>
          <Pressable accessibilityLabel="Close guide" onPress={onClose} hitSlop={12} style={styles.closeButton}>
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
              size={24}
              tintColor="#424242"
            />
          </Pressable>
        </View>

        <View style={styles.tabRow}>
          {imageUrls.map((imageUrl, index) => (
            <Pressable
              key={imageUrl}
              onPress={() => setSelectedPage(index)}
              style={[styles.tab, activePage === index && styles.activeTab]}>
              <Text style={[styles.tabText, activePage === index && styles.activeTabText]} numberOfLines={2}>
                {pageLabel(index)}
              </Text>
            </Pressable>
          ))}
        </View>

        <ZoomableGuidePage
          key={`${visible}-${activePage}`}
          imageUrl={imageUrls[activePage]}
          aspectRatio={imageAspectRatios[activePage] ?? 1}
          width={width}
        />
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#212121' },
  closeButton: { padding: 4 },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
    backgroundColor: '#F7F7F9',
  },
  tab: {
    flex: 1,
    minHeight: 44,
    paddingHorizontal: 8,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#EAEAEF',
  },
  activeTab: { backgroundColor: '#1E3A8A' },
  tabText: { fontSize: 12, fontWeight: '600', color: '#616161', textAlign: 'center' },
  activeTabText: { color: '#FFFFFF' },
  viewer: { flex: 1, overflow: 'hidden', backgroundColor: '#111827' },
  gestureArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { backgroundColor: '#FFFFFF' },
  zoomButton: {
    position: 'absolute',
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  zoomInButton: { bottom: 72 },
  zoomOutButton: { bottom: 18 },
  pressed: { opacity: 0.72 },
});
