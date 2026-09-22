import { StyleSheet, View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';

const PROMO_VIDEO_URL =
  'https://churchkonnect.s3.ap-south-1.amazonaws.com/videos/Durga+Puja+Promo+BDNPC.mp4';

export function VideoPromoPlayer() {
  const player = useVideoPlayer(PROMO_VIDEO_URL, (p) => {
    p.loop = true;
  });

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        nativeControls={true}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000000',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
