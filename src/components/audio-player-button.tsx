import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { SymbolView } from 'expo-symbols';

const DHAK_AUDIO_URL = 'https://audio.jukehost.co.uk/WzXqmwO3FQyAZ8Fm5S92RkyPDiSP8giV';

type Props = {
  style?: object;
};

export function AudioPlayerButton({ style }: Props) {
  const player = useAudioPlayer({ uri: DHAK_AUDIO_URL });
  const status = useAudioPlayerStatus(player);
  const hasAutoPlayed = useRef(false);

  useEffect(() => {
    // player is a native AudioPlayer handle, not compiler-tracked state — direct
    // mutation is the documented expo-audio API (see player.volume, player.loop).
    // eslint-disable-next-line react-hooks/immutability
    player.loop = true;
  }, [player]);

  useEffect(() => {
    // Autoplay must wait for the remote source to finish loading — calling
    // play() immediately after useAudioPlayer() is a silent no-op.
    if (status.isLoaded && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      player.play();
    }
  }, [player, status.isLoaded]);

  const togglePlay = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <Pressable
      onPress={togglePlay}
      style={({ pressed }) => [styles.btn, style, pressed && styles.pressed]}
      accessibilityLabel={status.playing ? 'Pause Dhak Audio' : 'Play Dhak Audio'}>
      <SymbolView
        name={{
          ios: status.playing ? 'pause.fill' : 'play.fill',
          android: status.playing ? 'pause' : 'play_arrow',
          web: status.playing ? 'pause' : 'play_arrow',
        }}
        size={20}
        tintColor="#E65100"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: '#FFE082',
  },
  pressed: {
    transform: [{ scale: 0.92 }],
    opacity: 0.85,
  },
});
