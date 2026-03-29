# Clipdd — Claude Code Guide

## Project Overview

Android app that transforms photos into clipart styles using AI. Users upload a photo and generate 5 styles simultaneously: Anime, Ghibli, Pixel Art, Comic, Cartoon.

## Architecture

```
clipdd/
├── mobile/       # React Native (Android)
└── backend/      # Node.js / Express (Dockerized, deployed on Render)
```

## Tech Stack

- **Frontend**: React Native (Android)
- **Backend**: Node.js / Express
- **AI Model**: FLUX.1 Kontext Pro via Replicate
- **Deployment**: Render (Docker)

## Key Design Decisions

- An option to fire all 5 style API calls for faster UX, but we are rate limited, so they should run sequentially.
- Backend proxies Replicate API key — never exposed in the app
- 5 styles chosen deliberately after live testing; Cyberpunk and realistic styles eliminated due to inconsistent output

## Development Notes

- Keep Replicate API key server-side only
- Style generation must remain parallel (not sequential)
- Android-only target — no iOS considerations needed
