const express = require("express");
const multer = require("multer");
const { generateAllStyles } = require("../services/replicate");

const router = express.Router();

// Store upload in memory — convert to base64 data URL for Replicate
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

/**
 * POST /api/generate
 * Accepts multipart/form-data with an `image` field.
 * Returns an array of generation results, one per style.
 */
router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided" });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res
      .status(500)
      .json({ error: "Server misconfiguration: missing API token" });
  }

  const imageDataUrl = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

  const results = await generateAllStyles(imageDataUrl);
  const hasAnySuccess = results.some((r) => !r.error);

  if (!hasAnySuccess) {
    return res.status(502).json({
      error: "All style generations failed",
      details: results,
    });
  }

  res.json({ results });
});

// Multer error handler
router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({ error: "Image too large (max 10 MB)" });
  }
  res.status(400).json({ error: err.message });
});

module.exports = router;
