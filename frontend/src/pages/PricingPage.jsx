import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || "";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    color: "#64748b",
    features: [
      { label: "5 videos / month", included: true },
      { label: "720p quality", included: true },
      { label: "5 basic AI voices", included: true },
      { label: "Watermark on videos", included: true },
      { label: "Basic niches (5)", included: true },
      { label: "No watermark", included: false },
      { label: "1080p HD quality", included: false },
      { label: "30+ premium voices", included: false },
      { label: "Direct social publishing", included: false },
      { label: "Bulk generation", included: false },
      { label: "Priority support", included: false },
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 19,
    yearlyPrice: 149,
    color: "#7c3aed",
    badge: "Most Popular",
    features: [
      { label: "Unlimited videos", included: true },
      { label: "1080p HD quality", included: true },
      { label: "30+ premium AI voices", included: true },
      { label: "No watermark", included: true },
      { label: "All niches (15+)", included: true },
      { label: "Direct social publishing", included: true },
      { label: "Background music library", included: true },
      { label: "Caption customization", included: true },
      { label: "Priority support (24h)", included: true },
      { label: "Bulk generation", included: false },
      { label: "Team members", included: false },
    ],
    cta: "Start Pro Trial",
    highlight: true,
  },
  {
    id: "business",
    name: "Business",
    monthlyPrice: 49,
    yearlyPrice: 399,
    color: "#06b6d4",
    features: [
      { label: "Everything in Pro", included: true },
      { label: "10 team members", included: true },
      { label: "Bulk generation (30x)", included: true },
      { label: "Custom branding / logo", included: true },
      { label: "API access", included: true },
      { label: "Dedicated account manager", included: true },
      { label: "White-label videos", included: true },
      { label: "Custom voice cloning", included: true },
      { label: "Priority support (2h SLA)", included: true },
      { label: "Advanced analytics", included: true },
      { label: "Reseller rights", included: true },
    ],
    cta: "Start Business Trial",
    highlight: false,
  },
];

const FEATURE_COMPARISON = [
  { feature: "Videos per month", free: "5", pro: "Unlimited", business: "Unlimited" },
  { feature: "Video quality", free: "720p", pro: "1080p HD", business: "1080p HD" },
  { feature: "AI voices", free: "5 basic", pro: "30+ premium", business: "30+ + custom" },
  { feature: "Watermark", free: "Yes", pro: "No", business: "No" },
  { feature: "Social publishing", free: "—", pro: "✓", business: "✓" },
  { feature: "Bulk generation", free: "—", pro: "—", business: "30 at once" },
  { feature: "Team members", free: "1", pro: "1", business: "10" },
  { feature: "Custom branding", free: "—", pro: "—", business: "✓" },
  { feature: "API access", free: "—", pro: "—", business: "✓" },
  { feature: "Support", free: "Community", pro: "24h Priority", business: "2h SLA" },
];

