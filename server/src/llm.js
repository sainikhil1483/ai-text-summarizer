import Groq from "groq-sdk";
import { buildPrompt } from "./prompt.js";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeText(text) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error(
      "GROQ_API_KEY is not set. Please add it to your .env file."
    );
  }

  const prompt = buildPrompt(text);

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 512,
    messages: [{ role: "user", content: prompt }],
  });

  const rawText = completion.choices[0]?.message?.content || "";

  // Strip markdown fences
  let cleaned = rawText
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  // Extract JSON object even if there's extra text around it
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // Repair unquoted string values like: "summary": Some text here,
  // This fixes cases where the model forgets to wrap values in quotes
  cleaned = cleaned.replace(
    /("summary"\s*:\s*)([^"\[{][^,\n]*?)(\s*[,\n])/g,
    (match, key, value, end) => {
      const trimmed = value.trim();
      if (trimmed.startsWith('"')) return match;
      return `${key}"${trimmed}"${end}`;
    }
  );

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON parse error:", e.message);
    console.error("Cleaned text:", cleaned);
    throw new Error(
      "The model returned an unexpected format. Please try again."
    );
  }

  // Validate required fields
  if (
    !parsed.summary ||
    typeof parsed.summary !== "string" ||
    !Array.isArray(parsed.keyPoints) ||
    parsed.keyPoints.length !== 3 ||
    !["positive", "neutral", "negative"].includes(parsed.sentiment)
  ) {
    throw new Error("Model response did not match expected structure.");
  }

  return {
    summary: parsed.summary,
    keyPoints: parsed.keyPoints,
    sentiment: parsed.sentiment,
  };
}
