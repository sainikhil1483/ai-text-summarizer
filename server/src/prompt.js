export function buildPrompt(userText) {
  return `You are a JSON generator. Your only job is to output valid, parseable JSON.

CRITICAL RULES:
- Every string value MUST be wrapped in double quotes
- Do not output anything except the JSON object
- No markdown, no code fences, no explanation

Output this exact JSON structure:
{
  "summary": "your one sentence summary here",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive"
}

Rules:
- "summary" → exactly one sentence, wrapped in double quotes
- "keyPoints" → exactly 3 short strings, each wrapped in double quotes
- "sentiment" → must be exactly one of: "positive", "neutral", "negative"

Text to analyze:
${userText}

Remember: output ONLY the JSON object. All string values must be in double quotes.`;
}
