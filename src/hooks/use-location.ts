import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

type LocationState =
  | { status: 'loading' }
  | { status: 'denied' }
  | { status: 'error'; message: string }
  | { status: 'ready'; coords: { lat: number; lng: number } };

/** Requests foreground location permission once and returns the current position. */
export function useLocation(): LocationState {
  const [state, setState] = useState<LocationState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (cancelled) return;
      if (status !== 'granted') {
        setState({ status: 'denied' });
        return;
      }
      try {
        const position = await Location.getCurrentPositionAsync({});
        if (cancelled) return;
        setState({
          status: 'ready',
          coords: { lat: position.coords.latitude, lng: position.coords.longitude },
        });
      } catch (error) {
        if (cancelled) return;
        setState({ status: 'error', message: (error as Error).message });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
