import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppState } from 'react-native';

import bundledContacts from '@/data/emergency-contacts.json';
import bundledPlaces from '@/data/nearby-places.json';
import bundledPandals from '@/data/pandals.json';

const APP_ID = 'bidhannagar';
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://durgapujaapi.iema.co').replace(/\/$/, '');
const CACHE_KEY = `durga-puja-content:${APP_ID}:v1`;
const REQUEST_TIMEOUT_MS = 10_000;

export type Pandal = {
  id: string;
  name: string;
  area: string;
  address: string;
  lat: number | null;
  lng: number | null;
  description: string;
  timings: string;
  verified: boolean;
  imageUrl?: string | null;
};

export type NearbyPlace = {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string;
  verified: boolean;
  imageUrl?: string | null;
};

export type EmergencyContact = {
  id: string;
  label: string;
  phone: string;
  category: string;
  verified: boolean;
};

export type AppConfig = {
  contentVersion: string;
  updatedAt: string;
  displayName: string;
  policeName: string;
  district: string;
  home: { title: string; subtitle: string; welcomeMessage: string };
  emergency: {
    label: string;
    phone: string;
    firePhone?: string;
    whatsapp?: string;
    policeHelpPhone?: string;
    bdVanPhone?: string;
    ambulancePhone?: string;
  };
  announcements: string[];
  socialLinks: Record<string, string>;
  externalLinks: Record<string, string>;
  copy?: Record<string, string>;
  about?: {
    festivalTitle: string;
    festivalBody: string;
    appTitle: string;
    appBody: string;
    organizerTitle: string;
    organizerName: string;
  };
  weather?: { temperature: string; location: string };
  partners?: { id: string; imageUrl: string; linkUrl: string; accessibilityLabel?: string }[];
  quickServices?: {
    label: string;
    query: string;
    icon: string;
    color: string;
  }[];
  media: {
    pandalFallbackImageUrl?: string;
    parkingFallbackImageUrl?: string;
    guideMapImageUrl?: string;
    guideMapImageUrls?: string[];
    guideMapAspectRatio?: number;
    promoVideoUrl?: string;
    welcomeBackgroundImageUrl?: string;
    policeLogoImageUrl?: string;
    dhakAudioUrl?: string;
    hospitalFallbackImageUrl?: string;
    pharmacyFallbackImageUrl?: string;
    policeFallbackImageUrl?: string;
    sponsorBannerImageUrl?: string;
    footerImageUrl?: string;
    feedbackImageUrl?: string;
  };
  features: Record<string, boolean>;
};

export type AppContent = {
  schemaVersion: 1;
  appId: typeof APP_ID;
  contentVersion: string;
  updatedAt: string;
  config: AppConfig;
  pandals: Pandal[];
  nearbyPlaces: NearbyPlace[];
  emergencyContacts: EmergencyContact[];
};

const fallbackConfig: AppConfig = {
  contentVersion: 'bundled',
  updatedAt: '2026-10-09T08:23:44.399Z',
  displayName: 'Bidhannagar Durga Puja Guide 2026',
  policeName: 'Bidhannagar Police',
  district: 'Bidhannagar',
  home: {
    title: 'Durga Puja Guide 2026',
    subtitle: 'Bidhannagar Police',
    welcomeMessage: 'Bidhannagar Police wishes you Happy Durga Pujo.',
  },
  emergency: {
    label: 'Bidhannagar Police Control Room',
    phone: '+919147889470',
    whatsapp: '919147889470',
    policeHelpPhone: '9147889448',
    bdVanPhone: '9147889470',
    ambulancePhone: '102',
    firePhone: '101',
  },
  announcements: ['Bidhannagar Police wishes you happy Durga Puja.     মা এসেছেন !'],
  socialLinks: {
    whatsapp: 'https://whatsapp.com/channel/0029Vb6ktnC1Hsq1kV1ZEI04',
    youtube: 'https://www.youtube.com/@Bidhannagar.CityPolice',
    facebook: 'https://www.facebook.com/bdncitypolice',
    x: 'https://twitter.com/bidhannagarpc',
    instagram: 'https://www.instagram.com/bidhannagarcitypolice',
  },
  externalLinks: {
    cyberQuiz: 'https://forms.gle/N7m5F7L1wqhArheb6',
    parkingZones: 'https://www.bidhannagarpolice.in/parkingzones',
  },
  copy: {},
  weather: { temperature: '—', location: 'Salt Lake, Kolkata' },
  media: {},
  features: { pandals: true, nearby: true, emergency: true, guideMap: true, promoVideo: true },
};

