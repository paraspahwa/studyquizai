import { useState, useEffect } from "react";

/* ─── DATA ─── */
const FEATURES = [
  { icon: "✍️", title: "AI Script Writing", desc: "Enter any topic and our AI crafts engaging, viral-optimized scripts tailored to your niche in seconds.", color: "#7c3aed" },
  { icon: "🎙️", title: "Auto Voiceover", desc: "Choose from 30+ natural AI voices in multiple languages. Your videos sound like a real human narrator.", color: "#ec4899" },
  { icon: "🎬", title: "Viral-Ready Visuals", desc: "Auto-matched stock footage, AI images, and animated captions make every video thumb-stopping.", color: "#06b6d4" },
  { icon: "📱", title: "One-Click Publishing", desc: "Schedule and publish directly to TikTok, YouTube Shorts, and Instagram Reels from one dashboard.", color: "#10b981" },
  { icon: "📊", title: "Analytics Dashboard", desc: "Track views, engagement, and revenue across all platforms in a single, clean analytics view.", color: "#f59e0b" },
  { icon: "🔄", title: "Bulk Generation", desc: "Generate 30 videos at once with different angles on the same topic — perfect for fast channel growth.", color: "#a78bfa" },
];

const STEPS = [
  { step: "01", icon: "💡", title: "Enter Your Topic", desc: "Type any topic, keyword, or idea. Pick your niche — motivation, finance, education, entertainment, or anything else." },
  { step: "02", icon: "⚡", title: "AI Creates Your Video", desc: "Our AI writes the script, selects visuals, adds voiceover, captions, background music — all in under 60 seconds." },
  { step: "03", icon: "🚀", title: "Download & Go Viral", desc: "Download your video in HD or publish directly to all your social channels. Rinse and repeat daily." },
];

const NICHES = ["Motivation","Finance","Education","Health","Travel","Technology","Fitness","Comedy","News","Cooking","History","Science","Business","Crypto","Self-Help"];

const TESTIMONIALS = [
  { name: "Alex R.", avatar: "A", role: "YouTube Creator — 240K Subscribers", rating: 5, color: "#7c3aed", text: "ReelForge is the reason my channel went from 5K to 240K in 8 months. I post every single day without breaking a sweat. The AI-generated scripts are honestly better than what I used to write manually." },
  { name: "Priya S.", avatar: "P", role: "TikTok Creator — 1.2M Followers", rating: 5, color: "#ec4899", text: "I make $4,000+ a month from TikTok and ReelForge is literally my secret weapon. I don't show my face, don't record my voice, and still get millions of views. This tool is insane." },
  { name: "Marcus K.", avatar: "M", role: "Finance Channel — 85K Subscribers", rating: 5, color: "#06b6d4", text: "The AI understands finance content incredibly well. My videos look and sound professional. Revenue went from $200/mo to $3,500/mo after switching to ReelForge." },
  { name: "Zoe T.", avatar: "Z", role: "Education Channel — 510K Subscribers", rating: 5, color: "#10b981", text: "I was skeptical at first but after my first video I was hooked. The voiceover quality is amazing and the captions are perfectly timed. My students love the content." },
];

const FAQS = [
  { q: "Do I need to show my face or record my voice?", a: "No! ReelForge creates 100% faceless videos. Our AI generates the voiceover, selects the visuals, and produces the entire video automatically. You never need to appear on camera." },
  { q: "How long does it take to generate a video?", a: "Most videos are ready in under 60 seconds. Longer videos (60+ seconds) may take up to 3 minutes. Our AI works fast so you can produce at scale." },
  { q: "Can I monetize videos created by ReelForge?", a: "Yes! You own 100% of the rights to all videos you create. You can monetize them on YouTube, TikTok, Instagram, or sell them to clients." },
  { q: "Which platforms can I publish to?", a: "You can download videos in 9:16 (Shorts/TikTok/Reels) or 16:9 (YouTube) formats. Pro and Business plans include direct scheduling to TikTok, YouTube, and Instagram." },
  { q: "What niches work best with ReelForge?", a: "ReelForge works for virtually any niche — motivation, finance, education, health, comedy, news, cooking, technology, history, and more. Our AI is trained on viral content patterns across all niches." },
  { q: "Is there a free plan?", a: "Yes! The free plan includes 5 video generations per month so you can try before you commit. Pro and Business plans unlock unlimited generations and advanced features." },
];

