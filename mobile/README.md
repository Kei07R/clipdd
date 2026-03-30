# Clipdd — Mobile

React Native (Expo) Android app that lets users transform photos into AI-generated art styles.

## Directory Structure

```
mobile/
├── App.tsx                    # Root component — fonts, providers, root navigator
├── app.json                   # Expo config (plugins, permissions, app metadata)
├── index.ts                   # Entry point (registers App with Expo)
├── .env                       # Local env vars (EXPO_PUBLIC_API_URL)
├── .env.example               # Template for env vars
│
├── context/
│   └── ImageContext.tsx       # Global state: selected imageUri + generation results
│
├── navigation/
│   ├── BottomTabs.tsx         # Bottom tab navigator (Home, Styles, Results, Gallery)
│   └── GalleryStack.tsx       # Stack navigator nested inside the Gallery tab
│
├── screens/
│   ├── types.ts               # TypeScript types for all navigation param lists
│   ├── WelcomeScreen.tsx      # Splash/onboarding screen — entry point before main app
│   ├── UploadScreen.tsx       # Home tab — pick/capture a photo, navigate to Styles
│   ├── StylesScreen.tsx       # Styles tab — select styles, trigger AI generation
│   ├── ResultsScreen.tsx      # Results tab — view, share, and download generated images
│   └── GalleryScreen.tsx      # Gallery tab — persistent history of all saved images
│
├── services/
│   ├── api.ts                 # HTTP client — posts image + style selections to the backend
│   └── storage.ts             # Local persistence — saves generated images to device storage
│                              #   and manages gallery metadata via AsyncStorage
│
└── assets/                    # App icons, splash screen, and style preview images
```

## Navigation Flow

```
Welcome
  └── MainApp (BottomTabs)
        ├── Home (UploadScreen)
        ├── Styles (StylesScreen)
        ├── Results (ResultsScreen)
        └── Gallery
              └── GalleryHome (GalleryScreen)
```

The root stack has two screens: `Welcome` and `MainApp`. Tapping "Get Started" on the Welcome screen pushes `MainApp`, which renders the bottom tab navigator for the rest of the app lifecycle.

## Key Concepts

### State Management
`ImageContext` is the single source of truth shared across screens:
- `imageUri` — the photo the user selected or captured
- `results` — array of `StyleResult` objects returned from the backend after generation

Both are set from `StylesScreen` after a successful API call and read by `ResultsScreen`.

### Style Generation Flow
1. User picks a photo on `UploadScreen` (camera or gallery)
2. User selects one or more styles on `StylesScreen` and taps Generate
3. `StylesScreen` calls `generateStyles()` in `services/api.ts`, which POSTs a `multipart/form-data` request to the backend
4. Results are stored in `ImageContext` and the app navigates to `Results`
5. `StylesScreen` also calls `saveToGallery()` to persist the generated images locally

### Local Gallery
`services/storage.ts` downloads generated images from their remote Replicate URLs into the app's `documentDirectory` and stores metadata (id, localUri, style, label, createdAt) in AsyncStorage under the key `clipdd_gallery`.

`GalleryScreen` reads this list on every focus and displays all saved items in a 2-column grid.

### Safe Area
`useSafeAreaInsets` from `react-native-safe-area-context` is used in `BottomTabs` to push the tab bar above the Android system navigation bar. Screens themselves do not need to re-apply bottom insets — the tab bar height already accounts for them.

## Environment

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Base URL of the backend (e.g. `https://clipdd.onrender.com`) |

Copy `.env.example` to `.env` and fill in the value before running.

## Running Locally

```bash
cd mobile
npm install
npx expo start
```

Press `a` to open on a connected Android device or emulator.
