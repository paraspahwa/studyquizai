export default function ResultsSummary({ results, onRestart, onUpgrade, isPro, quiz }) {
  const { score, total } = results;
  const pct = Math.round((score / total) * 100);

  let grade, emoji, message;
  if (pct >= 90) { grade = "A+"; emoji = "🏆"; message = "Outstanding! You've mastered this material."; }
  else if (pct >= 80) { grade = "A"; emoji = "🌟"; message = "Excellent work! You know your stuff."; }
  else if (pct >= 70) { grade = "B"; emoji = "👏"; message = "Good job! A few areas to review."; }
  else if (pct >= 60) { grade = "C"; emoji = "📖"; message = "Decent effort. Review the explanations above."; }
  else if (pct >= 50) { grade = "D"; emoji = "💪"; message = "Keep studying. You're getting there!"; }
  else { grade = "F"; emoji = "📚"; message = "Time to revisit the material. Don't give up!"; }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emoji}>{emoji}</div>
        <div style={styles.grade}>Grade: {grade}</div>
        <div style={styles.score}>
          {score} / {total}
        </div>
        <div style={styles.pct}>{pct}% correct</div>
        <p style={styles.message}>{message}</p>

        {/* Progress ring */}
        <div style={styles.ringContainer}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#e2e8f0" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke={pct >= 70 ? "#0f766e" : pct >= 50 ? "#f59e0b" : "#ef4444"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 314} 314`}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dasharray 1s ease" }}
            />
            <text x="60" y="65" textAnchor="middle" fontSize="24" fontWeight="800" fill="#0f172a">
              {pct}%
            </text>
          </svg>
        </div>

        <div style={styles.buttons}>
          <button style={styles.retryBtn} onClick={onRestart}>
            📄 New Quiz
          </button>
          <button
            style={styles.retryBtn}
            onClick={async () => {
              if (!quiz || !quiz.id) return;
              const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
              try {
                const res = await fetch(`${API}/quiz/${quiz.id}/download`);
                if (!res.ok) throw new Error("Download failed");
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `quiz_${quiz.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            ⬇️ Download Quiz (PDF)
          </button>
          <button
            style={styles.retryBtn}
            onClick={async () => {
              if (!quiz || !quiz.id) return;
              const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
              try {
                const res = await fetch(`${API}/quiz/${quiz.id}/answers`);
                if (!res.ok) throw new Error("Download failed");
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `answers_${quiz.id}.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (e) {
                console.error(e);
              }
            }}
          >
            🧾 Download Answers (PDF)
          </button>
          {!isPro && (
            <button style={styles.upgradeBtn} onClick={onUpgrade}>
              ⚡ Get Pro — Unlimited
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "40px 24px",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
  card: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 20,
    padding: "40px 32px",
    textAlign: "center",
  },
  emoji: { fontSize: 48, marginBottom: 12 },
  grade: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0f766e",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  score: { fontSize: 36, fontWeight: 900, color: "#0f172a", marginBottom: 2 },
  pct: { fontSize: 16, color: "#64748b", marginBottom: 8 },
  message: { fontSize: 15, color: "#475569", lineHeight: 1.6, marginBottom: 24 },
  ringContainer: { marginBottom: 28 },
  buttons: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  retryBtn: {
    padding: "12px 28px",
    fontSize: 14,
    fontWeight: 600,
    background: "#f1f5f9",
    color: "#334155",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
  upgradeBtn: {
    padding: "12px 28px",
    fontSize: 14,
    fontWeight: 600,
    background: "linear-gradient(135deg, #0f766e, #0891b2)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
  },
};
