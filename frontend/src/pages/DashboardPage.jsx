import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

const NICHES = [
  { id:"motivation",label:"💪 Motivation",color:"#7c3aed" },
  { id:"finance",label:"💰 Finance",color:"#10b981" },
  { id:"education",label:"🧠 Education",color:"#06b6d4" },
  { id:"health",label:"🏃 Health",color:"#f59e0b" },
  { id:"comedy",label:"😄 Comedy",color:"#ec4899" },
  { id:"news",label:"📰 News",color:"#64748b" },
  { id:"technology",label:"💻 Technology",color:"#a78bfa" },
  { id:"cooking",label:"🍳 Cooking",color:"#f97316" },
  { id:"travel",label:"✈️ Travel",color:"#06b6d4" },
  { id:"business",label:"📊 Business",color:"#10b981" },
];

const VOICES = [
  { id:"alloy",label:"Alloy",desc:"Neutral, balanced",gender:"⚧" },
  { id:"nova",label:"Nova",desc:"Warm, friendly",gender:"♀" },
  { id:"echo",label:"Echo",desc:"Deep, authoritative",gender:"♂" },
  { id:"shimmer",label:"Shimmer",desc:"Bright, energetic",gender:"♀" },
  { id:"onyx",label:"Onyx",desc:"Strong, confident",gender:"♂" },
  { id:"fable",label:"Fable",desc:"Storytelling tone",gender:"⚧" },
];

const DURATIONS = [
  { id:"15",label:"15 sec",desc:"Quick & punchy" },
  { id:"30",label:"30 sec",desc:"Standard Reel" },
  { id:"60",label:"60 sec",desc:"Full story" },
];

const STYLES = [
  { id:"cinematic",label:"🎬 Cinematic",color:"#7c3aed" },
  { id:"minimalist",label:"⬜ Minimalist",color:"#64748b" },
  { id:"bold",label:"🔥 Bold",color:"#ec4899" },
  { id:"retro",label:"📼 Retro",color:"#f59e0b" },
  { id:"neon",label:"💜 Neon",color:"#a78bfa" },
];

const MOCK_VIDEOS = [
  { id:1,topic:"5 Habits of Millionaires",niche:"finance",duration:"60",status:"ready",views:"142K",createdAt:"2 hours ago",thumb:"💰",color:"#10b981" },
  { id:2,topic:"Morning Routine for Success",niche:"motivation",duration:"30",status:"ready",views:"89K",createdAt:"5 hours ago",thumb:"💪",color:"#7c3aed" },
  { id:3,topic:"How AI is Changing Everything",niche:"technology",duration:"60",status:"ready",views:"214K",createdAt:"Yesterday",thumb:"🤖",color:"#a78bfa" },
  { id:4,topic:"The Truth About Intermittent Fasting",niche:"health",duration:"30",status:"ready",views:"56K",createdAt:"2 days ago",thumb:"🏃",color:"#f59e0b" },
  { id:5,topic:"Top 10 Travel Hacks That Save Money",niche:"travel",duration:"60",status:"processing",views:"—",createdAt:"Just now",thumb:"✈️",color:"#06b6d4" },
  { id:6,topic:"Crypto Bull Run Predictions 2026",niche:"finance",duration:"30",status:"ready",views:"310K",createdAt:"3 days ago",thumb:"📈",color:"#10b981" },
];

