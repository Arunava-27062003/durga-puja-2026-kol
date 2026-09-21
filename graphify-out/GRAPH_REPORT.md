# Graph Report - durga-puja-2026-kol  (2026-09-22)

## Corpus Check
- 51 files · ~54,029 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 2, .css 2)

## Summary
- 222 nodes · 315 edges · 22 communities (15 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- UI Components & Theming
- Package Dependencies
- App Navigation & Layout
- Expo App Configuration
- Package Metadata & Type Deps
- Reset Project Script
- README Documentation Links
- Animated Icon (Web Variant)
- Expo Router App Directory
- Android Adaptive Icon Config
- TypeScript Configuration
- NPM Scripts
- EAS & Bunx Convention
- Development Build vs Expo Go
- Expo SDK Versioning Policy
- Config Plugins & Native Dirs
- Prefer Expo Modules Rule
- Install Command Convention
- Start Command
- Expo Doctor Diagnostic
- TypeScript Check Command

## God Nodes (most connected - your core abstractions)
1. `react-native` - 16 edges
2. `expo` - 14 edges
3. `useTheme()` - 9 edges
4. `ThemedText()` - 8 edges
5. `ThemedView()` - 8 edges
6. `scripts` - 7 edges
7. `Spacing` - 7 edges
8. `react` - 6 edges
9. `adaptiveIcon` - 5 edges
10. `expo-image` - 5 edges

## Surprising Connections (you probably didn't know these)
- `npm run reset-project` --semantically_similar_to--> `npx expo install --fix`  [AMBIGUOUS] [semantically similar]
  README.md → AGENTS.md
- `npm install (get started step 1)` --semantically_similar_to--> `npx expo install <package>`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `app directory (file-based routing root)` --semantically_similar_to--> `src/app/ routes directory`  [INFERRED] [semantically similar]
  README.md → AGENTS.md
- `npx expo start (get started step 2)` --references--> `npx expo start`  [EXTRACTED]
  README.md → AGENTS.md
- `Using ESLint and Prettier guide` --references--> `npx expo lint`  [EXTRACTED]
  README.md → AGENTS.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AGENTS.md prescribed Expo CLI command workflow** — agents_npx_expo_install, agents_npx_expo_start, agents_npx_expo_lint, agents_npx_tsc_noemit, agents_npx_expo_doctor, agents_npx_expo_install_fix [EXTRACTED 1.00]
- **Native directory / config-plugin / dev-build rule set** — agents_native_dirs_cng_rule, agents_app_json_config_plugins, agents_development_build, agents_expo_go [EXTRACTED 1.00]
- **Overlapping getting-started install/run steps between README.md and AGENTS.md** — readme_npm_install, agents_npx_expo_install, readme_npx_expo_start_step, agents_npx_expo_start [INFERRED 0.85]

## Communities (22 total, 7 thin omitted)

### Community 0 - "UI Components & Theming"
Cohesion: 0.12
Nodes (32): expo, expo-device, expo-image, expo-symbols, react, react-native, react-native-safe-area-context, styles (+24 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.08
Nodes (25): dependencies, expo, expo-constants, expo-dev-client, expo-device, expo-font, expo-glass-effect, expo-image (+17 more)

### Community 2 - "App Navigation & Layout"
Cohesion: 0.11
Nodes (15): expo-router, expo-splash-screen, expo-web-browser, react-native-worklets, AnimatedIcon(), AnimatedSplashOverlay(), glowKeyframe, keyframe (+7 more)

### Community 3 - "Expo App Configuration"
Cohesion: 0.09
Nodes (21): projectId, reactCompiler, typedRoutes, expo, experiments, extra, icon, ios (+13 more)

### Community 4 - "Package Metadata & Type Deps"
Cohesion: 0.09
Nodes (21): devDependencies, @types/react, typescript, main, name, private, version, expo-constants (+13 more)

### Community 5 - "Reset Project Script"
Cohesion: 0.17
Nodes (10): ref_fs, ref_path, ref_readline, exampleDirPath, fs, oldDirs, path, readline (+2 more)

### Community 6 - "README Documentation Links"
Cohesion: 0.20
Nodes (9): npx expo lint, create-expo-app scaffolding tool, Expo Discord community, Using ESLint and Prettier guide, Expo documentation, Expo on GitHub, Unit Testing with Jest guide, Learn Expo tutorial (+1 more)

### Community 7 - "Animated Icon (Web Variant)"
Cohesion: 0.22
Nodes (6): react-native-reanimated, src_components_animated_icon_module, glowKeyframe, keyframe, logoKeyframe, styles

### Community 8 - "Expo Router App Directory"
Cohesion: 0.29
Nodes (8): docs.expo.dev/router/introduction, Expo Router (navigation), _layout.tsx navigator files, npx expo install --fix, src/app/ routes directory, app directory (file-based routing root), app-example directory (starter code archive), npm run reset-project

### Community 9 - "Android Adaptive Icon Config"
Cohesion: 0.25
Nodes (8): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, predictiveBackGestureEnabled, android

### Community 10 - "TypeScript Configuration"
Cohesion: 0.25
Nodes (7): expo/tsconfig.base, compilerOptions, paths, strict, extends, include, @/assets/*

### Community 11 - "NPM Scripts"
Cohesion: 0.29
Nodes (7): scripts, android, ios, lint, reset-project, start, web

### Community 12 - "EAS & Bunx Convention"
Cohesion: 0.50
Nodes (4): bunx-vs-npx convention (bun.lock presence), docs.expo.dev/eas/index, EAS (Expo Application Services), eas-cli (bunx eas-cli / npx eas-cli@latest)

### Community 13 - "Development Build vs Expo Go"
Cohesion: 0.50
Nodes (4): Development build (expo run:ios|android / eas build --profile development), Expo Go (bundled native modules sandbox), development build (run option), Expo Go (run option)

### Community 14 - "Expo SDK Versioning Policy"
Cohesion: 0.67
Nodes (3): docs.expo.dev/llms.txt (Expo docs index), docs.expo.dev/versions/v<major>.0.0/ (versioned SDK docs), "Expo has changed" versioning policy

## Ambiguous Edges - Review These
- `npx expo install --fix` → `npm run reset-project`  [AMBIGUOUS]
  README.md · relation: semantically_similar_to

## Knowledge Gaps
- **126 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+121 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 146 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `npx expo install --fix` and `npm run reset-project`?**
  _Edge tagged AMBIGUOUS (relation: semantically_similar_to) - confidence is low._
- **Why does `dependencies` connect `Package Dependencies` to `Package Metadata & Type Deps`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Why does `react-native` connect `UI Components & Theming` to `App Navigation & Layout`, `Package Metadata & Type Deps`, `Animated Icon (Web Variant)`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Scripts` to `Package Metadata & Type Deps`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _126 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `UI Components & Theming` be split into smaller, more focused modules?**
  _Cohesion score 0.11522198731501057 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._