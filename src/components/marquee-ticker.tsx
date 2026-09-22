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
        <Text style={styles.text} numberOfLines={1}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 34,
    backgroundColor: '#E53935',
    justifyContent: 'center',
    overflow: 'hidden',
    width: '100%',
  },
  textWrapper: {
    flexDirection: 'row',
  },
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
