# Bidhannagar app: adopt the Malda (Bodhon) look and feel

Date: 2026-10-12
App: `durga-puja-2026-kol` (Bidhannagar Durga Puja app, package `com.bdnpc.iema`)
Reference: `../malda-durga-puja`

## Goal

Make the Bidhannagar app look and feel like the Malda app: palette, light/dark
theming, cards, navigation and modals. The welcome/landing screen stays exactly
as it is.

## Scope

**In scope (look and feel only):**
- Theme tokens, light/dark/system theming.
- Restyling of shared components and screens to use the new tokens.

**Out of scope:**
- Welcome/landing block in `src/app/index.tsx` (`ImageBackground` with `bg.jpg`,
  Lottie `durga.json`, partner badges, Explore button). Unchanged.
- Bidhannagar content, data JSON, config-driven copy, branding, partner logos.
- Malda-only features: floating SOS button, crowd badge, powered-by footer,
  live status, police booths, restriction points, theme toggle UI beyond what
  the provider needs.

## Design

### 1. Foundation
- Replace `src/constants/theme.ts` with Malda's tokens: `Colors` (light and
  dark), `Brand`, `Radius`, `Shadows`, `Motion`. Keep existing exports that
  Bidhannagar code already imports (`Fonts`, `Spacing`, `BottomTabInset`,
  `WebNavInset`, `MaxContentWidth`, `ThemeColor`) so call sites keep compiling.
- Add `src/theme/theme-context.tsx` (modes: system / light / dark, persisted in
  AsyncStorage, syncs the system UI background). Storage key is
  Bidhannagar-specific: `bidhannagar:theme-mode:v1`.
- `src/hooks/use-theme.ts` returns the resolved palette from the context.
- `src/app/_layout.tsx` wraps the tree in `ThemePreferenceProvider`.

### 2. Shared components
Restyle to Malda's look using the new tokens: `themed-text`, `themed-view`,
`place-card`, `app-tabs` (native and web), `content-status-card`,
`call-button`, `distance-filter`, `marquee-ticker`, `sos-modal`,
`feedback-modal`, `map-viewer-modal`, `puja-guide-modal`,
`video-promo-player`. Behavior and props are unchanged.

### 3. Screens
Restyle `index` (everything except the landing block), `pandals/index`,
`pandals/[id]`, `nearby/index`, `emergency`, `about`.

### 4. Constraints
- Hard-coded colors in Bidhannagar files move to theme tokens so dark mode works.
- The landing block keeps its current styles; it must look identical before and
  after, in both light and dark system modes.
- No new dependencies. Malda already uses the same Expo SDK and libraries
  (`@react-native-async-storage/async-storage`, `expo-system-ui` need to be
  present in Bidhannagar's `package.json`; verify, and add only if missing).

## Verification
- `npx tsc --noEmit` and `npm run lint` clean after each stage.
- Run on the Realme RMX5261 over wireless adb against the running dev server.
- Compare each screen to the Malda equivalent (`../malda-durga-puja/.reference-screens`).
- Check light and dark modes; confirm the landing screen is visually unchanged.

## Risks
- `index.tsx` is 1,001 lines with inline styles; the restyle is the largest
  chunk and is done last, in small steps.
- Bidhannagar-specific layouts without a Malda counterpart need judgment calls;
  these will be flagged for review rather than silently invented.
