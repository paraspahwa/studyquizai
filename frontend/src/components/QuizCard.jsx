import { useState } from "react";

export default function QuizCard({ question, index, total, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const handleSelect = (optIndex) => {
    if (revealed) return;
    setSelected(optIndex);
    setRevealed(true);

    const isCorrect = question.options[optIndex].is_correct;
    onAnswer?.(isCorrect);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <span style={styles.counter}>
          Question {index + 1} of {total}
        </span>
        <span style={styles.difficulty}>
          {question.concept_summary && "💡"}
        </span>
      </div>

      <h3 style={styles.question}>{question.question}</h3>

      <div style={styles.options}>
        {question.options.map((opt, i) => {
          let optStyle = styles.option;
          if (revealed) {
            if (opt.is_correct) {
              optStyle = { ...styles.option, ...styles.optionCorrect };
            } else if (i === selected && !opt.is_correct) {
              optStyle = { ...styles.option, ...styles.optionWrong };
            } else {
              optStyle = { ...styles.option, ...styles.optionDimmed };
            }
          } else if (i === selected) {
            optStyle = { ...styles.option, ...styles.optionSelected };
          }

          return (
            <div key={i}>
              <button
                style={optStyle}
                onClick={() => handleSelect(i)}
                disabled={revealed}
              >
                <span style={styles.optLetter}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={styles.optText}>{opt.text}</span>
                {revealed && (
                  <span style={styles.optIcon}>
                    {opt.is_correct ? "✓" : i === selected ? "✗" : ""}
                  </span>
                )}
              </button>
              {revealed && (
                <div style={{
                  ...styles.explanation,
                  ...(opt.is_correct ? styles.explCorrect : styles.explWrong),
                }}>
                  {opt.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {revealed && question.concept_summary && (
        <div style={styles.concept}>
          <span style={styles.conceptIcon}>💡</span>
          <span>{question.concept_summary}</span>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 16,
    padding: "28px 24px",
    marginBottom: 20,
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  counter: { fontSize: 12, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 0.5 },
  question: { fontSize: 17, fontWeight: 700, color: "#0f172a", lineHeight: 1.5, marginBottom: 20 },
  options: { display: "flex", flexDirection: "column", gap: 8 },
  option: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 16px",
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    background: "#fff",
    fontSize: 14,
    color: "#334155",
    cursor: "pointer",
    transition: "all 0.15s",
    textAlign: "left",
  },
  optionSelected: { borderColor: "#0f766e", background: "#f0fdf9" },
  optionCorrect: { borderColor: "#16a34a", background: "#f0fdf4", color: "#15803d" },
  optionWrong: { borderColor: "#dc2626", background: "#fef2f2", color: "#dc2626" },
  optionDimmed: { opacity: 0.6 },
  optLetter: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
    flexShrink: 0,
  },
  optText: { flex: 1 },
  optIcon: { fontWeight: 700, fontSize: 16, flexShrink: 0 },
  explanation: {
    margin: "4px 0 8px 40px",
    padding: "8px 12px",
    borderRadius: 8,
    fontSize: 13,
    lineHeight: 1.5,
  },
  explCorrect: { background: "#f0fdf4", color: "#166534", borderLeft: "3px solid #16a34a" },
  explWrong: { background: "#fef2f2", color: "#991b1b", borderLeft: "3px solid #fca5a5" },
  concept: {
    marginTop: 20,
    padding: "14px 16px",
    background: "#eff6ff",
    borderRadius: 10,
    fontSize: 14,
    color: "#1e40af",
    display: "flex",
    gap: 8,
    lineHeight: 1.5,
  },
  conceptIcon: { flexShrink: 0 },
};
