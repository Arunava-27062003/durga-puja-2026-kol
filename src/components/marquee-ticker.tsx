import { useEffect, useState } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

type Props = {
  text?: string;
};

export function MarqueeTicker({
  text = 'Bidhannagar Police wishes you happy Durga Puja.     মা এসেছেন !     Bidhannagar Police wishes you happy Durga Puja.',
}: Props) {
  const screenWidth = Dimensions.get('window').width;
  const [animatedValue] = useState(() => new Animated.Value(screenWidth));

  useEffect(() => {
    let isMounted = true;

    const startAnimation = () => {
      animatedValue.setValue(screenWidth);
      Animated.timing(animatedValue, {
        toValue: -800,
        duration: 16000,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && isMounted) {
          startAnimation();
        }
      });
    };

    startAnimation();

    return () => {
      isMounted = false;
      animatedValue.stopAnimation();
    };
  }, [animatedValue, screenWidth]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.textWrapper, { transform: [{ translateX: animatedValue }] }]}>
        <Text style={styles.text}>{text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    backgroundColor: '#E53935',
    overflow: 'hidden',
    width: '100%',
  },
  textWrapper: {
    // Absolute + top/bottom (no left/right) makes Yoga size this by content
    // width instead of stretching it to the container, which is what let the
    // Text wrap onto multiple lines instead of laying out on one.
    position: 'absolute',
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    // An explicit oversized width guarantees single-line layout regardless
    // of ambiguous flex/stretch sizing on ancestor views — RN Text only
    // wraps when its own measured width is narrower than its content.
    width: 1400,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
