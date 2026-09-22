import { SymbolView } from 'expo-symbols';
import { Image, Modal, Pressable, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const MIN_SCALE = 0.1;
const MAX_SCALE = 0.9;

type Props = {
  visible: boolean;
  onClose: () => void;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function MapViewerModal({ visible, onClose }: Props) {
  const scale = useSharedValue(0.2);
  const savedScale = useSharedValue(0.2);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(savedScale.value * e.scale, MIN_SCALE), MAX_SCALE);
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

  const panGesture = Gesture.Pan().onUpdate((e) => {
    if (savedScale.value <= MIN_SCALE) return;
    translateX.value = savedTranslateX.value + e.translationX;
    translateY.value = savedTranslateY.value + e.translationY;
  }).onEnd(() => {
    savedTranslateX.value = translateX.value;
    savedTranslateY.value = translateY.value;
  });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      const zoomingIn = scale.value <= MIN_SCALE;
      scale.value = withTiming(zoomingIn ? 2 : 1);
      savedScale.value = zoomingIn ? 2 : 1;
      if (!zoomingIn) {
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      }
    });

  const changeZoom = (amount: number) => {
    const nextScale = Math.min(Math.max(scale.value + amount, MIN_SCALE), MAX_SCALE);
    scale.value = withTiming(nextScale);
    savedScale.value = nextScale;

    if (nextScale === MIN_SCALE) {
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      savedTranslateX.value = 0;
      savedTranslateY.value = 0;
    }
  };

  const gesture = Gesture.Race(doubleTapGesture, Gesture.Simultaneous(pinchGesture, panGesture));

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeBtn, pressed && styles.closeBtnPressed]}>
            <SymbolView
              name={{ ios: 'xmark.circle.fill', android: 'close', web: 'close' }}
              size={26}
              tintColor="#ffffff"
            />
          </Pressable>
          <GestureDetector gesture={gesture}>
            <Animated.View style={styles.gestureArea}>
              <AnimatedImage
                source={require('@/assets/images/puja_guide_1_full.jpg')}
                style={[styles.map, animatedStyle]}
                resizeMode="contain"
              />
            </Animated.View>
          </GestureDetector>
          <Pressable
            accessibilityLabel="Zoom in"
            onPress={() => changeZoom(0.5)}
            style={({ pressed }) => [styles.zoomBtn, styles.zoomInBtn, pressed && styles.closeBtnPressed]}>
            <SymbolView
              name={{ ios: 'plus', android: 'add', web: 'add' }}
              size={24}
              tintColor="#ffffff"
            />
          </Pressable>
          <Pressable
            accessibilityLabel="Zoom out"
            onPress={() => changeZoom(-0.5)}
            style={({ pressed }) => [styles.zoomBtn, styles.zoomOutBtn, pressed && styles.closeBtnPressed]}>
            <SymbolView
              name={{ ios: 'minus', android: 'remove', web: 'remove' }}
              size={24}
              tintColor="#ffffff"
            />
          </Pressable>
        </SafeAreaView>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },
  closeBtnPressed: {
    opacity: 0.7,
  },
  zoomBtn: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomInBtn: {
    bottom: 84,
  },
  zoomOutBtn: {
    bottom: 28,
  },
  gestureArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: '100%',
    aspectRatio: 1878 / 2400,
  },
});
