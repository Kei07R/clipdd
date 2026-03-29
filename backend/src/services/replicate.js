const Replicate = require("replicate");

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// FLUX.1 Kontext Pro — best-in-class for illustrated styles with facial likeness
const MODEL = "black-forest-labs/flux-kontext-pro";

const STYLES = {
  custom: {
    label: "Custom",
    prompt: null, // resolved at runtime from request body
  },
  anime: {
    label: "Anime",
    prompt:
      "Transform this person into Japanese anime style. Clean bold outlines, vibrant saturated colors, large expressive eyes, smooth cel-shaded skin. Keep the person's facial likeness and identity.",
  },
  ghibli: {
    label: "Ghibli",
    prompt:
      "Transform this person into Studio Ghibli watercolor illustration style. Soft warm tones, gentle painterly textures, round friendly features, dreamy pastel palette. Keep the person's facial likeness.",
  },
  pixelart: {
    label: "Pixel Art",
    prompt:
      "Transform this person into retro 8-bit pixel art style. Chunky visible pixels, limited color palette, game sprite aesthetic similar to classic RPGs. Keep the person's recognizable features.",
  },
  comic: {
    label: "Comic",
    prompt:
      "Transform this person into comic book illustration style. Bold black ink outlines, halftone dot shading, high contrast, dramatic shadows, Marvel/DC superhero comic aesthetic. Keep the person's facial likeness.",
  },
  cartoon: {
    label: "Cartoon",
    prompt:
      "Transform this person into an exaggerated Western cartoon character style. Bright flat colors, simplified shapes, rubbery proportions, Pixar/Disney animated movie aesthetic. Keep the person's recognizable features.",
  },
};

/**
 * Run a single style generation against Replicate.
 * Returns { style, label, imageUrl } on success or { style, label, error } on failure.
 */
async function generateStyle(styleKey, imageDataUrl, customPrompt) {
  const { label } = STYLES[styleKey];
  const prompt = styleKey === "custom" ? customPrompt : STYLES[styleKey].prompt;
  try {
    const output = await replicate.run(MODEL, {
      input: {
        prompt,
        input_image: imageDataUrl,
        output_format: "jpg",
        safety_tolerance: 2,
      },
    });

    // Replicate returns a URL string or an array — normalise to string
    const imageUrl = Array.isArray(output) ? output[0] : output;
    return { style: styleKey, label, imageUrl };
  } catch (err) {
    return { style: styleKey, label, error: err.message };
  }
}

/**
 * Generate only the requested styles, one at a time (rate-limit safe).
 * Always resolves — individual failures are captured per-style.
 */
async function generateSelectedStyles(imageDataUrl, styleKeys, customPrompt) {
  const results = [];
  for (const key of styleKeys) {
    results.push(await generateStyle(key, imageDataUrl, customPrompt));
  }
  return results;
}

module.exports = { generateSelectedStyles, STYLES };
