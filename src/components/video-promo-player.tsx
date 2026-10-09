import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

function youtubeVideoId(url: string) {
  return url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i)?.[1];
}

export function VideoPromoPlayer({ url }: { url?: string }) {
  if (!url) return null;

  const videoId = youtubeVideoId(url);

  if (videoId) {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Watch promotional video on YouTube"
        onPress={() => Linking.openURL(watchUrl)}
        style={({ pressed }) => [styles.container, pressed && styles.pressed]}>
        <Image
          source={{ uri: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.playButton}>
          <FontAwesome6 name="youtube" size={30} color="#FFFFFF" />
        </View>
        <View style={styles.youtubeLabel}>
          <Text style={styles.youtubeLabelText}>Watch on YouTube</Text>
        </View>
      </Pressable>
    );
  }

  return <DirectVideoPlayer url={url} />;
}

function DirectVideoPlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
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
  pressed: {
    opacity: 0.88,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '50%',
    marginTop: -30,
    width: 68,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF0000',
  },
  youtubeLabel: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(0, 0, 0, 0.76)',
  },
  youtubeLabelText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 11,
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
