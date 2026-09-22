# Graph Report - src  (2026-09-22)

## Corpus Check
- Corpus is ~7,621 words - fits in a single context window. You may not need a graph.

## Summary
- 134 nodes · 294 edges · 9 communities (7 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Home Screen & Landing Widgets
- Theme System & UI Primitives
- Nearby / Pandals List & Location
- Detail Screens & Emergency Data
- App Shell & Native Tabs
- Animated Icon (Web)
- Web Tab Navigation

## God Nodes (most connected - your core abstractions)
1. `ThemedText()` - 13 edges
2. `ThemedView()` - 12 edges
3. `Spacing` - 12 edges
4. `MaxContentWidth` - 7 edges
5. `useTheme()` - 7 edges
6. `BottomTabInset` - 6 edges
7. `getDistanceKm()` - 6 edges
8. `useLocation()` - 5 edges
9. `PlaceCard()` - 4 edges
10. `Colors` - 4 edges

## Surprising Connections (you probably didn't know these)
- `ThemedText()` --calls--> `useTheme()`  [EXTRACTED]
  components/themed-text.tsx → hooks/use-theme.ts
- `Collapsible()` --calls--> `useTheme()`  [EXTRACTED]
  components/ui/collapsible.tsx → hooks/use-theme.ts
- `NearbyScreen()` --calls--> `useLocation()`  [EXTRACTED]
  app/nearby/index.tsx → hooks/use-location.ts
- `NearbyScreen()` --calls--> `getDistanceKm()`  [EXTRACTED]
  app/nearby/index.tsx → utils/distance.ts
- `PandalsScreen()` --calls--> `useLocation()`  [EXTRACTED]
  app/pandals/index.tsx → hooks/use-location.ts

## Import Cycles
- None detected.

## Communities (9 total, 2 thin omitted)

### Community 0 - "Home Screen & Landing Widgets"
Cohesion: 0.10
Nodes (23): QUICK_SERVICES, SOCIAL_LINKS, styles, { width: SCREEN_WIDTH }, AudioPlayerButton(), Props, styles, FeedbackModal() (+15 more)

### Community 1 - "Theme System & UI Primitives"
Cohesion: 0.15
Nodes (17): HintRowProps, styles, styles, ThemedTextProps, ThemedView(), ThemedViewProps, Collapsible(), styles (+9 more)

### Community 2 - "Nearby / Pandals List & Location"
Cohesion: 0.16
Nodes (17): CATEGORIES, NearbyScreen(), styles, PandalsScreen(), styles, PlaceCard(), Props, styles (+9 more)

### Community 3 - "Detail Screens & Emergency Data"
Cohesion: 0.15
Nodes (12): styles, styles, styles, CallButton(), Props, styles, ThemedText(), BottomTabInset (+4 more)

### Community 4 - "App Shell & Native Tabs"
Cohesion: 0.17
Nodes (10): AnimatedSplashOverlay(), glowKeyframe, keyframe, logoKeyframe, styles, AppTabs(), ref_expo_router, ref_expo_splash_screen (+2 more)

### Community 5 - "Animated Icon (Web)"
Cohesion: 0.22
Nodes (6): components_animated_icon_module, glowKeyframe, keyframe, logoKeyframe, styles, ref_react_native_reanimated

### Community 6 - "Web Tab Navigation"
Cohesion: 0.25
Nodes (4): styles, ExternalLink(), Props, ref_expo_web_browser

## Knowledge Gaps
- **43 isolated node(s):** `styles`, `styles`, `SOCIAL_LINKS`, `QUICK_SERVICES`, `{ width: SCREEN_WIDTH }` (+38 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 71 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ThemedText()` connect `Detail Screens & Emergency Data` to `Theme System & UI Primitives`, `Nearby / Pandals List & Location`, `Web Tab Navigation`?**
  _High betweenness centrality (0.021) - this node is a cross-community bridge._
- **Why does `Spacing` connect `Theme System & UI Primitives` to `Nearby / Pandals List & Location`, `Detail Screens & Emergency Data`, `Web Tab Navigation`?**
  _High betweenness centrality (0.019) - this node is a cross-community bridge._
- **Why does `ThemedView()` connect `Theme System & UI Primitives` to `Nearby / Pandals List & Location`, `Detail Screens & Emergency Data`, `Web Tab Navigation`?**
  _High betweenness centrality (0.017) - this node is a cross-community bridge._
- **What connects `styles`, `styles`, `SOCIAL_LINKS` to the rest of the system?**
  _43 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Home Screen & Landing Widgets` be split into smaller, more focused modules?**
  _Cohesion score 0.09885057471264368 - nodes in this community are weakly interconnected._