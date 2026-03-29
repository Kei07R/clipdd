# Clipdd Backend

Node.js/Express server that proxies image generation requests to Replicate, keeping the API key secure and off the client.

## How It Works

1. The mobile app sends a photo and selected styles to `POST /api/generate`
2. The server generates each style **sequentially** against Replicate's FLUX.1 Kontext Pro model (rate-limit safe)
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

Generates clipart styles from a photo.

**Request**

`Content-Type: multipart/form-data`

| Field          | Type   | Required | Description                                                                 |
| -------------- | ------ | -------- | --------------------------------------------------------------------------- |
| `image`        | file   | yes      | The photo to transform (max 10 MB, must be an image)                        |
| `styles`       | string | no       | Comma-separated style keys to generate (e.g. `"anime,comic"`). Defaults to all preset styles. |
| `customPrompt` | string | no*      | Your own prompt. Required when `custom` is included in `styles`.            |

**Response `200`**

```json
{
  "results": [
    { "style": "anime",    "label": "Anime",     "imageUrl": "https://..." },
    { "style": "ghibli",   "label": "Ghibli",    "imageUrl": "https://..." },
    { "style": "pixelart", "label": "Pixel Art", "imageUrl": "https://..." },
    { "style": "comic",    "label": "Comic",     "imageUrl": "https://..." },
    { "style": "cartoon",  "label": "Cartoon",   "imageUrl": "https://..." },
    { "style": "custom",   "label": "Custom",    "imageUrl": "https://..." }
  ]
}
```

Individual styles can fail without failing the whole request. A failed style includes an `error` field instead of `imageUrl`:

```json
{ "style": "anime", "label": "Anime", "error": "upstream timeout" }
```

**Error Responses**

| Status | Meaning                                                  |
| ------ | -------------------------------------------------------- |
| `400`  | No image, invalid file type, or missing `customPrompt`   |
| `413`  | Image exceeds 10 MB limit                                |
| `502`  | All style generations failed                             |
| `500`  | Server misconfiguration (missing API token)              |

## Project Structure

```
src/
├── index.js           # Express app setup and server start
├── routes/
│   └── generate.js    # POST /api/generate handler
└── services/
    └── replicate.js   # Replicate client, style prompts, sequential execution
```

## Styles

| Key        | Label     | Description                                              |
| ---------- | --------- | -------------------------------------------------------- |
| `anime`    | Anime     | Japanese anime with clean lines and vibrant colors       |
| `ghibli`   | Ghibli    | Studio Ghibli soft watercolor aesthetic                  |
| `pixelart` | Pixel Art | Retro 8-bit game sprite style                            |
| `comic`    | Comic     | Bold ink outlines with comic book shading                |
| `cartoon`  | Cartoon   | Exaggerated Western cartoon character style              |
| `custom`   | Custom    | User-supplied prompt — requires `customPrompt` in request |

## Docker

```bash
docker build -t clipdd-backend .
docker run -p 3000:3000 -e REPLICATE_API_TOKEN=your_token clipdd-backend
```