/* ─── SUB-COMPONENTS ─── */
function Navbar({ onLogin, onGetStarted }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
      padding: "14px 32px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "rgba(10,10,26,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(124,58,237,0.2)" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 26 }}>🎬</span>
        <span style={{
          fontFamily: "'Poppins',sans-serif", fontWeight: 800, fontSize: 20,
          background: "linear-gradient(135deg,#a78bfa,#ec4899)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>ReelForge AI</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 14, fontWeight: 500 }}>
        {["Features","How It Works","Pricing"].map(item => (
          <a key={item} href={`#${item.toLowerCase().replace(/ /g,"-")}`}
            style={{ color: "var(--text3)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseOver={e => e.target.style.color = "#fff"}
            onMouseOut={e => e.target.style.color = "var(--text3)"}>{item}</a>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={onLogin} style={{
          background: "none", color: "var(--text3)", fontSize: 14, fontWeight: 500,
          padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer", transition: "color 0.2s",
        }}
          onMouseOver={e => e.target.style.color = "#fff"}
          onMouseOut={e => e.target.style.color = "var(--text3)"}>Log in</button>
        <button onClick={onGetStarted} style={{
          background: "linear-gradient(135deg,#7c3aed,#ec4899)",
          color: "#fff", fontSize: 14, fontWeight: 600,
          padding: "9px 20px", borderRadius: 10, border: "none", cursor: "pointer",
          boxShadow: "0 4px 16px rgba(124,58,237,0.4)", transition: "all 0.2s",
        }}
          onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(124,58,237,0.5)"; }}
          onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(124,58,237,0.4)"; }}>
          Start Free →
        </button>
      </div>
    </nav>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: "var(--card)", borderRadius: 12, overflow: "hidden",
      border: `1px solid ${open ? "rgba(124,58,237,0.4)" : "var(--border2)"}`,
      transition: "border-color 0.2s",
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "20px 24px", background: "none", color: "var(--text)",
        fontSize: 15, fontWeight: 600, textAlign: "left", gap: 16, border: "none", cursor: "pointer",
      }}>
        {q}
        <span style={{
          flexShrink: 0, width: 28, height: 28, borderRadius: 8,
          background: open ? "var(--primary)" : "rgba(124,58,237,0.12)",
          color: open ? "#fff" : "var(--primary-light)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 300, transition: "all 0.2s",
          transform: open ? "rotate(45deg)" : "none",
        }}>+</span>
      </button>
      {open && (
        <div style={{
          padding: "0 24px 20px", color: "var(--text3)", fontSize: 14,
          lineHeight: 1.75, animation: "fadeIn 0.2s ease",
        }}>{a}</div>
      )}
    </div>
  );
}

function PhoneMockup() {
  const [idx, setIdx] = useState(0);
  const cards = [
    { label: "💰 Finance Tips", bg: "#1a0a40", accent: "#7c3aed" },
    { label: "💪 Motivation", bg: "#3d0a2e", accent: "#ec4899" },
    { label: "🧠 Education", bg: "#0a2040", accent: "#06b6d4" },
    { label: "🎭 Comedy", bg: "#1a2a0a", accent: "#10b981" },
  ];
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % cards.length), 2500);
    return () => clearInterval(t);
  }, []);

  const { label, bg, accent } = cards[idx];

  return (
    <div style={{
      width: 200, height: 360, borderRadius: 24, overflow: "hidden", flexShrink: 0,
      border: "2px solid rgba(124,58,237,0.5)", position: "relative",
      background: `linear-gradient(160deg,${bg} 0%,#0a0a1a 100%)`,
      boxShadow: `0 0 60px ${accent}66`,
      transition: "box-shadow 0.5s ease",
    }}>
      <div style={{ position:"absolute",top:12,left:"50%",transform:"translateX(-50%)",width:56,height:5,background:"rgba(255,255,255,0.18)",borderRadius:3 }} />
      <div style={{
        position:"absolute",top:28,left:12,right:12,
        background:"rgba(0,0,0,0.55)",borderRadius:8,padding:"6px 10px",
        fontSize:11,fontWeight:700,color:"#fff",textAlign:"center",
        backdropFilter:"blur(10px)",
      }}>{label}</div>

      {/* Waveform */}
      <div style={{ position:"absolute",top:"42%",left:"50%",transform:"translate(-50%,-50%)",display:"flex",gap:4,alignItems:"center" }}>
        {[20,34,22,40,28,36,18,32,24,38].map((h,i) => (
          <div key={i} style={{
            width:4,height:h,
            background:`linear-gradient(180deg,${accent},${accent}88)`,
            borderRadius:2,
            animation:`pulse ${0.5+i*0.08}s ease-in-out infinite alternate`,
          }} />
        ))}
      </div>

      {/* Caption lines */}
      <div style={{ position:"absolute",bottom:82,left:12,right:12,display:"flex",flexDirection:"column",gap:6 }}>
        {[90,70,80].map((w,i) => (
          <div key={i} style={{ height:6,width:`${w}%`,background:"rgba(255,255,255,0.12)",borderRadius:3 }} />
        ))}
      </div>

      <div style={{
        position:"absolute",bottom:54,left:12,right:12,
        background:"rgba(0,0,0,0.75)",borderRadius:8,padding:"8px 12px",
        textAlign:"center",fontSize:10,fontWeight:700,color:"#fff",
      }}>AI Caption ✨</div>

      <div style={{ position:"absolute",bottom:14,left:12,right:12,display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontSize:16 }}>❤️ 24K</span>
        <div style={{ background:`linear-gradient(135deg,${accent},${accent}88)`,color:"#fff",fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:6 }}>AI VIDEO</div>
        <span style={{ fontSize:16 }}>🔁 1.2K</span>
      </div>
    </div>
  );
}

/* ─── MAIN ─── */
export default function LandingPage({ onGetStarted, onViewPricing, onLogin }) {
  const [typed, setTyped] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const words = ["Viral TikToks","YouTube Shorts","Instagram Reels","Faceless Videos","Passive Income"];

  useEffect(() => {
    const word = words[wordIdx];
    let t;
    if (!deleting) {
      if (charIdx < word.length) t = setTimeout(() => setCharIdx(c => c + 1), 85);
      else t = setTimeout(() => setDeleting(true), 2000);
    } else {
      if (charIdx > 0) t = setTimeout(() => setCharIdx(c => c - 1), 45);
      else { setDeleting(false); setWordIdx(i => (i + 1) % words.length); }
    }
    setTyped(word.slice(0, charIdx));
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  const PrimaryBtn = ({ children, onClick, large }) => (
    <button onClick={onClick} style={{
      background: "linear-gradient(135deg,#7c3aed,#ec4899)",
      color: "#fff", fontWeight: 700, border: "none", cursor: "pointer",
      padding: large ? "17px 36px" : "13px 26px",
      fontSize: large ? 17 : 15,
      borderRadius: large ? 16 : 12,
      boxShadow: "0 4px 24px rgba(124,58,237,0.45)",
      transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8,
    }}
      onMouseOver={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(124,58,237,0.6)"; }}
      onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.45)"; }}>
      {children}
    </button>
  );

  const OutlineBtn = ({ children, onClick, large }) => (
    <button onClick={onClick} style={{
      background: "transparent", color: "var(--text2)", fontWeight: 600,
      border: "1px solid var(--border2)", cursor: "pointer",
      padding: large ? "16px 32px" : "12px 24px",
      fontSize: large ? 16 : 15,
      borderRadius: large ? 16 : 12,
      transition: "all 0.2s", display: "inline-flex", alignItems: "center", gap: 8,
    }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.color = "#fff"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text2)"; }}>
      {children}
    </button>
  );

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", overflowX: "hidden" }}>
      <Navbar onLogin={onLogin} onGetStarted={onGetStarted} />

      {/* ══ HERO ══ */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: 80 }}>
        {/* BG blobs */}
        {[
          { top:"8%",left:"3%",w:700,h:700,c:"rgba(124,58,237,0.16)",d:7 },
          { bottom:"8%",right:"3%",w:500,h:500,c:"rgba(236,72,153,0.13)",d:9 },
          { top:"45%",right:"22%",w:320,h:320,c:"rgba(6,182,212,0.09)",d:5 },
        ].map((b,i) => (
          <div key={i} style={{
            position:"absolute",borderRadius:"50%",
            width:b.w,height:b.h,top:b.top,bottom:b.bottom,left:b.left,right:b.right,
            background:`radial-gradient(circle,${b.c} 0%,transparent 70%)`,
            filter:"blur(50px)",
            animation:`float ${b.d}s ease-in-out infinite ${i%2?"reverse":""}`,
            pointerEvents:"none",
          }} />
        ))}

        <div style={{ maxWidth:1200,margin:"0 auto",padding:"60px 24px",display:"flex",alignItems:"center",gap:60,flexWrap:"wrap",justifyContent:"center" }}>
          {/* Left */}
          <div style={{ flex:1,minWidth:300,maxWidth:600 }}>
            <div style={{
              display:"inline-flex",alignItems:"center",gap:6,
              background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.3)",
              borderRadius:100,padding:"6px 16px",fontSize:13,fontWeight:600,
              color:"#a78bfa",marginBottom:28,animation:"fadeInUp 0.6s ease both",
            }}>⚡ AI-Powered · No Face · No Voice Needed</div>

            <h1 style={{
              fontFamily:"'Poppins',sans-serif",
              fontSize:"clamp(36px,6vw,68px)",fontWeight:900,lineHeight:1.08,
              marginBottom:24,letterSpacing:"-1.5px",
              animation:"fadeInUp 0.6s 0.1s ease both",
            }}>
              Create Viral <span style={{
                background:"linear-gradient(135deg,#a78bfa,#ec4899,#06b6d4)",
                backgroundSize:"200% 200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                animation:"gradientShift 4s ease infinite",
              }}>{typed}</span>
              <span style={{ color:"#a78bfa",animation:"blink 1s infinite" }}>|</span>
              <br />with AI in Minutes
            </h1>

            <p style={{
              fontSize:18,color:"var(--text3)",lineHeight:1.75,marginBottom:36,maxWidth:500,
              animation:"fadeInUp 0.6s 0.2s ease both",
            }}>
              Enter any topic. Our AI writes the script, generates the voiceover,
              picks the visuals, and produces a ready-to-publish short video —
              {" "}<strong style={{color:"var(--text)"}}>all in under 60 seconds.</strong>
            </p>

            <div style={{ display:"flex",gap:14,flexWrap:"wrap",marginBottom:40,animation:"fadeInUp 0.6s 0.3s ease both" }}>
              <PrimaryBtn onClick={onGetStarted} large>🚀 Start Creating Free</PrimaryBtn>
              <OutlineBtn onClick={onViewPricing} large>View Pricing</OutlineBtn>
            </div>

            {/* Social proof avatars */}
            <div style={{ display:"flex",alignItems:"center",gap:16,animation:"fadeInUp 0.6s 0.4s ease both" }}>
              <div style={{ display:"flex" }}>
                {["#7c3aed","#ec4899","#06b6d4","#10b981","#f59e0b"].map((c,i) => (
                  <div key={i} style={{
                    width:34,height:34,borderRadius:"50%",background:c,
                    border:"2px solid var(--bg)",marginLeft:i?-10:0,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:12,fontWeight:700,color:"#fff",
                  }}>{"APMZK"[i]}</div>
                ))}
              </div>
              <div>
                <div style={{ display:"flex",gap:2,marginBottom:3 }}>
                  {[...Array(5)].map((_,i) => <span key={i} style={{ color:"#f59e0b",fontSize:13 }}>★</span>)}
                </div>
                <div style={{ fontSize:13,color:"var(--text3)" }}>
                  <strong style={{color:"var(--text)"}}>50,000+</strong> creators growing with ReelForge
                </div>
              </div>
            </div>
          </div>

          {/* Right — Phone mockup */}
          <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:16,animation:"fadeInUp 0.6s 0.5s ease both" }}>
            <PhoneMockup />
            <div style={{
              background:"var(--card)",border:"1px solid var(--border2)",
              borderRadius:10,padding:"10px 18px",fontSize:13,color:"var(--text3)",textAlign:"center",
            }}>⚡ Generated in <strong style={{color:"#a78bfa"}}>47 seconds</strong></div>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ══ */}
      <section style={{ borderTop:"1px solid var(--border2)",borderBottom:"1px solid var(--border2)",background:"rgba(124,58,237,0.04)",padding:"44px 24px" }}>
        <div style={{ maxWidth:900,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:32,textAlign:"center" }}>
          {[["50,000+","Active Creators"],["2M+","Videos Generated"],["10B+","Total Views"],["4.9/5","Average Rating"]].map(([v,l]) => (
            <div key={l}>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,4vw,40px)",fontWeight:800,background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:6 }}>{v}</div>
              <div style={{ color:"var(--text3)",fontSize:14,fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ NICHE TICKER ══ */}
      <section style={{ padding:"32px 0" }}>
        <div style={{ fontSize:11,fontWeight:700,letterSpacing:"0.12em",color:"var(--text4)",textAlign:"center",marginBottom:16,textTransform:"uppercase" }}>Works for Every Niche</div>
        <div style={{ display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center",padding:"0 24px" }}>
          {NICHES.map(n => (
            <span key={n} style={{ background:"rgba(124,58,237,0.1)",border:"1px solid rgba(124,58,237,0.25)",color:"#a78bfa",borderRadius:100,padding:"6px 14px",fontSize:13,fontWeight:600 }}>{n}</span>
          ))}
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features" style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:"#a78bfa",textTransform:"uppercase",marginBottom:14 }}>Everything You Need</div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:800,lineHeight:1.2,marginBottom:16 }}>
              One platform. <span style={{ background:"linear-gradient(135deg,#a78bfa,#ec4899,#06b6d4)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradientShift 4s ease infinite" }}>Infinite videos.</span>
            </h2>
            <p style={{ fontSize:18,color:"var(--text3)",maxWidth:580,margin:"0 auto",lineHeight:1.7 }}>
              ReelForge handles every step of video creation so you can focus on growing your audience and income.
            </p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background:"rgba(255,255,255,0.03)",backdropFilter:"blur(20px)",
                border:"1px solid rgba(255,255,255,0.07)",borderRadius:16,
                padding:"32px 28px",position:"relative",overflow:"hidden",
                transition:"transform 0.3s,box-shadow 0.3s",cursor:"default",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = `0 16px 48px ${f.color}30`; e.currentTarget.style.borderColor = `${f.color}40`; }}
                onMouseOut={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}>
                <div style={{ position:"absolute",top:-25,right:-25,width:110,height:110,borderRadius:"50%",background:`${f.color}15`,filter:"blur(20px)",pointerEvents:"none" }} />
                <div style={{ width:52,height:52,borderRadius:14,background:`${f.color}18`,border:`1px solid ${f.color}35`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,marginBottom:20 }}>{f.icon}</div>
                <h3 style={{ fontSize:17,fontWeight:700,marginBottom:10 }}>{f.title}</h3>
                <p style={{ fontSize:14,color:"var(--text3)",lineHeight:1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="how-it-works" style={{ padding:"100px 24px",background:"var(--bg2)",borderTop:"1px solid var(--border2)",borderBottom:"1px solid var(--border2)" }}>
        <div style={{ maxWidth:1100,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:"#a78bfa",textTransform:"uppercase",marginBottom:14 }}>Simple 3-Step Process</div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:800,lineHeight:1.2 }}>
              From idea to viral video{" "}
              <span style={{ background:"linear-gradient(135deg,#a78bfa,#ec4899)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradientShift 4s ease infinite" }}>in 60 seconds</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28 }}>
            {STEPS.map((s, i) => (
              <div key={s.step} style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:20,padding:"36px 28px",textAlign:"center",position:"relative",overflow:"hidden" }}>
                <div style={{ position:"absolute",top:-12,right:-8,fontSize:72,fontWeight:900,color:"rgba(124,58,237,0.06)",fontFamily:"'Poppins',sans-serif",lineHeight:1,userSelect:"none" }}>{s.step}</div>
                <div style={{ width:68,height:68,borderRadius:"50%",background:"linear-gradient(135deg,rgba(124,58,237,0.18),rgba(236,72,153,0.18))",border:"2px solid rgba(124,58,237,0.28)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 20px" }}>{s.icon}</div>
                <h3 style={{ fontSize:19,fontWeight:700,marginBottom:12 }}>{s.title}</h3>
                <p style={{ fontSize:14,color:"var(--text3)",lineHeight:1.75 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center",marginTop:48 }}>
            <PrimaryBtn onClick={onGetStarted} large>🎬 Create My First Video — Free</PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ══ PRICING PREVIEW ══ */}
      <section id="pricing" style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:1000,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:"#a78bfa",textTransform:"uppercase",marginBottom:14 }}>Simple Pricing</div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:800,lineHeight:1.2,marginBottom:14 }}>Start free. Scale when ready.</h2>
            <p style={{ fontSize:17,color:"var(--text3)" }}>No hidden fees. Cancel anytime. You own every video.</p>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:24,alignItems:"center" }}>
            {/* Free */}
            <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:20,padding:"36px 28px" }}>
              <div style={{ fontSize:12,fontWeight:700,color:"var(--text3)",letterSpacing:"0.06em",marginBottom:14 }}>FREE</div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:44,fontWeight:800,marginBottom:4 }}>$0</div>
              <div style={{ color:"var(--text4)",fontSize:14,marginBottom:28 }}>Forever free</div>
              {["5 videos / month","720p quality","Watermark included","5 basic voices"].map(f => (
                <div key={f} style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12,fontSize:14,color:"var(--text3)" }}>
                  <span style={{ color:"#10b981" }}>✓</span>{f}
                </div>
              ))}
              <button onClick={onGetStarted} style={{ width:"100%",marginTop:24,background:"var(--card2)",color:"var(--text)",border:"1px solid var(--border2)",borderRadius:12,padding:"13px",fontWeight:600,fontSize:14,cursor:"pointer",transition:"all 0.2s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = "var(--primary)"}
                onMouseOut={e => e.currentTarget.style.borderColor = "var(--border2)"}>
                Get Started Free
              </button>
            </div>

            {/* Pro — highlighted */}
            <div style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.14),rgba(236,72,153,0.1))",border:"2px solid rgba(124,58,237,0.5)",borderRadius:20,padding:"36px 28px",position:"relative",transform:"scale(1.04)",boxShadow:"0 20px 60px rgba(124,58,237,0.28)" }}>
              <div style={{ position:"absolute",top:-14,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#7c3aed,#ec4899)",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 16px",borderRadius:100,whiteSpace:"nowrap" }}>MOST POPULAR</div>
              <div style={{ fontSize:12,fontWeight:700,color:"#a78bfa",letterSpacing:"0.06em",marginBottom:14 }}>PRO</div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:44,fontWeight:800,background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:4 }}>$19</div>
              <div style={{ color:"var(--text4)",fontSize:14,marginBottom:28 }}>per month</div>
              {["Unlimited videos","1080p HD quality","No watermark","30+ premium voices","Direct publishing","Priority support"].map(f => (
                <div key={f} style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12,fontSize:14,color:"var(--text2)" }}>
                  <span style={{ color:"#a78bfa" }}>✓</span>{f}
                </div>
              ))}
              <button onClick={onViewPricing} style={{ width:"100%",marginTop:24,background:"linear-gradient(135deg,#7c3aed,#ec4899)",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontWeight:700,fontSize:15,cursor:"pointer",boxShadow:"0 6px 20px rgba(124,58,237,0.4)",transition:"all 0.2s" }}
                onMouseOver={e => { e.currentTarget.style.transform="translateY(-1px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(124,58,237,0.55)"; }}
                onMouseOut={e => { e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 6px 20px rgba(124,58,237,0.4)"; }}>
                Start Pro Trial
              </button>
            </div>

            {/* Business */}
            <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:20,padding:"36px 28px" }}>
              <div style={{ fontSize:12,fontWeight:700,color:"var(--text3)",letterSpacing:"0.06em",marginBottom:14 }}>BUSINESS</div>
              <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:44,fontWeight:800,marginBottom:4 }}>$49</div>
              <div style={{ color:"var(--text4)",fontSize:14,marginBottom:28 }}>per month</div>
              {["Everything in Pro","10 team members","Bulk generation (30x)","Custom branding","API access","Dedicated account mgr"].map(f => (
                <div key={f} style={{ display:"flex",gap:10,alignItems:"center",marginBottom:12,fontSize:14,color:"var(--text3)" }}>
                  <span style={{ color:"#06b6d4" }}>✓</span>{f}
                </div>
              ))}
              <button onClick={onViewPricing} style={{ width:"100%",marginTop:24,background:"var(--card2)",color:"var(--text)",border:"1px solid var(--border2)",borderRadius:12,padding:"13px",fontWeight:600,fontSize:14,cursor:"pointer",transition:"all 0.2s" }}
                onMouseOver={e => e.currentTarget.style.borderColor = "#06b6d4"}
                onMouseOut={e => e.currentTarget.style.borderColor = "var(--border2)"}>
                Start Business Trial
              </button>
            </div>
          </div>
          <p style={{ textAlign:"center",marginTop:24,fontSize:13,color:"var(--text4)" }}>7-day free trial on all paid plans · No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding:"100px 24px",background:"var(--bg2)",borderTop:"1px solid var(--border2)" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:64 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:"#a78bfa",textTransform:"uppercase",marginBottom:14 }}>Creator Stories</div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,5vw,48px)",fontWeight:800,lineHeight:1.2 }}>
              Real creators.{" "}
              <span style={{ background:"linear-gradient(135deg,#a78bfa,#ec4899)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradientShift 4s ease infinite" }}>Real results.</span>
            </h2>
          </div>
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(270px,1fr))",gap:24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.07)",borderLeft:`3px solid ${t.color}`,borderRadius:16,padding:"28px",display:"flex",flexDirection:"column",gap:16 }}>
                <div style={{ display:"flex",gap:2 }}>
                  {[...Array(t.rating)].map((_,i) => <span key={i} style={{ color:"#f59e0b",fontSize:14 }}>★</span>)}
                </div>
                <p style={{ fontSize:14,color:"var(--text2)",lineHeight:1.75,flex:1 }}>"{t.text}"</p>
                <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                  <div style={{ width:42,height:42,borderRadius:"50%",background:t.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,color:"#fff",flexShrink:0 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight:700,fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12,color:"var(--text4)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section style={{ padding:"100px 24px" }}>
        <div style={{ maxWidth:760,margin:"0 auto" }}>
          <div style={{ textAlign:"center",marginBottom:56 }}>
            <div style={{ fontSize:12,fontWeight:700,letterSpacing:"0.1em",color:"#a78bfa",textTransform:"uppercase",marginBottom:14 }}>Got Questions?</div>
            <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(28px,5vw,42px)",fontWeight:800,lineHeight:1.2 }}>Frequently Asked Questions</h2>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
            {FAQS.map(f => <FAQItem key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>
      </section>

      {/* ══ FINAL CTA ══ */}
      <section style={{ padding:"100px 24px",background:"linear-gradient(135deg,rgba(124,58,237,0.14) 0%,rgba(236,72,153,0.1) 50%,rgba(6,182,212,0.08) 100%)",borderTop:"1px solid var(--border2)" }}>
        <div style={{ maxWidth:680,margin:"0 auto",textAlign:"center" }}>
          <div style={{ display:"inline-flex",alignItems:"center",gap:6,background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.3)",borderRadius:100,padding:"6px 16px",fontSize:13,fontWeight:600,color:"#a78bfa",marginBottom:28 }}>🎬 Start Creating Today</div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:"clamp(32px,5vw,56px)",fontWeight:900,lineHeight:1.15,marginBottom:20 }}>
            Your first viral video is{" "}
            <span style={{ background:"linear-gradient(135deg,#a78bfa,#ec4899)",backgroundSize:"200%",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"gradientShift 4s ease infinite" }}>60 seconds away</span>
          </h2>
          <p style={{ fontSize:18,color:"var(--text3)",lineHeight:1.7,marginBottom:40 }}>
            Join 50,000+ creators who generate passive income with AI-powered faceless videos. No experience needed.
          </p>
          <PrimaryBtn onClick={onGetStarted} large>🚀 Start Creating Free — No Credit Card</PrimaryBtn>
          <div style={{ marginTop:24,fontSize:13,color:"var(--text4)" }}>5 free videos · Full HD · Cancel anytime</div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background:"var(--bg2)",borderTop:"1px solid var(--border2)",padding:"56px 24px 28px" }}>
        <div style={{ maxWidth:1200,margin:"0 auto" }}>
          <div style={{ display:"grid",gridTemplateColumns:"2fr 1fr 1fr 1fr",gap:40,marginBottom:48,flexWrap:"wrap" }}>
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <span style={{ fontSize:22 }}>🎬</span>
                <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:17,background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ReelForge AI</span>
              </div>
              <p style={{ fontSize:13,color:"var(--text4)",lineHeight:1.7,maxWidth:270 }}>The fastest way to create viral faceless videos for TikTok, YouTube Shorts, and Instagram Reels.</p>
            </div>
            {[
              ["Product",["Features","Pricing","How It Works","Examples","API"]],
              ["Company",["About","Blog","Careers","Press","Contact"]],
              ["Legal",["Privacy Policy","Terms of Service","Cookie Policy","Refund Policy"]],
            ].map(([heading, links]) => (
              <div key={heading}>
                <div style={{ fontWeight:700,fontSize:14,marginBottom:16 }}>{heading}</div>
                {links.map(l => <div key={l} style={{ fontSize:13,color:"var(--text4)",marginBottom:10,cursor:"pointer",transition:"color 0.2s" }} onMouseOver={e=>e.target.style.color="#fff"} onMouseOut={e=>e.target.style.color="var(--text4)"}>{l}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop:"1px solid var(--border2)",paddingTop:24,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12 }}>
            <div style={{ fontSize:13,color:"var(--text4)" }}>© 2026 ReelForge AI. All rights reserved.</div>
            <div style={{ fontSize:13,color:"var(--text4)" }}>Made with ❤️ for creators worldwide</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
