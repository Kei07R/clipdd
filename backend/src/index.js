const express = require("express");
const cors = require("cors");
const generateRouter = require("./routes/generate");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "20mb" }));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/generate", generateRouter);

app.listen(PORT, () => {
  console.log(`Clipdd backend running on port ${PORT}`);
});
