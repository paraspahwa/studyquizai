import { useState, useRef } from "react";

export default function UploadSection({ onGenerate, usage, onUpgrade }) {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [numQuestions, setNumQuestions] = useState(10);
  const [difficulty, setDifficulty] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
      setError(null);
    } else {
      setError("Please upload a PDF file.");
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${API}/upload-and-generate?num_questions=${numQuestions}&difficulty=${difficulty}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError("daily_limit");
        } else {
          setError(data.detail || "Something went wrong");
        }
        return;
      }

      onGenerate(data.quiz, data.usage);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isLimitReached = usage && !usage.is_pro && usage.remaining <= 0;

  return (
    <div style={styles.container}>
      {/* Usage Bar */}
      {usage && !usage.is_pro && (
        <div style={styles.usageBar}>
          <div style={styles.usageInfo}>
            <span style={styles.usageLabel}>Free quizzes today:</span>
            <span style={styles.usageCount}>
              {usage.remaining}/{usage.limit} remaining
            </span>
          </div>
          <div style={styles.progressBg}>
            <div
              style={{
                ...styles.progressFill,
                width: `${((usage.limit - usage.remaining) / usage.limit) * 100}%`,
              }}
            />
          </div>
          {usage.remaining <= 1 && (
            <button style={styles.upgradeNudge} onClick={onUpgrade}>
              ⚡ Upgrade to Pro for unlimited quizzes
            </button>
          )}
        </div>
      )}

      {usage?.is_pro && (
        <div style={styles.proBadge}>⚡ Pro — Unlimited Quizzes</div>
      )}

      <h2 style={styles.title}>Upload your study material</h2>
      <p style={styles.subtitle}>Drop a PDF and let AI generate a quiz for you</p>

      {/* Drop Zone */}
      <div
        style={{
          ...styles.dropZone,
          ...(dragOver ? styles.dropZoneActive : {}),
          ...(file ? styles.dropZoneReady : {}),
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        {file ? (
          <>
            <div style={styles.fileIcon}>📄</div>
            <p style={styles.fileName}>{file.name}</p>
            <p style={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            <button
              style={styles.changeBtn}
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
            >
              Change file
            </button>
          </>
        ) : (
          <>
            <div style={styles.uploadIcon}>📤</div>
            <p style={styles.dropText}>Drag & drop your PDF here</p>
            <p style={styles.dropSub}>or click to browse</p>
          </>
        )}
      </div>

      {/* Config */}
      <div style={styles.configRow}>
        <div style={styles.configItem}>
          <label style={styles.configLabel}>Questions</label>
          <div style={styles.pillGroup}>
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                style={{
                  ...styles.pill,
                  ...(numQuestions === n ? styles.pillActive : {}),
                }}
                onClick={() => setNumQuestions(n)}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div style={styles.configItem}>
          <label style={styles.configLabel}>Difficulty</label>
          <div style={styles.pillGroup}>
            {["easy", "medium", "hard"].map((d) => (
              <button
                key={d}
                style={{
                  ...styles.pill,
                  ...(difficulty === d ? styles.pillActive : {}),
                }}
                onClick={() => setDifficulty(d)}
              >
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error */}
      {error === "daily_limit" ? (
        <div style={styles.limitError}>
          <p style={styles.limitTitle}>🚫 Daily limit reached</p>
          <p style={styles.limitText}>
            You've used all 3 free quizzes today. Upgrade to Pro for unlimited access!
          </p>
          <button style={styles.upgradeBtn} onClick={onUpgrade}>
            Upgrade to Pro →
          </button>
        </div>
      ) : error ? (
        <div style={styles.errorMsg}>⚠️ {error}</div>
      ) : null}

      {/* Generate Button */}
      <button
        style={{
          ...styles.generateBtn,
          ...(!file || loading || isLimitReached ? styles.generateBtnDisabled : {}),
        }}
        onClick={handleSubmit}
        disabled={!file || loading || isLimitReached}
      >
        {loading ? (
          <span>⏳ Generating quiz...</span>
        ) : (
          <span>🧠 Generate Quiz</span>
        )}
      </button>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "40px 24px",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
  // Usage bar
  usageBar: {
    background: "#f0fdf9",
    border: "1px solid #ccfbf1",
    borderRadius: 12,
    padding: "14px 18px",
    marginBottom: 28,
  },
  usageInfo: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
  usageLabel: { fontSize: 13, color: "#475569" },
  usageCount: { fontSize: 13, fontWeight: 700, color: "#0f766e" },
  progressBg: { height: 6, background: "#e2e8f0", borderRadius: 3 },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0f766e, #0891b2)",
    borderRadius: 3,
    transition: "width 0.3s",
  },
  upgradeNudge: {
    display: "block",
    width: "100%",
    marginTop: 10,
    background: "none",
    border: "1px dashed #0f766e",
    borderRadius: 8,
    padding: "8px",
    fontSize: 13,
    fontWeight: 600,
    color: "#0f766e",
    cursor: "pointer",
  },
  proBadge: {
    background: "linear-gradient(135deg, #0f766e, #0891b2)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 700,
    padding: "10px 18px",
    borderRadius: 10,
    textAlign: "center",
    marginBottom: 28,
  },
  // Title
  title: { fontSize: 24, fontWeight: 800, color: "#0f172a", marginBottom: 6, textAlign: "center" },
  subtitle: { fontSize: 15, color: "#64748b", textAlign: "center", marginBottom: 28 },
  // Drop zone
  dropZone: {
    border: "2px dashed #cbd5e1",
    borderRadius: 16,
    padding: "48px 24px",
    textAlign: "center",
    cursor: "pointer",
    transition: "border-color 0.2s, background 0.2s",
    marginBottom: 24,
    background: "#fff",
  },
  dropZoneActive: { borderColor: "#0f766e", background: "#f0fdf9" },
  dropZoneReady: { borderColor: "#0f766e", borderStyle: "solid", background: "#f0fdf9" },
  uploadIcon: { fontSize: 40, marginBottom: 12 },
  dropText: { fontSize: 16, fontWeight: 600, color: "#334155", marginBottom: 4 },
  dropSub: { fontSize: 13, color: "#94a3b8" },
  fileIcon: { fontSize: 36, marginBottom: 8 },
  fileName: { fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 2 },
  fileSize: { fontSize: 13, color: "#64748b", marginBottom: 8 },
  changeBtn: {
    background: "none",
    border: "1px solid #cbd5e1",
    borderRadius: 6,
    padding: "4px 12px",
    fontSize: 12,
    color: "#64748b",
    cursor: "pointer",
  },
  // Config
  configRow: {
    display: "flex",
    gap: 24,
    marginBottom: 24,
    flexWrap: "wrap",
  },
  configItem: { flex: 1, minWidth: 200 },
  configLabel: { display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 8 },
  pillGroup: { display: "flex", gap: 8 },
  pill: {
    flex: 1,
    padding: "8px 0",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    background: "#fff",
    fontSize: 13,
    fontWeight: 500,
    color: "#64748b",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  pillActive: {
    background: "#0f766e",
    color: "#fff",
    borderColor: "#0f766e",
    fontWeight: 700,
  },
  // Errors
  errorMsg: {
    background: "#fef2f2",
    color: "#dc2626",
    padding: "12px 16px",
    borderRadius: 10,
    fontSize: 14,
    marginBottom: 16,
  },
  limitError: {
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 12,
    padding: "20px",
    textAlign: "center",
    marginBottom: 20,
  },
  limitTitle: { fontSize: 16, fontWeight: 700, color: "#92400e", marginBottom: 4 },
  limitText: { fontSize: 14, color: "#a16207", marginBottom: 12 },
  upgradeBtn: {
    background: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  // Generate
  generateBtn: {
    width: "100%",
    padding: "16px 0",
    fontSize: 16,
    fontWeight: 700,
    background: "linear-gradient(135deg, #0f766e, #0891b2)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(15, 118, 110, 0.25)",
  },
  generateBtnDisabled: { opacity: 0.5, cursor: "not-allowed" },
};
