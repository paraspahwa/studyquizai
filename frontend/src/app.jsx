import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import PricingPage from "./pages/PricingPage";
import UploadSection from "./components/UploadSection";
import QuizSection from "./components/QuizSection";
import ResultsSummary from "./components/ResultsSummary";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

/**
 * StudyQuizAI — App Stage Manager
 *
 * Stages:
 *   landing  → Landing page (marketing)
 *   pricing  → Pricing / payment page
 *   upload   → PDF upload + config
 *   quiz     → Active quiz
 *   results  → Score summary
 */
export default function App() {
  const [stage, setStage] = useState("landing");
  const [quiz, setQuiz] = useState(null);
  const [results, setResults] = useState(null);
  const [usage, setUsage] = useState(null);
  const [isPro, setIsPro] = useState(false);

  // Fetch usage on mount and when entering upload
  useEffect(() => {
    if (stage === "upload") {
      fetchUsage();
    }
  }, [stage]);

  const fetchUsage = async () => {
    try {
      const res = await fetch(`${API}/usage-status`);
      const data = await res.json();
      setUsage(data);
      setIsPro(data.is_pro);
    } catch {
      // Offline or backend not running — allow usage
      setUsage({ allowed: true, is_pro: false, remaining: 3, limit: 3 });
    }
  };

  const handleQuizGenerated = (quizData, usageData) => {
    setQuiz(quizData);
    if (usageData) {
      setUsage(usageData);
      setIsPro(usageData.is_pro);
    }
    setStage("quiz");
  };

  const handleQuizFinish = (resultData) => {
    setResults(resultData);
    setStage("results");
  };

  const handleRestart = () => {
    setQuiz(null);
    setResults(null);
    setStage("upload");
  };

  const handlePaymentSuccess = (result) => {
    setIsPro(true);
    setUsage((prev) => ({ ...prev, is_pro: true, remaining: -1 }));
    setStage("upload");
  };

  return (
    <div>
      {stage === "landing" && (
        <LandingPage
          onGetStarted={() => setStage("upload")}
          onViewPricing={() => setStage("pricing")}
        />
      )}

      {stage === "pricing" && (
        <PricingPage
          onBack={() => setStage("landing")}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {stage === "upload" && (
        <div>
          <nav style={navStyle}>
            <button style={logoBtn} onClick={() => setStage("landing")}>
              ⚡ StudyQuizAI
            </button>
            {!isPro && (
              <button style={proBtn} onClick={() => setStage("pricing")}>
                Upgrade ⚡
              </button>
            )}
          </nav>
          <UploadSection
            onGenerate={handleQuizGenerated}
            usage={usage}
            onUpgrade={() => setStage("pricing")}
          />
        </div>
      )}

      {stage === "quiz" && (
        <div>
          <nav style={navStyle}>
            <button style={logoBtn} onClick={() => setStage("landing")}>
              ⚡ StudyQuizAI
            </button>
          </nav>
          <QuizSection
            quiz={quiz}
            onFinish={handleQuizFinish}
            onRestart={handleRestart}
          />
        </div>
      )}

      {stage === "results" && (
        <div>
          <nav style={navStyle}>
            <button style={logoBtn} onClick={() => setStage("landing")}>
              ⚡ StudyQuizAI
            </button>
          </nav>
          <ResultsSummary
            results={results}
            onRestart={handleRestart}
            onUpgrade={() => setStage("pricing")}
            isPro={isPro}
          />
        </div>
      )}
    </div>
  );
}

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "14px 28px",
  borderBottom: "1px solid #e2e8f0",
  background: "#fff",
};

const logoBtn = {
  background: "none",
  border: "none",
  fontSize: 18,
  fontWeight: 800,
  color: "#0f766e",
  cursor: "pointer",
  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
};

const proBtn = {
  background: "#0f766e",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "8px 16px",
  fontSize: 13,
  fontWeight: 600,
  cursor: "pointer",
};
