import { useState } from "react";

export default function LandingPage({ onGetStarted, onViewPricing }) {
  const [hoveredFeature, setHoveredFeature] = useState(null);

  const features = [
    {
      icon: "📤",
      title: "Drop any PDF",
      desc: "Upload textbooks, research papers, notes — up to 100+ pages handled with smart chunking.",
    },
    {
      icon: "🧠",
      title: "AI-Powered Questions",
      desc: "GPT-4o generates MCQs that test real understanding, not just memorization.",
    },
    {
      icon: "💡",
      title: "Learn from every answer",
      desc: "Every option explains exactly why it's right or wrong. Study while you quiz.",
    },
    {
      icon: "🎯",
      title: "Adjust difficulty",
      desc: "Easy, Medium, or Hard — match the quiz to your preparation level.",
    },
    {
      icon: "📊",
      title: "Instant scoring",
      desc: "See your grade, review mistakes, and identify knowledge gaps immediately.",
    },
    {
      icon: "🌍",
      title: "Works globally",
      desc: "Pay with UPI, cards, net banking, or international Visa/Mastercard.",
    },
  ];

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚡</span>
          <span style={styles.logoText}>StudyQuizAI</span>
        </div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={onViewPricing}>Pricing</button>
          <button style={styles.ctaSmall} onClick={onGetStarted}>Start Free →</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.badge}>✨ AI-Powered Study Tool</div>
        <h1 style={styles.heroTitle}>
          Turn any PDF into a<br />
          <span style={styles.heroGradient}>smart quiz in seconds</span>
        </h1>
        <p style={styles.heroSub}>
          Upload your notes, textbook, or research paper. Get an instant multiple-choice quiz
          with explanations for every answer — so you actually learn, not just guess.
        </p>
        <div style={styles.heroCtas}>
          <button style={styles.ctaPrimary} onClick={onGetStarted}>
            Generate Your First Quiz — Free
          </button>
          <p style={styles.ctaNote}>3 free quizzes/day · No sign-up required</p>
        </div>
      </section>

      {/* How It Works */}
      <section style={styles.howSection}>
        <h2 style={styles.sectionTitle}>How it works</h2>
        <div style={styles.steps}>
          <div style={styles.step}>
            <div style={styles.stepNum}>1</div>
            <h3 style={styles.stepTitle}>Upload PDF</h3>
            <p style={styles.stepDesc}>Drag & drop or browse. Handles textbooks, papers, handwritten notes (scanned).</p>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNum}>2</div>
            <h3 style={styles.stepTitle}>Configure</h3>
            <p style={styles.stepDesc}>Choose 5-20 questions, pick difficulty: Easy, Medium, or Hard.</p>
          </div>
          <div style={styles.stepArrow}>→</div>
          <div style={styles.step}>
            <div style={styles.stepNum}>3</div>
            <h3 style={styles.stepTitle}>Quiz & Learn</h3>
            <p style={styles.stepDesc}>Answer MCQs, see instant per-option explanations, review your score.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Everything you need to study smarter</h2>
        <div style={styles.featuresGrid}>
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                ...styles.featureCard,
                ...(hoveredFeature === i ? styles.featureCardHover : {}),
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={styles.featureIcon}>{f.icon}</div>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaSectionTitle}>Ready to study smarter?</h2>
        <p style={styles.ctaSectionSub}>
          Join thousands of students who quiz themselves with AI-generated questions.
        </p>
        <button style={styles.ctaPrimary} onClick={onGetStarted}>
          Try Free — No Sign Up
        </button>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <span style={styles.footerLogo}>⚡ StudyQuizAI</span>
        <span style={styles.footerText}>Built for students, by students · Payments by Razorpay</span>
      </footer>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    color: "#1a1a2e",
    background: "#fafbfc",
    minHeight: "100vh",
  },
  // Nav
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "18px 40px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoIcon: { fontSize: 24 },
  logoText: { fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#0f766e" },
  navLinks: { display: "flex", alignItems: "center", gap: 20 },
  navLink: {
    background: "none",
    border: "none",
    fontSize: 15,
    fontWeight: 500,
    color: "#475569",
    cursor: "pointer",
  },
  ctaSmall: {
    background: "#0f766e",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
  },
  // Hero
  hero: {
    textAlign: "center",
    padding: "80px 24px 60px",
    maxWidth: 720,
    margin: "0 auto",
  },
  badge: {
    display: "inline-block",
    background: "#e0f2f1",
    color: "#0f766e",
    fontSize: 13,
    fontWeight: 600,
    padding: "6px 16px",
    borderRadius: 20,
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: "clamp(32px, 5vw, 52px)",
    fontWeight: 900,
    lineHeight: 1.15,
    marginBottom: 20,
    letterSpacing: "-1px",
    color: "#0f172a",
  },
  heroGradient: {
    background: "linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #6366f1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSub: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "#64748b",
    maxWidth: 560,
    margin: "0 auto 32px",
  },
  heroCtas: { display: "flex", flexDirection: "column", alignItems: "center", gap: 12 },
  ctaPrimary: {
    background: "linear-gradient(135deg, #0f766e, #0891b2)",
    color: "#fff",
    border: "none",
    borderRadius: 12,
    padding: "16px 36px",
    fontSize: 17,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(15, 118, 110, 0.3)",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
  ctaNote: { fontSize: 13, color: "#94a3b8" },
  // How It Works
  howSection: {
    padding: "60px 24px",
    maxWidth: 900,
    margin: "0 auto",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 800,
    marginBottom: 40,
    letterSpacing: "-0.5px",
    color: "#0f172a",
  },
  steps: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: 16,
    flexWrap: "wrap",
  },
  step: {
    flex: "1 1 200px",
    maxWidth: 240,
    textAlign: "center",
  },
  stepNum: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    background: "#0f766e",
    color: "#fff",
    fontSize: 18,
    fontWeight: 800,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  stepTitle: { fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#0f172a" },
  stepDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6 },
  stepArrow: {
    fontSize: 28,
    color: "#cbd5e1",
    paddingTop: 6,
    fontWeight: 300,
  },
  // Features
  featuresSection: {
    padding: "60px 24px 80px",
    maxWidth: 1000,
    margin: "0 auto",
    textAlign: "center",
  },
  featuresGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
    marginTop: 10,
  },
  featureCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: 14,
    padding: "28px 24px",
    textAlign: "left",
    transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
    cursor: "default",
  },
  featureCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    borderColor: "#0f766e",
  },
  featureIcon: { fontSize: 28, marginBottom: 12 },
  featureTitle: { fontSize: 16, fontWeight: 700, marginBottom: 6, color: "#0f172a" },
  featureDesc: { fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 },
  // CTA Section
  ctaSection: {
    textAlign: "center",
    padding: "60px 24px 80px",
    background: "linear-gradient(180deg, #fafbfc 0%, #e0f2f1 100%)",
  },
  ctaSectionTitle: { fontSize: 28, fontWeight: 800, color: "#0f172a", marginBottom: 12 },
  ctaSectionSub: { fontSize: 16, color: "#64748b", marginBottom: 28 },
  // Footer
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderTop: "1px solid #e2e8f0",
    maxWidth: 1200,
    margin: "0 auto",
    flexWrap: "wrap",
    gap: 12,
  },
  footerLogo: { fontSize: 15, fontWeight: 700, color: "#0f766e" },
  footerText: { fontSize: 13, color: "#94a3b8" },
};
