# Clipdd Backend

Node.js/Express server that proxies image generation requests to Replicate, keeping the API key secure and off the client.

## How It Works

1. The mobile app sends a photo to `POST /api/generate`
2. The server fires all 5 style generations **in parallel** against Replicate's FLUX.1 Kontext Pro model
3. Results (image URLs) are returned in a single response once all requests settle

## Setup

```bash
cp .env.example .env   # add your Replicate API token
npm install
npm run dev            # runs with nodemon on port 3000
```

## Environment Variables

| Variable              | Description                                         |
| --------------------- | --------------------------------------------------- |
| `REPLICATE_API_TOKEN` | Your Replicate API token — get one at replicate.com |
| `PORT`                | Port to listen on (default: `3000`)                 |

## API

### `POST /api/generate`

Generates all 5 clipart styles from a photo.

**Request**

`Content-Type: multipart/form-data`

| Field   | Type | Description                                          |
| ------- | ---- | ---------------------------------------------------- |
| `image` | file | The photo to transform (max 10 MB, must be an image) |

**Response `200`**

```json
{
  "results": [
    { "style": "anime", "label": "Anime", "imageUrl": "https://..." },
    { "style": "ghibli", "label": "Ghibli", "imageUrl": "https://..." },
    { "style": "pixelart", "label": "Pixel Art", "imageUrl": "https://..." },
    { "style": "comic", "label": "Comic", "imageUrl": "https://..." },
    { "style": "cartoon", "label": "Cartoon", "imageUrl": "https://..." }
  ]
}
```

Individual styles can fail without failing the whole request. A failed style includes an `error` field instead of `imageUrl`:

```json
{ "style": "anime", "label": "Anime", "error": "upstream timeout" }
```

**Error Responses**

| Status | Meaning                                     |
| ------ | ------------------------------------------- |
| `400`  | No image provided or invalid file type      |
| `413`  | Image exceeds 10 MB limit                   |
| `502`  | All 5 style generations failed              |
| `500`  | Server misconfiguration (missing API token) |

## Project Structure

```
src/
├── index.js           # Express app setup and server start
├── routes/
│   └── generate.js    # POST /api/generate handler
└── services/
    └── replicate.js   # Replicate client, style prompts, parallel execution
```

## Styles

| Key        | Label     | Description                                        |
| ---------- | --------- | -------------------------------------------------- |
| `anime`    | Anime     | Japanese anime with clean lines and vibrant colors |
| `ghibli`   | Ghibli    | Studio Ghibli soft watercolor aesthetic            |
| `pixelart` | Pixel Art | Retro 8-bit game sprite style                      |
| `comic`    | Comic     | Bold ink outlines with comic book shading          |
| `cartoon`  | Cartoon   | Exaggerated Western cartoon character style        |

## Docker

```bash
docker build -t clipdd-backend .
docker run -p 3000:3000 -e REPLICATE_API_TOKEN=your_token clipdd-backend
```
