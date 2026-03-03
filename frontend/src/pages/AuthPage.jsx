import { useState } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AuthPage({ onSuccess, onBack, initialMode = "login" }) {
  const [mode, setMode] = useState(initialMode); // "login" | "signup"
  const [form, setForm] = useState({ email: "", password: "", fullName: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!form.fullName.trim()) return setError("Please enter your name.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email: form.email, password: form.password }
        : { email: form.email, password: form.password, full_name: form.fullName };

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Authentication failed");

      // Save token
      localStorage.setItem("rf_token", data.access_token);
      localStorage.setItem("rf_user", JSON.stringify({ id: data.user_id, email: data.email, name: data.full_name }));

      onSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "var(--card)", border: "1px solid var(--border2)",
    color: "var(--text)", borderRadius: 10, padding: "13px 16px",
    fontSize: 15, transition: "border-color 0.2s",
  };

  const focusStyle = { borderColor: "var(--primary)", boxShadow: "0 0 0 3px rgba(124,58,237,0.15)" };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative", overflow: "hidden" }}>
      {/* BG blobs */}
      <div style={{ position:"absolute",top:"5%",left:"5%",width:500,height:500,borderRadius:"50%",background:"radial-gradient(circle,rgba(124,58,237,0.15) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }} />
      <div style={{ position:"absolute",bottom:"5%",right:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(236,72,153,0.12) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none" }} />

      <div style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        {/* Back button */}
        <button onClick={onBack} style={{ background:"none",color:"var(--text3)",fontSize:14,fontWeight:500,padding:"8px 0",marginBottom:24,display:"flex",alignItems:"center",gap:6,border:"none",cursor:"pointer",transition:"color 0.2s" }}
          onMouseOver={e=>e.currentTarget.style.color="#fff"} onMouseOut={e=>e.currentTarget.style.color="var(--text3)"}>
          ← Back to Home
        </button>

        {/* Card */}
        <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:24,padding:"40px 36px",boxShadow:"0 24px 80px rgba(0,0,0,0.4)" }}>
          {/* Logo */}
          <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:32,justifyContent:"center" }}>
            <span style={{ fontSize:28 }}>🎬</span>
            <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:22,background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ReelForge AI</span>
          </div>

          {/* Mode tabs */}
          <div style={{ display:"flex",gap:0,background:"var(--bg)",borderRadius:12,padding:4,marginBottom:32 }}>
            {["login","signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex:1, padding:"10px", borderRadius:9, fontSize:14, fontWeight:600, border:"none", cursor:"pointer",
                background: mode===m ? "linear-gradient(135deg,#7c3aed,#ec4899)" : "transparent",
                color: mode===m ? "#fff" : "var(--text3)",
                transition:"all 0.2s",
              }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Title */}
          <h1 style={{ fontFamily:"'Poppins',sans-serif",fontSize:24,fontWeight:800,marginBottom:8,textAlign:"center" }}>
            {mode === "login" ? "Welcome back 👋" : "Start creating for free 🚀"}
          </h1>
          <p style={{ fontSize:14,color:"var(--text3)",marginBottom:28,textAlign:"center" }}>
            {mode === "login" ? "Log in to your ReelForge account" : "Create your free account — no credit card needed"}
          </p>

          {/* Error */}
          {error && (
            <div style={{ background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.3)",borderRadius:10,padding:"12px 16px",marginBottom:20,fontSize:14,color:"#fca5a5" }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex",flexDirection:"column",gap:18 }}>
            {mode === "signup" && (
              <div>
                <label style={{ display:"block",fontSize:13,fontWeight:500,color:"var(--text3)",marginBottom:6 }}>Full Name</label>
                <input
                  name="fullName" type="text" value={form.fullName} onChange={handleChange}
                  placeholder="Your name" required style={inputStyle}
                  onFocus={e=>Object.assign(e.target.style,focusStyle)}
                  onBlur={e=>{ e.target.style.borderColor="var(--border2)"; e.target.style.boxShadow="none"; }}
                />
              </div>
            )}
            <div>
              <label style={{ display:"block",fontSize:13,fontWeight:500,color:"var(--text3)",marginBottom:6 }}>Email</label>
              <input
                name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required style={inputStyle}
                onFocus={e=>Object.assign(e.target.style,focusStyle)}
                onBlur={e=>{ e.target.style.borderColor="var(--border2)"; e.target.style.boxShadow="none"; }}
              />
            </div>
            <div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <label style={{ fontSize:13,fontWeight:500,color:"var(--text3)" }}>Password</label>
                {mode === "login" && <span style={{ fontSize:12,color:"#a78bfa",cursor:"pointer" }}>Forgot password?</span>}
              </div>
              <div style={{ position:"relative" }}>
                <input
                  name="password" type={showPass ? "text" : "password"} value={form.password} onChange={handleChange}
                  placeholder={mode==="login" ? "Your password" : "At least 6 characters"} required style={{ ...inputStyle,paddingRight:44 }}
                  onFocus={e=>Object.assign(e.target.style,focusStyle)}
                  onBlur={e=>{ e.target.style.borderColor="var(--border2)"; e.target.style.boxShadow="none"; }}
                />
                <button type="button" onClick={() => setShowPass(s=>!s)} style={{ position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"var(--text4)" }}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>
            {mode === "signup" && (
              <div>
                <label style={{ display:"block",fontSize:13,fontWeight:500,color:"var(--text3)",marginBottom:6 }}>Confirm Password</label>
                <input
                  name="confirmPassword" type={showPass ? "text" : "password"} value={form.confirmPassword} onChange={handleChange}
                  placeholder="Repeat password" required style={inputStyle}
                  onFocus={e=>Object.assign(e.target.style,focusStyle)}
                  onBlur={e=>{ e.target.style.borderColor="var(--border2)"; e.target.style.boxShadow="none"; }}
                />
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width:"100%",marginTop:4,
              background: loading ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg,#7c3aed,#ec4899)",
              color:"#fff",border:"none",borderRadius:12,padding:"14px",
              fontWeight:700,fontSize:16,cursor:loading?"not-allowed":"pointer",
              boxShadow:"0 4px 20px rgba(124,58,237,0.4)",transition:"all 0.2s",
              display:"flex",alignItems:"center",justifyContent:"center",gap:8,
            }}
              onMouseOver={e=>{ if(!loading){ e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 8px 28px rgba(124,58,237,0.55)"; }}}
              onMouseOut={e=>{ e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 20px rgba(124,58,237,0.4)"; }}>
              {loading ? <><span style={{ width:18,height:18,border:"2px solid rgba(255,255,255,0.3)",borderTopColor:"#fff",borderRadius:"50%",animation:"spin 0.8s linear infinite",display:"inline-block" }} /> Processing...</> : (mode==="login" ? "🔑 Log In" : "🚀 Create Free Account")}
            </button>
          </form>

          <div style={{ marginTop:24,textAlign:"center",fontSize:14,color:"var(--text4)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={() => { setMode(mode==="login"?"signup":"login"); setError(""); }} style={{ color:"#a78bfa",fontWeight:600,cursor:"pointer" }}>
              {mode === "login" ? "Sign up free" : "Log in"}
            </span>
          </div>

          {mode === "signup" && (
            <p style={{ marginTop:20,textAlign:"center",fontSize:12,color:"var(--text4)",lineHeight:1.6 }}>
              By creating an account you agree to our{" "}
              <span style={{ color:"#a78bfa",cursor:"pointer" }}>Terms of Service</span> and{" "}
              <span style={{ color:"#a78bfa",cursor:"pointer" }}>Privacy Policy</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