function Sidebar({ active, onNav, user, onLogout }) {
  const navItems = [
    { id:"create",icon:"✨",label:"Create Video" },
    { id:"videos",icon:"🎬",label:"My Videos" },
    { id:"analytics",icon:"📊",label:"Analytics" },
    { id:"schedule",icon:"📅",label:"Schedule" },
    { id:"settings",icon:"⚙️",label:"Settings" },
  ];

  return (
    <aside style={{
      width: 220, flexShrink: 0, background: "var(--bg2)",
      borderRight: "1px solid var(--border2)", display: "flex",
      flexDirection: "column", height: "100vh", position: "sticky", top: 0,
    }}>
      {/* Logo */}
      <div style={{ padding:"24px 20px",borderBottom:"1px solid var(--border2)",display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ fontSize:22 }}>🎬</span>
        <span style={{ fontFamily:"'Poppins',sans-serif",fontWeight:800,fontSize:16,background:"linear-gradient(135deg,#a78bfa,#ec4899)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent" }}>ReelForge AI</span>
      </div>

      {/* Nav */}
      <nav style={{ padding:"16px 12px",flex:1,display:"flex",flexDirection:"column",gap:4 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => onNav(item.id)} style={{
            display:"flex",alignItems:"center",gap:12,padding:"11px 12px",borderRadius:10,
            background:active===item.id ? "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.15))" : "transparent",
            border:active===item.id ? "1px solid rgba(124,58,237,0.3)" : "1px solid transparent",
            color:active===item.id ? "#a78bfa" : "var(--text3)",
            fontSize:14,fontWeight:active===item.id ? 600 : 500,
            cursor:"pointer",transition:"all 0.2s",
          }}
            onMouseOver={e=>{ if(active!==item.id){ e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.color="#fff"; }}}
            onMouseOut={e=>{ if(active!==item.id){ e.currentTarget.style.background="transparent";e.currentTarget.style.color="var(--text3)"; }}}>
            <span style={{ fontSize:16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Plan badge */}
      <div style={{ margin:"0 12px 12px",background:"linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))",border:"1px solid rgba(124,58,237,0.3)",borderRadius:12,padding:"14px 12px" }}>
        <div style={{ fontSize:12,fontWeight:700,color:"#a78bfa",marginBottom:6 }}>FREE PLAN</div>
        <div style={{ fontSize:12,color:"var(--text3)",marginBottom:12 }}>3 of 5 videos used this month</div>
        <div style={{ height:5,background:"rgba(255,255,255,0.1)",borderRadius:3,marginBottom:12,overflow:"hidden" }}>
          <div style={{ width:"60%",height:"100%",background:"linear-gradient(90deg,#7c3aed,#ec4899)",borderRadius:3 }} />
        </div>
        <button style={{ width:"100%",background:"linear-gradient(135deg,#7c3aed,#ec4899)",color:"#fff",border:"none",borderRadius:8,padding:"9px",fontWeight:700,fontSize:12,cursor:"pointer" }}>
          ⚡ Upgrade to Pro
        </button>
      </div>

      {/* User */}
      <div style={{ padding:"16px 20px",borderTop:"1px solid var(--border2)",display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#7c3aed,#ec4899)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#fff",flexShrink:0 }}>
          {(user?.name || user?.email || "U")[0].toUpperCase()}
        </div>
        <div style={{ flex:1,minWidth:0 }}>
          <div style={{ fontSize:13,fontWeight:600,color:"var(--text)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user?.name || "Creator"}</div>
          <div style={{ fontSize:11,color:"var(--text4)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>{user?.email}</div>
        </div>
        <button onClick={onLogout} style={{ background:"none",border:"none",cursor:"pointer",fontSize:14,color:"var(--text4)",flexShrink:0,padding:4 }} title="Log out">⎋</button>
      </div>
    </aside>
  );
}

function CreatePanel({ onGenerated }) {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("motivation");
  const [duration, setDuration] = useState("30");
  const [voice, setVoice] = useState("nova");
  const [style, setStyle] = useState("cinematic");
  const [step, setStep] = useState("form"); // form | generating | done
  const [generatedScript, setGeneratedScript] = useState("");
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setStep("generating");
    setProgress(0);

    // Simulate generation progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 95) { clearInterval(interval); return 95; }
        return p + Math.random() * 8;
      });
    }, 300);

    try {
      const token = localStorage.getItem("rf_token");
      const res = await fetch(`${API}/videos/generate-script`, {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ topic, niche, duration: parseInt(duration), voice, style }),
      });

      let script;
      if (res.ok) {
        const data = await res.json();
        script = data.script;
      } else {
        // Fallback mock script
        script = generateMockScript(topic, niche);
      }

      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setGeneratedScript(script);
        setStep("done");
        onGenerated && onGenerated({ topic, niche, duration, voice, style, script });
      }, 400);
    } catch {
      clearInterval(interval);
      const script = generateMockScript(topic, niche);
      setProgress(100);
      setTimeout(() => {
        setGeneratedScript(script);
        setStep("done");
      }, 400);
    }
  };

  const handleReset = () => {
    setStep("form");
    setGeneratedScript("");
    setProgress(0);
  };

  if (step === "generating") {
    return (
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"60vh",gap:32,textAlign:"center" }}>
        <div style={{
          width:120,height:120,borderRadius:"50%",
          background:"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.2))",
          border:"3px solid rgba(124,58,237,0.4)",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:48,
          animation:"float 2s ease-in-out infinite",
        }}>⚡</div>
        <div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:26,fontWeight:800,marginBottom:12 }}>Generating Your Video...</h2>
          <p style={{ color:"var(--text3)",fontSize:15,marginBottom:32 }}>AI is writing script, selecting visuals, adding voiceover...</p>
          <div style={{ width:320,height:6,background:"rgba(255,255,255,0.1)",borderRadius:3,overflow:"hidden",margin:"0 auto" }}>
            <div style={{ height:"100%",background:"linear-gradient(90deg,#7c3aed,#ec4899)",borderRadius:3,width:`${progress}%`,transition:"width 0.3s ease" }} />
          </div>
          <div style={{ marginTop:10,fontSize:13,color:"var(--text4)" }}>{Math.round(progress)}% complete</div>
        </div>
        {[
          [10,"✍️ Writing viral script..."],
          [35,"🎙️ Generating voiceover..."],
          [60,"🎬 Selecting visuals..."],
          [80,"🎵 Adding background music..."],
          [92,"✨ Rendering final video..."],
        ].map(([threshold, label]) => (
          <div key={label} style={{ display:"flex",alignItems:"center",gap:10,opacity:progress>=threshold?1:0.3,transition:"opacity 0.3s",fontSize:14,color:progress>=threshold?"#a78bfa":"var(--text4)" }}>
            <span style={{ fontSize:11 }}>{progress>=threshold?"✅":"⏳"}</span>{label}
          </div>
        ))}
      </div>
    );
  }

  if (step === "done") {
    return (
      <div style={{ maxWidth:700,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:32 }}>
          <div style={{ fontSize:64,marginBottom:16 }}>🎉</div>
          <h2 style={{ fontFamily:"'Poppins',sans-serif",fontSize:28,fontWeight:800,marginBottom:8 }}>Video Ready!</h2>
          <p style={{ color:"var(--text3)",fontSize:15 }}>Your AI video has been generated successfully</p>
        </div>

        {/* Video preview mockup */}
        <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:20,overflow:"hidden",marginBottom:24 }}>
          <div style={{ background:"linear-gradient(135deg,#1a0a40,#0a0a1a)",height:200,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:48,marginBottom:8 }}>{NICHES.find(n=>n.id===niche)?.label.split(" ")[0]}</div>
              <div style={{ fontSize:13,color:"var(--text3)",background:"rgba(0,0,0,0.5)",padding:"6px 14px",borderRadius:20 }}>{topic}</div>
            </div>
            <div style={{ position:"absolute",bottom:16,right:16,background:"rgba(0,0,0,0.7)",color:"#fff",fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:6 }}>AI GENERATED · {duration}s</div>
          </div>
          <div style={{ padding:24 }}>
            <div style={{ fontSize:13,fontWeight:600,color:"var(--text3)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em" }}>Generated Script</div>
            <div style={{ fontSize:14,color:"var(--text2)",lineHeight:1.8,background:"var(--bg)",borderRadius:10,padding:16,maxHeight:160,overflowY:"auto",fontFamily:"monospace",fontSize:13 }}>
              {generatedScript}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12 }}>
          <button style={{ background:"linear-gradient(135deg,#7c3aed,#ec4899)",color:"#fff",border:"none",borderRadius:12,padding:"14px",fontWeight:700,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            ⬇️ Download HD Video
          </button>
          <button style={{ background:"var(--card)",color:"var(--text)",border:"1px solid var(--border2)",borderRadius:12,padding:"14px",fontWeight:600,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
            📤 Publish to Socials
          </button>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          <button style={{ background:"var(--card)",color:"var(--text)",border:"1px solid var(--border2)",borderRadius:12,padding:"12px",fontWeight:600,fontSize:14,cursor:"pointer" }}>
            ✏️ Edit Script
          </button>
          <button onClick={handleReset} style={{ background:"var(--card)",color:"var(--text)",border:"1px solid var(--border2)",borderRadius:12,padding:"12px",fontWeight:600,fontSize:14,cursor:"pointer" }}>
            + Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:720,margin:"0 auto" }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Poppins',sans-serif",fontSize:28,fontWeight:800,marginBottom:8 }}>Create New Video ✨</h1>
        <p style={{ color:"var(--text3)",fontSize:15 }}>Fill in the details below and our AI will generate your viral video in seconds.</p>
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:28 }}>
        {/* Topic */}
        <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:24 }}>
          <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--text3)",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.06em" }}>Video Topic *</label>
          <textarea
            value={topic} onChange={e=>setTopic(e.target.value)}
            placeholder="E.g. 5 Habits That Made Me a Millionaire, Why Most People Stay Broke, The Truth About Intermittent Fasting..."
            style={{ width:"100%",background:"var(--bg)",border:"1px solid var(--border2)",color:"var(--text)",borderRadius:10,padding:"13px 16px",fontSize:15,resize:"vertical",minHeight:88,lineHeight:1.6,transition:"border-color 0.2s",fontFamily:"inherit" }}
            onFocus={e=>{ e.target.style.borderColor="var(--primary)";e.target.style.boxShadow="0 0 0 3px rgba(124,58,237,0.15)"; }}
            onBlur={e=>{ e.target.style.borderColor="var(--border2)";e.target.style.boxShadow="none"; }}
          />
          <div style={{ fontSize:12,color:"var(--text4)",marginTop:8 }}>💡 Tip: Be specific for better results — "5 habits" works better than "habits"</div>
        </div>

        {/* Niche */}
        <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:24 }}>
          <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--text3)",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em" }}>Niche</label>
          <div style={{ display:"flex",flexWrap:"wrap",gap:10 }}>
            {NICHES.map(n => (
              <button key={n.id} onClick={() => setNiche(n.id)} style={{
                padding:"8px 16px",borderRadius:100,fontSize:13,fontWeight:600,
                background:niche===n.id ? n.color+"25" : "var(--bg)",
                border:`1px solid ${niche===n.id ? n.color+"60" : "var(--border2)"}`,
                color:niche===n.id ? n.color : "var(--text3)",
                cursor:"pointer",transition:"all 0.18s",
              }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>

        {/* Duration + Voice + Style */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          {/* Duration */}
          <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:20 }}>
            <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--text3)",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.06em" }}>Duration</label>
            <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
              {DURATIONS.map(d => (
                <label key={d.id} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"10px 12px",borderRadius:10,background:duration===d.id?"rgba(124,58,237,0.1)":"transparent",border:`1px solid ${duration===d.id?"rgba(124,58,237,0.3)":"transparent"}`,transition:"all 0.18s" }}>
                  <input type="radio" name="duration" value={d.id} checked={duration===d.id} onChange={()=>setDuration(d.id)} style={{ accentColor:"#7c3aed" }} />
                  <div>
                    <div style={{ fontSize:14,fontWeight:600,color:duration===d.id?"#a78bfa":"var(--text)" }}>{d.label}</div>
                    <div style={{ fontSize:12,color:"var(--text4)" }}>{d.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Voice */}
          <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:20 }}>
            <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--text3)",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.06em" }}>AI Voice</label>
            <div style={{ display:"flex",flexDirection:"column",gap:6 }}>
              {VOICES.map(v => (
                <label key={v.id} style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer",padding:"8px 10px",borderRadius:8,background:voice===v.id?"rgba(124,58,237,0.1)":"transparent",border:`1px solid ${voice===v.id?"rgba(124,58,237,0.3)":"transparent"}`,transition:"all 0.18s" }}>
                  <input type="radio" name="voice" value={v.id} checked={voice===v.id} onChange={()=>setVoice(v.id)} style={{ accentColor:"#7c3aed" }} />
                  <span style={{ fontSize:13,color:"var(--text4)" }}>{v.gender}</span>
                  <div>
                    <div style={{ fontSize:13,fontWeight:600,color:voice===v.id?"#a78bfa":"var(--text)" }}>{v.label}</div>
                    <div style={{ fontSize:11,color:"var(--text4)" }}>{v.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Style */}
        <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:24 }}>
          <label style={{ display:"block",fontSize:13,fontWeight:600,color:"var(--text3)",marginBottom:14,textTransform:"uppercase",letterSpacing:"0.06em" }}>Visual Style</label>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {STYLES.map(s => (
              <button key={s.id} onClick={() => setStyle(s.id)} style={{
                padding:"10px 18px",borderRadius:12,fontSize:13,fontWeight:600,
                background:style===s.id ? s.color+"20" : "var(--bg)",
                border:`1px solid ${style===s.id ? s.color+"50" : "var(--border2)"}`,
                color:style===s.id ? s.color : "var(--text3)",
                cursor:"pointer",transition:"all 0.18s",
              }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <button onClick={handleGenerate} disabled={!topic.trim()} style={{
          width:"100%",
          background: !topic.trim() ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#ec4899)",
          color:"#fff",border:"none",borderRadius:14,padding:"18px",
          fontWeight:800,fontSize:18,cursor:!topic.trim()?"not-allowed":"pointer",
          boxShadow:topic.trim()?"0 6px 28px rgba(124,58,237,0.45)":"none",
          transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center",gap:10,
        }}
          onMouseOver={e=>{ if(topic.trim()){ e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 12px 36px rgba(124,58,237,0.6)"; }}}
          onMouseOut={e=>{ e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow=topic.trim()?"0 6px 28px rgba(124,58,237,0.45)":"none"; }}>
          ⚡ Generate Video in 60 Seconds
        </button>
      </div>
    </div>
  );
}

function VideoGallery() {
  const [filter, setFilter] = useState("all");
  const videos = MOCK_VIDEOS;
  const filtered = filter === "all" ? videos : videos.filter(v => v.status === filter);

  return (
    <div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28,flexWrap:"wrap",gap:14 }}>
        <div>
          <h1 style={{ fontFamily:"'Poppins',sans-serif",fontSize:26,fontWeight:800,marginBottom:4 }}>My Videos 🎬</h1>
          <p style={{ color:"var(--text3)",fontSize:14 }}>{videos.length} videos generated</p>
        </div>
        <div style={{ display:"flex",gap:8 }}>
          {["all","ready","processing"].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding:"7px 16px",borderRadius:100,fontSize:13,fontWeight:600,
              background:filter===f?"linear-gradient(135deg,rgba(124,58,237,0.2),rgba(236,72,153,0.15))":"var(--card)",
              border:`1px solid ${filter===f?"rgba(124,58,237,0.4)":"var(--border2)"}`,
              color:filter===f?"#a78bfa":"var(--text3)",cursor:"pointer",transition:"all 0.18s",
            }}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:20 }}>
        {filtered.map(v => (
          <div key={v.id} style={{
            background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,overflow:"hidden",
            transition:"transform 0.25s,box-shadow 0.25s",cursor:"pointer",
          }}
            onMouseOver={e=>{ e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 40px ${v.color}25`; }}
            onMouseOut={e=>{ e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"; }}>
            {/* Thumbnail */}
            <div style={{ height:160,background:`linear-gradient(135deg,${v.color}30,#0a0a1a)`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative" }}>
              <span style={{ fontSize:52 }}>{v.thumb}</span>
              {/* Status badge */}
              <div style={{
                position:"absolute",top:12,right:12,
                background:v.status==="ready"?"rgba(16,185,129,0.15)":"rgba(245,158,11,0.15)",
                border:`1px solid ${v.status==="ready"?"rgba(16,185,129,0.4)":"rgba(245,158,11,0.4)"}`,
                color:v.status==="ready"?"#6ee7b7":"#fcd34d",
                fontSize:11,fontWeight:700,padding:"4px 10px",borderRadius:100,
                display:"flex",alignItems:"center",gap:5,
              }}>
                {v.status==="ready" ? <><span style={{ width:6,height:6,borderRadius:"50%",background:"#10b981",display:"inline-block" }} />Ready</> : <><span style={{ width:6,height:6,borderRadius:"50%",background:"#f59e0b",display:"inline-block",animation:"pulse 1s infinite" }} />Processing</>}
              </div>
              <div style={{ position:"absolute",bottom:12,left:12,fontSize:11,fontWeight:600,color:"rgba(255,255,255,0.6)",background:"rgba(0,0,0,0.5)",padding:"3px 8px",borderRadius:6 }}>
                {v.duration}s
              </div>
            </div>
            {/* Info */}
            <div style={{ padding:16 }}>
              <div style={{ fontSize:14,fontWeight:700,color:"var(--text)",marginBottom:6,lineHeight:1.4 }}>{v.topic}</div>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
                <div style={{ fontSize:12,color:"var(--text4)" }}>{v.createdAt}</div>
                {v.status === "ready" && <div style={{ fontSize:12,fontWeight:600,color:"#a78bfa" }}>👁 {v.views}</div>}
              </div>
              {v.status === "ready" && (
                <div style={{ display:"flex",gap:8 }}>
                  <button style={{ flex:1,background:"linear-gradient(135deg,#7c3aed,#ec4899)",color:"#fff",border:"none",borderRadius:8,padding:"8px",fontWeight:600,fontSize:12,cursor:"pointer" }}>⬇️ Download</button>
                  <button style={{ flex:1,background:"var(--bg)",color:"var(--text3)",border:"1px solid var(--border2)",borderRadius:8,padding:"8px",fontWeight:600,fontSize:12,cursor:"pointer" }}>📤 Share</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  const stats = [
    { label:"Total Views",value:"812,000",change:"+24%",up:true },
    { label:"Total Videos",value:"6",change:"+6 this month",up:true },
    { label:"Avg Engagement",value:"8.4%",change:"+1.2%",up:true },
    { label:"Est. Revenue",value:"$2,840",change:"+$420",up:true },
  ];

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Poppins',sans-serif",fontSize:26,fontWeight:800,marginBottom:4 }}>Analytics 📊</h1>
        <p style={{ color:"var(--text3)",fontSize:14 }}>Last 30 days performance</p>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:16,marginBottom:32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:24 }}>
            <div style={{ fontSize:13,color:"var(--text3)",marginBottom:8 }}>{s.label}</div>
            <div style={{ fontFamily:"'Poppins',sans-serif",fontSize:28,fontWeight:800,marginBottom:6 }}>{s.value}</div>
            <div style={{ fontSize:12,color:"#10b981",fontWeight:600 }}>{s.change}</div>
          </div>
        ))}
      </div>
      <div style={{ background:"var(--card)",border:"1px solid var(--border2)",borderRadius:16,padding:24,display:"flex",alignItems:"center",justifyContent:"center",height:220,color:"var(--text3)",fontSize:15 }}>
        📈 Detailed charts available on Pro plan — <span style={{ color:"#a78bfa",cursor:"pointer",marginLeft:4 }}>Upgrade</span>
      </div>
    </div>
  );
}

/* ─── MAIN DASHBOARD ─── */
export default function DashboardPage({ onLogout, onUpgrade, user }) {
  const [activeTab, setActiveTab] = useState("create");
  const [videosCount, setVideosCount] = useState(MOCK_VIDEOS.length);

  const handleGenerated = () => setVideosCount(c => c + 1);

  const renderContent = () => {
    switch (activeTab) {
      case "create":    return <CreatePanel onGenerated={handleGenerated} />;
      case "videos":    return <VideoGallery />;
      case "analytics": return <Analytics />;
      default:
        return (
          <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"50vh",color:"var(--text3)",fontSize:16 }}>
            🚧 {activeTab.charAt(0).toUpperCase()+activeTab.slice(1)} coming soon
          </div>
        );
    }
  };

  return (
    <div style={{ display:"flex",minHeight:"100vh",background:"var(--bg)" }}>
      <Sidebar active={activeTab} onNav={setActiveTab} user={user} onLogout={onLogout} />
      <main style={{ flex:1,padding:"32px 36px",overflowY:"auto",minHeight:"100vh" }}>
        {renderContent()}
      </main>
    </div>
  );
}

/* ─── HELPER ─── */
function generateMockScript(topic, niche) {
  const hooks = {
    finance:    "Here's the SHOCKING truth about money that nobody tells you...",
    motivation: "If you want to change your life, watch this right now...",
    education:  "Did you know this fact that most people completely miss?",
    health:     "Stop doing this one thing that's destroying your health...",
    default:    "You won't believe what I'm about to share with you...",
  };
  const hook = hooks[niche] || hooks.default;

  return `HOOK: ${hook}

MAIN CONTENT:
Today we're talking about "${topic}" — and this could genuinely change the way you think.

Point 1: Most people never realize how important this is until it's too late.

Point 2: The research shows something fascinating — when you apply this principle consistently, results follow within 30 days.

Point 3: Here's the simple action you can take TODAY to get started.

CALL TO ACTION:
Follow for more content like this. Drop a comment below — have you tried this before?

OUTRO:
Stay consistent. Small actions, repeated daily, create massive results.`;
}
