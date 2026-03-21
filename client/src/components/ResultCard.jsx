import React from "react";

const sentimentConfig = {
  positive: { emoji: "😊", label: "Positive", color: "#2d9e6b", bg: "#f0faf5" },
  neutral:  { emoji: "😐", label: "Neutral",  color: "#6b7280", bg: "#f3f4f6" },
  negative: { emoji: "😟", label: "Negative", color: "#dc2626", bg: "#fef2f2" },
};

export default function ResultCard({ result }) {
  const sentiment = sentimentConfig[result.sentiment] || sentimentConfig.neutral;

  return (
    <div style={styles.card}>
      <div style={styles.section}>
        <h3 style={styles.label}>📄 Summary</h3>
        <p style={styles.summary}>{result.summary}</p>
      </div>

      <div style={styles.divider} />

      <div style={styles.section}>
        <h3 style={styles.label}>🔑 Key Points</h3>
        <ul style={styles.list}>
          {result.keyPoints.map((point, i) => (
            <li key={i} style={styles.listItem}>
              <span style={styles.bullet}>▸</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.divider} />

      <div style={styles.sentimentRow}>
        <h3 style={styles.label}>💬 Sentiment</h3>
        <span
          style={{
            ...styles.sentimentBadge,
            color: sentiment.color,
            background: sentiment.bg,
            border: `1px solid ${sentiment.color}33`,
          }}
        >
          {sentiment.emoji} {sentiment.label}
        </span>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
    animation: "fadeUp 0.4s ease",
  },
  section: { marginBottom: "4px" },
  label: {
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#9ca3af",
    marginBottom: "10px",
  },
  summary: {
    fontSize: "17px",
    lineHeight: "1.7",
    color: "#111827",
    fontFamily: "'DM Serif Display', serif",
  },
  divider: {
    height: "1px",
    background: "#f3f4f6",
    margin: "20px 0",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  listItem: {
    display: "flex",
    gap: "10px",
    fontSize: "15px",
    color: "#374151",
    lineHeight: "1.6",
  },
  bullet: {
    color: "#6366f1",
    flexShrink: 0,
    marginTop: "2px",
  },
  sentimentRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  sentimentBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 16px",
    borderRadius: "100px",
    fontSize: "14px",
    fontWeight: "600",
  },
};
