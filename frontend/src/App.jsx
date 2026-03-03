import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import PricingPage from "./pages/PricingPage";
import DashboardPage from "./pages/DashboardPage";

/**
 * ReelForge AI — App Stage Manager
 *
 * Stages:
 *   landing   → Marketing / home page
 *   auth      → Login / signup
 *   pricing   → Pricing page
 *   dashboard → Main app (create videos, gallery, analytics)
 */
export default function App() {
  const [stage, setStage] = useState("landing");
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState("login");

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem("rf_token");
    const saved = localStorage.getItem("rf_user");
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
        setStage("dashboard");
      } catch {
        localStorage.removeItem("rf_token");
        localStorage.removeItem("rf_user");
      }
    }
  }, []);

  const handleAuthSuccess = (data) => {
    setUser({ id: data.user_id, email: data.email, name: data.full_name });
    setStage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("rf_token");
    localStorage.removeItem("rf_user");
    setUser(null);
    setStage("landing");
  };

  const goToLogin = () => {
    setAuthMode("login");
    setStage("auth");
  };

  const goToSignup = () => {
    setAuthMode("signup");
    setStage("auth");
  };

  return (
    <>
      {stage === "landing" && (
        <LandingPage
          onGetStarted={goToSignup}
          onViewPricing={() => setStage("pricing")}
          onLogin={goToLogin}
        />
      )}

      {stage === "auth" && (
        <AuthPage
          initialMode={authMode}
          onSuccess={handleAuthSuccess}
          onBack={() => setStage("landing")}
        />
      )}

      {stage === "pricing" && (
        <PricingPage
          onBack={() => setStage("landing")}
          onGetStarted={goToSignup}
          onSuccess={(result) => {
            if (user) {
              setStage("dashboard");
            } else {
              goToSignup();
            }
          }}
        />
      )}

      {stage === "dashboard" && (
        <DashboardPage
          user={user}
          onLogout={handleLogout}
          onUpgrade={() => setStage("pricing")}
        />
      )}
    </>
  );
}
