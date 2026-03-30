require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const generateRouter = require("./routes/generate");

const app = express();
const PORT = process.env.PORT || 3000;

const generateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a few minutes and try again." },
});

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/generate", generateLimiter, generateRouter);

app.listen(PORT, () => {
  console.log(`Clipdd backend running on port ${PORT}`);
});
