# Clipdd

Android app that transforms photos into AI-generated art styles. Upload a photo, pick your styles, and get back anime, Ghibli, pixel art, comic, and cartoon versions of yourself.

## How It Works

1. Upload a photo from your camera or gallery
2. Select one or more styles (or write a custom prompt)
3. Hit Generate — styles are generated sequentially in the background
4. View, download, or share results from the Results screen
5. All generated images are automatically saved to your in-app Gallery

## AI Styles

| Style | Description |
|---|---|
| Anime | Japanese anime with clean bold lines and vibrant colors |
| Ghibli | Soft Studio Ghibli watercolor aesthetic |
| Pixel Art | Retro 8-bit game sprite style |
| Comic | Bold ink outlines with comic book shading |
| Cartoon | Exaggerated Pixar/Disney cartoon character style |
| Custom | Describe any style with a free-text prompt |

## Architecture

```
clipdd/
├── mobile/       # React Native (Android) — Expo SDK 54
└── backend/      # Node.js / Express — deployed on Render
```

The mobile app never talks to Replicate directly. All generation requests go through the backend, which holds the API key server-side.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native (Android), Expo SDK 54 |
| Navigation | React Navigation (Bottom Tabs + Native Stack) |
| State | React Context |
| Backend | Node.js / Express |
| AI Model | FLUX.1 Kontext Pro via Replicate |
| Deployment | Render |
| Local Storage | AsyncStorage + expo-file-system |

## Project Structure

```
mobile/
├── App.tsx                  # Root — fonts, providers, navigation container
├── app.json                 # Expo config
├── eas.json                 # EAS Build config (preview APK)
├── context/
│   └── ImageContext.tsx     # Global state: selected image + generation results
├── navigation/
│   ├── BottomTabs.tsx       # 4-tab navigator: Home, Styles, Results, Gallery
│   └── GalleryStack.tsx     # Nested stack inside Gallery tab
├── screens/
│   ├── WelcomeScreen.tsx    # Onboarding / splash
│   ├── UploadScreen.tsx     # Photo picker / camera
│   ├── StylesScreen.tsx     # Style selection + generation trigger
│   ├── ResultsScreen.tsx    # View, share, download generated images
│   └── GalleryScreen.tsx    # Persistent history of all saved images
├── services/
│   ├── api.ts               # POST to backend, returns StyleResult[]
│   └── storage.ts           # Gallery persistence (AsyncStorage + file system)
└── assets/                  # Icons, splash screen, style preview images

backend/
├── src/
│   ├── index.js             # Express app, rate limiting (15 req / 15 min)
│   └── routes/
│       └── generate.js      # POST /api/generate — validates input, calls Replicate
│   └── services/
│       └── replicate.js     # Replicate SDK wrapper, sequential generation with delay
```

## Running Locally

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```
REPLICATE_API_TOKEN=your_token_here
```

```bash
npm run dev
```

### Mobile

```bash
cd mobile
npm install
```

Create a `.env` file:
```
EXPO_PUBLIC_API_URL=http://your-local-ip:3000
```

```bash
npx expo start
# Press 'a' to open on Android emulator
```

## Building the APK

The app uses [EAS Build](https://docs.expo.dev/build/introduction/) to produce a standalone APK without requiring a local Android SDK.

```bash
cd mobile
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

EAS builds on Expo's cloud servers and provides a download link when complete (~10 minutes). The APK can be sideloaded directly onto any Android device.

## Generation & Batch Processing

When the user taps Generate, all selected styles are sent to the backend in a single request. The backend then calls the Replicate API **sequentially** — one style at a time — rather than firing all calls in parallel.

This is a deliberate tradeoff:

- **Parallel would be faster**, but FLUX.1 Kontext Pro enforces a strict per-minute rate limit. Firing 5 concurrent requests consistently triggers rate limit errors, causing most or all styles to fail.
- **Sequential with a 3-second delay** between each call is slower but reliable — every style completes successfully.
- The loading modal is shown for the full duration so the user knows generation is in progress.

In practice, generating 5 styles takes roughly 2–5 minutes depending on Replicate's queue load.

> **Note:** This project uses free tiers for both the backend (Render) and AI inference (Replicate). The Render server may take 30–60 seconds to wake up from sleep on the first request, and each style can take 20–60 seconds to generate depending on queue. **Please be patient — images will arrive, it just takes a couple of minutes.**

## Key Decisions

- **Sequential generation with delay** — Replicate enforces a per-minute rate limit on FLUX.1 Kontext Pro. Styles are generated one at a time with a 3-second gap between calls to avoid hitting the limit.
- **Backend proxy** — The Replicate API key is never shipped in the app. All generation goes through the Express backend.
- **Input validation** — The backend enforces a 10 MB file size cap, rejects non-image uploads, and whitelists valid style keys.
- **Rate limiting** — 15 requests per IP per 15 minutes on `/api/generate`.
- **No iOS** — Android-only target. No iOS-specific code or considerations.

## Environment Variables

### Backend
| Variable | Description |
|---|---|
| `REPLICATE_API_TOKEN` | Replicate API key |
| `PORT` | Server port (default: 3000) |

### Mobile (EAS / `.env`)
| Variable | Description |
|---|---|
| `EXPO_PUBLIC_API_URL` | Backend base URL (e.g. `https://clipdd.onrender.com`) |
