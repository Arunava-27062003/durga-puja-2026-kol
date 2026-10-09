import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { ComponentType } from 'react';
import { Linking, Pressable, StyleSheet, Text, TurboModuleRegistry, View } from 'react-native';
import type { WebViewProps } from 'react-native-webview';

const EmbeddedWebView: ComponentType<WebViewProps> | null = TurboModuleRegistry.get(
  'RNCWebViewModule',
)
  ? // The installed development APK may predate this native dependency.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('react-native-webview').WebView
  : null;

function youtubeVideoId(url: string) {
  return url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i)?.[1];
}

function youtubeEmbedHtml(videoId: string) {
  const embedUrl =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&playsinline=1&controls=1&rel=0&loop=1&playlist=${videoId}`;

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <style>
      html, body, iframe { width: 100%; height: 100%; margin: 0; padding: 0; border: 0; background: #000; overflow: hidden; }
    </style>
  </head>
  <body>
    <iframe
      src="${embedUrl}"
      title="Bidhannagar Police promotional video"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen>
    </iframe>
  </body>
</html>`;
}

export function VideoPromoPlayer({ url, label = 'Police promotional video', fallbackLabel = 'Watch on YouTube' }: { url?: string; label?: string; fallbackLabel?: string }) {
  if (!url) return null;

  const videoId = youtubeVideoId(url);

  if (videoId) {
    if (!EmbeddedWebView) return <YouTubeLinkFallback videoId={videoId} label={fallbackLabel} />;

    return (
      <View style={styles.container}>
        <EmbeddedWebView
          accessibilityLabel={label}
          source={{
            html: youtubeEmbedHtml(videoId),
            baseUrl: 'https://durgapujaapi.iema.co',
          }}
          style={styles.webVideo}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          setSupportMultipleWindows={false}
        />
      </View>
    );
  }

  return <DirectVideoPlayer url={url} />;
}

function YouTubeLinkFallback({ videoId, label }: { videoId: string; label: string }) {
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
        <Text style={styles.youtubeLabelText}>{label}</Text>
      </View>
    </Pressable>
  );
}

function DirectVideoPlayer({ url }: { url: string }) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = true;
    p.muted = true;
    p.play();
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
  webVideo: {
    flex: 1,
    backgroundColor: '#000000',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
