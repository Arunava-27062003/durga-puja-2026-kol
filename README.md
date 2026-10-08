# Bidhannagar Durga Puja 2026

Expo and React Native guide app for Bidhannagar Police and Durga Puja visitors.

## Run locally

```bash
npm ci
npx expo start
```

## Content API

Production content is loaded from
`https://durgapujaapi.iema.co/api/v1/apps/bidhannagar/bootstrap`, cached on the device, and
refreshed whenever the app starts. Bundled JSON under `src/data/` remains available as an
offline and first-launch fallback. Set `EXPO_PUBLIC_API_BASE_URL` to override the API host
during development.

Pandal and nearby-place records support an optional `imageUrl`; the app uses
backend-configured fallback pictures when a location-specific image is unavailable.

## Validate

```bash
npx expo lint
npx tsc --noEmit
npx expo-doctor
```
