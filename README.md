# Text Summarizer — AI Intern Assignment

A full-stack web app that accepts unstructured text and returns a structured summary using the Anthropic Claude API.

**Live output includes:**
- One-sentence summary
- Three key bullet points
- Sentiment label (positive / neutral / negative)

---

## Tech Stack

| Layer     | Technology                       | Reason                                      |
|-----------|----------------------------------|---------------------------------------------|
| Frontend  | React 18 + Vite                  | Fast setup, simple component model          |
| Backend   | Node.js + Express                | Lightweight API server, keeps keys secure   |
| LLM       | Groq API (LLaMA 3.3 70B)         | Free, fast, no region restrictions, reliable JSON output |
| Env       | dotenv                           | Secure API key management                   |
| CORS      | cors middleware                  | Allows local frontend ↔ backend calls       |

---

## Project Structure

```
assignment-summarizer/
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx          # Main UI component
│   │   ├── main.jsx         # React entry point
│   │   └── components/
│   │       └── ResultCard.jsx  # Displays structured results
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── src/
│   │   ├── index.js         # Express server & routes
│   │   ├── llm.js           # Anthropic API integration
│   │   ├── prompt.js        # Prompt construction
│   │   └── validate.js      # Input validation logic
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Setup & Installation

### Prerequisites
- Node.js v18 or higher
- An Anthropic API key ([get one here](https://console.anthropic.com/))

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd assignment-summarizer
```

### 2. Set up the backend

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and add your API key:

```
GROQ_API_KEY=gsk_...your-key-here...
PORT=3001
```

### 3. Set up the frontend

```bash
cd ../client
npm install
```

### 4. Run both servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
You should see: `🚀 Server running at http://localhost:3001`

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## LLM API Choice — Why Groq?

I chose **Groq's LLaMA 3.3 70B** model for these reasons:

1. **Truly free** — No credit card required, works without region restrictions (including India).
2. **Instruction following** — LLaMA 3.3 70B reliably returns valid JSON when given a strict prompt.
3. **Speed** — Groq's custom LPU hardware makes it one of the fastest inference APIs available.
4. **Simple SDK** — The `groq-sdk` follows the same OpenAI-compatible interface, making it easy to integrate.
5. **Security** — API key stays on the backend; it is never exposed to the browser.

---

## Prompt Design

The prompt in `server/src/prompt.js` is intentionally strict:

```
You are an assistant that converts unstructured text into a strict JSON summary.

Return only valid JSON with this exact shape:
{
  "summary": "one sentence summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "sentiment": "positive | neutral | negative"
}

Rules:
- summary must be exactly one sentence
- keyPoints must contain exactly 3 short strings
- sentiment must be one of the allowed labels only
- do not include markdown or extra keys
```

**Why this works:**
- Defines the model's **role** (information extractor, not a chatbot)
- Specifies the **exact JSON shape** upfront
- Lists **hard constraints** (exactly 3 key points, allowed sentiment values)
- Explicitly forbids markdown fences, which are a common source of parse errors

The backend also strips any accidental ` ```json ``` ` fences before parsing, as a safety net.

---

## Example Output

**Input:**
> The Mars Perseverance rover has been collecting rock samples since early 2021. Scientists believe these ancient rocks, formed over 3 billion years ago, could contain signs of microbial life. The mission has exceeded expectations, and NASA is already planning a joint mission with ESA to bring the samples back to Earth by 2033.

**Output:**
```json
{
  "summary": "NASA's Perseverance rover has successfully collected ancient Martian rock samples that scientists hope will reveal evidence of past microbial life.",
  "keyPoints": [
    "Perseverance has been collecting rock samples on Mars since early 2021",
    "The ancient rocks may contain signs of microbial life from over 3 billion years ago",
    "NASA and ESA are planning a joint mission to return the samples to Earth by 2033"
  ],
  "sentiment": "positive"
}
```

---

## Why Backend for LLM?

The LLM API call is handled entirely in the backend (`server/src/llm.js`) for one critical reason: **security**. If the API call were made from the React frontend, the API key would be visible to anyone who opens browser DevTools. By keeping it on the server, the key is stored safely in a `.env` file and never sent to the browser.

---

## Error Handling

Every failure point is handled gracefully:

| Scenario | Handling |
|----------|----------|
| Empty input | 400 error returned before any API call is made |
| Text too short (< 20 chars) | 400 validation error with clear message |
| Text too long (> 10,000 chars) | 400 validation error |
| Missing API key | 500 with descriptive message logged to server |
| API provider failure | 500 with user-friendly message to frontend |
| Model returns malformed JSON | Caught in try/catch, reported as summarization failure |
| Model returns wrong structure | Shape validated after parsing, error thrown if invalid |
| Frontend network error | Displayed as friendly error message in the UI |

---



| Decision | Reason |
|----------|--------|
| Single `/api/summarize` endpoint | Keeps the architecture simple and easy to explain; no over-engineering |
| No authentication | Not required for this assignment scope |
| Minimal UI styling | Focus on LLM integration quality over visual complexity |
| No test suite | Time constraint of 1–2 hours; would add Jest + Supertest with more time |
| claude-3-5-haiku instead of Opus | Faster and cheaper for demo purposes; Opus would improve quality on edge cases |
| File upload reads in browser | Keeps it simple; a production app might stream directly to the server |

---

## What I Would Improve With More Time

1. **File upload to backend** — Stream `.txt` and `.pdf` files directly to the server for better security and larger file support.
2. **Batch processing** — Accept multiple texts and return an array of summaries.
3. **Custom output schema** — Let users define their own output fields (e.g., 5 key points instead of 3).
4. **History panel** — Store past summaries in localStorage so users can compare results.
5. **Test coverage** — Unit tests for `validate.js`, `prompt.js`, and integration tests for the API route.
6. **Rate limiting** — Add express-rate-limit to prevent abuse.
7. **Streaming** — Use Claude's streaming API to show the response token-by-token for a better UX.

---

## API Reference

### `POST /api/summarize`

**Request body:**
```json
{ "text": "Your unstructured text here..." }
```

**Success response (200):**
```json
{
  "summary": "string",
  "keyPoints": ["string", "string", "string"],
  "sentiment": "positive | neutral | negative"
}
```

**Error response (400 / 500):**
```json
{ "error": "Descriptive error message" }
```

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Empty input | 400 error returned before any API call |
| Text too short (< 20 chars) | 400 validation error |
| Text too long (> 10,000 chars) | 400 validation error |
| Missing API key | 500 with clear message logged to server |
| API provider failure | 500 with user-friendly message |
| Model returns malformed JSON | Caught and reported as summarization failure |
| Frontend network error | Displayed as friendly error message in UI |