export default function PricingPage({ onBack, onSuccess, onGetStarted }) {
  const [billing, setBilling] = useState("yearly"); // monthly | yearly
  const [loading, setLoading] = useState(null);

  const handleSelectPlan = async (plan) => {
    if (plan.id === "free") {
      onGetStarted && onGetStarted();
      return;
    }
    if (!RAZORPAY_KEY) {
      // No payment configured — just proceed
      onSuccess && onSuccess({ plan: plan.id });
      return;
    }
    setLoading(plan.id);
    try {
      const price = billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
      const res = await fetch(`${API}/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: price * 100, currency: "USD", plan_type: billing }),
      });
      const order = await res.json();

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY,
        order_id: order.order_id,
        amount: order.amount,
        currency: order.currency,
        name: "ReelForge AI",
        description: `${plan.name} Plan — ${billing}`,
        handler: (response) => {
          onSuccess && onSuccess({ ...response, plan: plan.id });
        },
        modal: { ondismiss: () => setLoading(null) },
        theme: { color: "#7c3aed" },
      });
      rzp.open();
    } catch {
      onSuccess && onSuccess({ plan: plan.id });
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (plan) => {
    if (plan.id === "free") return 0;
    return billing === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const yearlyDiscount = (plan) => {
    if (!plan.monthlyPrice) return 0;
    const monthly = plan.monthlyPrice * 12;
    const yearly = plan.yearlyPrice;
    return Math.round(((monthly - yearly) / monthly) * 100);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>
      {/* Navbar */}
      <nav style={{ padding:"16px 32px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid var(--border2)",background:"var(--bg2)" }}>
        <div style={{ display:"flex",alignItems:"center",gap:10 }}>
          <span style={{ fontSize:22 }}>🎬</span>
          <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:18,background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ReelForge AI</span>
        </div>
        <button onClick={onBack} style={{ background:"none",color:"var(--text3)",border:"1px solid var(--border2)",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:500,cursor:"pointer",transition:"all 0.2s" }}
          onMouseOver={e=>{ e.currentTarget.style.borderColor="var(--primary)";e.currentTarget.style.color="#fff"; }}
          onMouseOut={e=>{ e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--text3)"; }}>
          ← Back
        </button>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:100,padding:"6px 16px",fontSize:13,fontWeight:600,color:"#a78bfa",marginBottom:24 }}>💎 Transparent Pricing</div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,5vw,56px)",fontWeight:900,lineHeight:1.15,marginBottom:16 }}>
            Choose your plan
          </h1>
          <p style={{ fontSize:18,color:"var(--text3)",marginBottom:36 }}>
            Start free. Scale when you're ready. Cancel anytime.
          </p>

          {/* Billing toggle */}
          <div style={{ display:"inline-flex",background:"var(--card)",border:"1px solid var(--border2)",borderRadius:12,padding:4,gap:4,alignItems:"center" }}>
            {["monthly","yearly"].map(b => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding:"10px 24px",borderRadius:9,fontSize:14,fontWeight:600,
                background:billing===b?"linear-gradient(135deg,#7c3aed,#ec4899)":"transparent",
                color:billing===b?"#fff":"var(--text3)",border:"none",cursor:"pointer",transition:"all 0.2s",
                display:"flex",alignItems:"center",gap:8,
              }}>
                {b.charAt(0).toUpperCase()+b.slice(1)}
                {b==="yearly" && <span style={{ background:"rgba(16,185,129,0.2)",color:"#6ee7b7",fontSize:11,fontWeight:700,padding:"2px 8px",borderRadius:100 }}>Save 35%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plan Cards */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:24,marginBottom:80,alignItems:"start" }}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{
              background: plan.highlight ? "linear-gradient(135deg,rgba(124,58,237,0.12),rgba(236,72,153,0.08))" : "var(--card)",
              border: `${plan.highlight ? "2px" : "1px"} solid ${plan.highlight ? "rgba(124,58,237,0.5)" : "var(--border2)"}`,
              borderRadius: 20,
              padding: "36px 28px",
              position: "relative",
              transform: plan.highlight ? "scale(1.03)" : "none",
              boxShadow: plan.highlight ? "0 20px 60px rgba(124,58,237,0.25)" : "none",
            }}>
              {plan.badge && (
                <div style={{ position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7c3aed,#ec4899)",color:"#fff",fontSize:11,fontWeight:700,padding:"5px 18px",borderRadius:100,whiteSpace:"nowrap" }}>{plan.badge}</div>
              )}

              <div style={{ fontSize:12,fontWeight:700,color:plan.highlight ? "#a78bfa" : "var(--text3)",letterSpacing:"0.08em",marginBottom:14 }}>{plan.name.toUpperCase()}</div>

              <div style={{ display:"flex",alignItems:"baseline",gap:6,marginBottom:4 }}>
                <span style={{ fontSize:14,fontWeight:600,color:"var(--text3)" }}>$</span>
                <span style={{
                  fontFamily:"'Poppins',sans-serif",fontSize:52,fontWeight:900,lineHeight:1,
                  ...(plan.highlight ? { background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" } : {}),
                }}>{getPrice(plan)}</span>
              </div>

              <div style={{ fontSize:13,color:"var(--text4)",marginBottom:4 }}>
                {plan.id==="free" ? "forever free" : `per ${billing==="monthly"?"month":"year"}`}
              </div>

              {billing==="yearly" && plan.monthlyPrice > 0 && (
                <div style={{ fontSize:12,color:"#6ee7b7",fontWeight:600,marginBottom:24 }}>
                  Save {yearlyDiscount(plan)}% vs monthly
                </div>
              )}
              {!(billing==="yearly" && plan.monthlyPrice > 0) && <div style={{ height:24+4,marginBottom:0 }} />}

              <div style={{ display:"flex",flexDirection:"column",gap:10,marginBottom:28 }}>
                {plan.features.map(f => (
                  <div key={f.label} style={{ display:"flex",gap:10,alignItems:"center",fontSize:13,color:f.included?"var(--text2)":"var(--text4)",textDecoration:f.included?"none":"none" }}>
                    <span style={{ fontSize:14,flexShrink:0,color:f.included?(plan.highlight?"#a78bfa":"#10b981"):"#374151" }}>{f.included?"✓":"✗"}</span>
                    {f.label}
                  </div>
                ))}
              </div>

              <button onClick={() => handleSelectPlan(plan)} disabled={loading===plan.id} style={{
                width:"100%",
                background:loading===plan.id?"rgba(124,58,237,0.4)":plan.highlight?"linear-gradient(135deg,#7c3aed,#ec4899)":plan.id==="free"?"var(--card2)":"transparent",
                color:"#fff",
                border:plan.id==="business"?"1px solid rgba(6,182,212,0.5)":"none",
                borderRadius:12,padding:"14px",fontWeight:700,fontSize:15,
                cursor:loading?"not-allowed":"pointer",
                boxShadow:plan.highlight?"0 4px 20px rgba(124,58,237,0.35)":"none",
                transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8,
              }}
                onMouseOver={e=>{ if(!loading&&plan.highlight){ e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(124,58,237,0.5)"; }}}
                onMouseOut={e=>{ e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=plan.highlight?"0 4px 20px rgba(124,58,237,0.35)":"none"; }}>
                {loading===plan.id ? <><span style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block" }} />Processing...</> : plan.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Feature comparison table */}
        <div style={{ marginBottom:80 }}>
          <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:28,fontWeight:800,textAlign:"center",marginBottom:40 }}>Full Feature Comparison</h2>
          <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:20,overflow:"hidden" }}>
            {/* Header */}
            <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",background:"rgba(124,58,237,0.08)",borderBottom:"1px solid var(--border2)" }}>
              <div style={{ padding:"16px 24px",fontSize:13,fontWeight:700,color:"var(--text3)" }}>Feature</div>
              {["Free","Pro","Business"].map(h => (
                <div key={h} style={{ padding:"16px 24px",fontSize:13,fontWeight:700,color:h==="Pro"?"#a78bfa":"var(--text3)",textAlign:"center" }}>{h}</div>
              ))}
            </div>
            {/* Rows */}
            {FEATURE_COMPARISON.map((row, i) => (
              <div key={row.feature} style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",borderBottom:i<FEATURE_COMPARISON.length-1?"1px solid rgba(255,255,255,0.04)":"none" }}>
                <div style={{ padding:"14px 24px",fontSize:14,color:"var(--text2)" }}>{row.feature}</div>
                {[row.free, row.pro, row.business].map((val, j) => (
                  <div key={j} style={{ padding:"14px 24px",fontSize:13,color:val==="—"?"var(--text4)":val==="✓"?"#10b981":j===1?"#a78bfa":"var(--text2)",textAlign:"center",fontWeight:val==="✓"||val==="—"?400:500 }}>{val}</div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ mini */}
        <div style={{ textAlign:"center",marginBottom:48 }}>
          <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:28,fontWeight:800,marginBottom:12 }}>Have questions?</h2>
          <p style={{ color:"var(--text3)",fontSize:15,marginBottom:28 }}>We're here to help. Reach out anytime.</p>
          <div style={{ display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap" }}>
            <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:"20px 28px",flex:1,maxWidth:280 }}>
              <div style={{ fontSize:24,marginBottom:10 }}>💬</div>
              <div style={{ fontWeight:700,marginBottom:6 }}>Live Chat</div>
              <div style={{ fontSize:13,color:"var(--text3)" }}>Chat with our team in real-time during business hours</div>
            </div>
            <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:"20px 28px",flex:1,maxWidth:280 }}>
              <div style={{ fontSize:24,marginBottom:10 }}>📧</div>
              <div style={{ fontWeight:700,marginBottom:6 }}>Email Support</div>
              <div style={{ fontSize:13,color:"var(--text3)" }}>support@reelforge.ai — we reply within 24 hours</div>
            </div>
            <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:"20px 28px",flex:1,maxWidth:280 }}>
              <div style={{ fontSize:24,marginBottom:10 }}>📖</div>
              <div style={{ fontWeight:700,marginBottom:6 }}>Help Center</div>
              <div style={{ fontSize:13,color:"var(--text3)" }}>Browse hundreds of tutorials, tips, and guides</div>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div style={{ textAlign:"center",borderTop:"1px solid var(--border2)",paddingTop:40 }}>
          <div style={{ fontSize:13,color:"var(--text4)",marginBottom:20 }}>Trusted by 50,000+ creators worldwide</div>
          <div style={{ display:"flex",gap:32,justifyContent:"center",flexWrap:"wrap" }}>
            {["🔒 SSL Secured","✅ GDPR Compliant","💳 Secure Payments","🔄 Cancel Anytime","🎯 7-Day Free Trial"].map(b => (
              <div key={b} style={{ fontSize:13,fontWeight:500,color:"var(--text3)" }}>{b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