const fallbackContent: AppContent = {
  schemaVersion: 1,
  appId: APP_ID,
  contentVersion: 'bundled',
  updatedAt: fallbackConfig.updatedAt,
  config: fallbackConfig,
  pandals: bundledPandals as Pandal[],
  nearbyPlaces: bundledPlaces as NearbyPlace[],
  emergencyContacts: bundledContacts as EmergencyContact[],
};

type ContentContextValue = {
  content: AppContent;
  source: 'bundled' | 'cached' | 'remote';
  refresh: () => Promise<boolean>;
};

const ContentContext = createContext<ContentContextValue | null>(null);

function isAppContent(value: unknown): value is AppContent {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AppContent>;
  return (
    candidate.schemaVersion === 1 &&
    candidate.appId === APP_ID &&
    !!candidate.config &&
    Array.isArray(candidate.pandals) &&
    Array.isArray(candidate.nearbyPlaces) &&
    Array.isArray(candidate.emergencyContacts)
  );
}

function normalizeContent(content: AppContent): AppContent {
  const remoteConfig = content.config ?? fallbackConfig;
  return {
    ...content,
    config: {
      ...fallbackConfig,
      ...remoteConfig,
      home: { ...fallbackConfig.home, ...remoteConfig.home },
      emergency: { ...fallbackConfig.emergency, ...remoteConfig.emergency },
      socialLinks: { ...fallbackConfig.socialLinks, ...remoteConfig.socialLinks },
      externalLinks: { ...fallbackConfig.externalLinks, ...remoteConfig.externalLinks },
      media: { ...fallbackConfig.media, ...remoteConfig.media },
      features: { ...fallbackConfig.features, ...remoteConfig.features },
      copy: { ...fallbackConfig.copy, ...remoteConfig.copy },
      weather: {
        temperature: remoteConfig.weather?.temperature ?? fallbackConfig.weather?.temperature ?? '—',
        location: remoteConfig.weather?.location ?? fallbackConfig.weather?.location ?? 'Salt Lake, Kolkata',
      },
    },
  };
}

async function fetchContent() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/apps/${APP_ID}/bootstrap`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Content request failed with ${response.status}`);
    const payload: unknown = await response.json();
    if (!isAppContent(payload)) throw new Error('Content response has an unsupported shape');
    return normalizeContent(payload);
  } finally {
    clearTimeout(timeout);
  }
}

export function AppContentProvider({ children }: PropsWithChildren) {
  const [content, setContent] = useState(fallbackContent);
  const [source, setSource] = useState<ContentContextValue['source']>('bundled');

  const refresh = useCallback(async () => {
    try {
      const remoteContent = await fetchContent();
      setContent(remoteContent);
      setSource('remote');
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(remoteContent));
      return true;
    } catch {
      // Keep the cached or bundled content when the network is unavailable.
      return false;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrate = async () => {
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: unknown = JSON.parse(cached);
          if (!cancelled && isAppContent(parsed)) {
            setContent(normalizeContent(parsed));
            setSource('cached');
          }
        }
      } catch {
        // Ignore invalid or unavailable cache data.
      }

      if (!cancelled) await refresh();
    };

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refresh();
    });
    return () => subscription.remove();
  }, [refresh]);

  const value = useMemo(() => ({ content, source, refresh }), [content, refresh, source]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function getCopy(config: AppConfig, key: string, fallback: string) {
  const value = config.copy?.[key];
  return typeof value === 'string' && value.trim() ? value : fallback;
}

export function useAppContent() {
  const value = useContext(ContentContext);
  if (!value) throw new Error('useAppContent must be used within AppContentProvider');
  return value;
}
