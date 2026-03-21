import "dotenv/config";
import express from "express";
import cors from "cors";
import { summarizeText } from "./llm.js";
import { validateInput } from "./validate.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Summarizer API is running." });
});

// Main summarize endpoint
app.post("/api/summarize", async (req, res) => {
  const validation = validateInput(req.body?.text);

  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const result = await summarizeText(validation.text);
    return res.json(result);
  } catch (err) {
    console.error("Summarization error:", err.message);
    return res.status(500).json({
      error: err.message || "Failed to summarize text. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`   POST /api/summarize  — main endpoint\n`);
});
