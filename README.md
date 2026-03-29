# Clipdd
Android app that transforms photos into multiple clipart styles using AI - cartoon, anime, pixel art, sketch, and more.

What is Clipd?
Clipd is a production-quality Android app that lets users upload a photo and instantly generate multiple clipart-style versions of themselves using AI. Select your image, hit generate, and watch all 5 styles render in parallel — no waiting, no switching screens.

How it Works

Upload a photo from your camera or gallery
Generate — all 5 styles fire simultaneously in the background
Browse results in a clean grid with smooth loading states
Download or share any generated image instantly

AI Styles
StyleDescription🎌 AnimeJapanese anime with clean lines and vibrant colors🌿 GhibliSoft Studio Ghibli watercolor aesthetic🕹️ Pixel ArtRetro 8-bit game sprite style💥 ComicBold ink outlines with comic book shading🎨 CartoonExaggerated cartoon character style

Tech Stack
LayerTechnologyFrontendReact Native (Android)BackendNode.js / ExpressAI ModelFLUX.1 Kontext Pro via ReplicateDeploymentRender (Dockerized)

Tradeoffs & Decisions

FLUX.1 Kontext Pro was selected after live testing multiple models — it outperforms alternatives on illustrated styles and preserves facial likeness consistently
5 styles were chosen deliberately — Cyberpunk and realistic styles were tested and eliminated due to inconsistent output quality with this model
Batch generation fires all 5 API calls in parallel for a faster, smoother UX
Backend proxy keeps the Replicate API key secure — never exposed in the app
Docker was used for containerization — Kubernetes was intentionally skipped as overkill for a single service at this scale. Would introduce K8s with horizontal pod autoscaling if generation load demanded it