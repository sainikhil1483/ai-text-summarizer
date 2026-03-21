import React, { useState, useRef } from "react";
import ResultCard from "./components/ResultCard.jsx";

const EXAMPLE_TEXT = `The Mars Perseverance rover has been collecting rock samples since early 2021.
Scientists believe these ancient rocks, formed over 3 billion years ago, could contain
signs of microbial life. The mission has exceeded expectations, and NASA is already
planning a joint mission with ESA to bring the samples back to Earth by 2033.
The discovery of organic molecules in several samples has excited the scientific community.`;

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef();

  async function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) {
      setError("Please enter some text before submitting.");
      return;
    }
    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Network error. Is the server running?");
    } finally {
      setLoading(false);
    }
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("text/")) {
      setError("Only plain text files are supported.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setText(ev.target.result);
    reader.readAsText(file);
  }

  function handleClear() {
    setText("");
    setResult(null);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header */}
          <div style={styles.header}>
            <div style={styles.badge}>AI-Powered</div>
            <h1 style={styles.title}>Text Summarizer</h1>
            <p style={styles.subtitle}>
              Paste any unstructured text and get a clean one-sentence summary,
              three key points, and a sentiment analysis — instantly.
            </p>
          </div>

          {/* Input area */}
          <div style={styles.card}>
            <div style={styles.inputHeader}>
              <label style={styles.inputLabel}>Your Text</label>
              <div style={styles.inputActions}>
                <button
                  style={styles.ghostBtn}
                  onClick={() => setText(EXAMPLE_TEXT)}
                >
                  Use Example
                </button>
                <button style={styles.ghostBtn} onClick={() => fileRef.current.click()}>
                  Upload .txt
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt,text/plain"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
              </div>
            </div>

            <textarea
              style={styles.textarea}
              placeholder="Paste your text here… (minimum 20 characters)"
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
            />

            <div style={styles.charCount}>
              {text.length} / 10,000 characters
            </div>

            {error && <div style={styles.errorBox}>⚠️ {error}</div>}

            <div style={styles.btnRow}>
              {(text || result) && (
                <button style={styles.clearBtn} onClick={handleClear}>
                  Clear
                </button>
              )}
              <button
                style={{
                  ...styles.submitBtn,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span style={styles.loadingRow}>
                    <span style={styles.spinner} /> Analyzing…
                  </span>
                ) : (
                  "Summarize →"
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div>
              <h2 style={styles.resultHeading}>Results</h2>
              <ResultCard result={result} />
            </div>
          )}

          <p style={styles.footer}>
            Powered by Groq · Llama 3.3 70B · Built with React + Node.js
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 50%, #faf5ff 100%)",
    padding: "48px 16px",
    fontFamily: "'DM Sans', sans-serif",
  },
  container: {
    maxWidth: "700px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  header: {
    textAlign: "center",
    padding: "0 16px",
  },
  badge: {
    display: "inline-block",
    background: "#6366f1",
    color: "#fff",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    padding: "4px 12px",
    borderRadius: "100px",
    marginBottom: "16px",
  },
  title: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "42px",
    fontWeight: "400",
    color: "#111827",
    margin: "0 0 14px",
    lineHeight: "1.2",
  },
  subtitle: {
    fontSize: "16px",
    color: "#6b7280",
    lineHeight: "1.7",
    maxWidth: "520px",
    margin: "0 auto",
  },
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  inputHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
    flexWrap: "wrap",
    gap: "8px",
  },
  inputLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
  },
  inputActions: {
    display: "flex",
    gap: "8px",
  },
  ghostBtn: {
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "5px 12px",
    fontSize: "12px",
    color: "#6b7280",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: "500",
    transition: "all 0.15s",
  },
  textarea: {
    width: "100%",
    minHeight: "180px",
    padding: "14px",
    borderRadius: "10px",
    border: "1.5px solid #e5e7eb",
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#111827",
    fontFamily: "'DM Sans', sans-serif",
    resize: "vertical",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  },
  charCount: {
    textAlign: "right",
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "6px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fca5a5",
    borderRadius: "8px",
    color: "#dc2626",
    padding: "10px 14px",
    fontSize: "14px",
    marginTop: "12px",
  },
  btnRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "18px",
    alignItems: "center",
  },
  submitBtn: {
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 28px",
    fontSize: "15px",
    fontWeight: "600",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
    transition: "all 0.15s",
    minWidth: "140px",
  },
  clearBtn: {
    background: "transparent",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "12px 20px",
    fontSize: "15px",
    color: "#6b7280",
    fontFamily: "'DM Sans', sans-serif",
    cursor: "pointer",
  },
  loadingRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    justifyContent: "center",
  },
  spinner: {
    display: "inline-block",
    width: "14px",
    height: "14px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  resultHeading: {
    fontFamily: "'DM Serif Display', serif",
    fontSize: "24px",
    fontWeight: "400",
    color: "#111827",
    marginBottom: "16px",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "8px",
  },
};

const globalStyles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f5f3ff; }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  textarea:focus { border-color: #6366f1 !important; }
`;
