import { useState } from "react";
import QuizCard from "./QuizCard";

export default function QuizSection({ quiz, onFinish, onRestart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const questions = quiz?.questions || [];
  const isLast = currentIndex === questions.length - 1;

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore((s) => s + 1);
    setAnswered(true);
  };

  const handleNext = () => {
    if (isLast) {
      onFinish({ score: score, total: questions.length });
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
    }
  };

  if (!questions.length) {
    return (
      <div style={styles.empty}>
        <p>No questions generated. Try a different PDF.</p>
        <button style={styles.retryBtn} onClick={onRestart}>Try Again</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Progress */}
      <div style={styles.progressBar}>
        <div
          style={{
            ...styles.progressFill,
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        />
      </div>

      <div style={styles.scorePreview}>
        Score: {score}/{currentIndex + (answered ? 1 : 0)}
      </div>

      <QuizCard
        key={currentIndex}
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        onAnswer={handleAnswer}
      />

      {answered && (
        <button style={styles.nextBtn} onClick={handleNext}>
          {isLast ? "See Results 🎯" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 640,
    margin: "0 auto",
    padding: "24px",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
  progressBar: {
    height: 4,
    background: "#e2e8f0",
    borderRadius: 2,
    marginBottom: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #0f766e, #0891b2)",
    borderRadius: 2,
    transition: "width 0.4s ease",
  },
  scorePreview: {
    fontSize: 13,
    fontWeight: 600,
    color: "#64748b",
    textAlign: "right",
    marginBottom: 20,
  },
  nextBtn: {
    display: "block",
    width: "100%",
    padding: "14px 0",
    fontSize: 15,
    fontWeight: 700,
    background: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 8,
  },
  empty: {
    textAlign: "center",
    padding: "60px 24px",
    color: "#64748b",
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  },
  retryBtn: {
    marginTop: 16,
    padding: "10px 24px",
    background: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
};
