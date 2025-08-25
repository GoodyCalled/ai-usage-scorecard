import React, { useMemo, useRef, useState } from "react";

export default function AIUsageScorecard() {
  // Five benchmark categories (0-10)
  const [volume, setVolume] = useState(9);
  const [breadth, setBreadth] = useState(8.5);
  const [depth, setDepth] = useState(9);
  const [systemization, setSystemization] = useState(5);
  const [creative, setCreative] = useState(2);
  const [dark, setDark] = useState(false);
  const [status, setStatus] = useState("");
  const [showTooltip, setShowTooltip] = useState("");

  const cardRef = useRef(null);

  const categories = useMemo(
    () => [
      { 
        key: "volume", 
        label: "Volume", 
        value: volume, 
        setter: setVolume, 
        hint: "How often do you use AI?",
        description: "Daily usage frequency, from occasional to constant integration"
      },
      { 
        key: "breadth", 
        label: "Breadth", 
        value: breadth, 
        setter: setBreadth, 
        hint: "How many domains (content, strategy, ops, R&D)?",
        description: "Scope across different work areas and use cases"
      },
      { 
        key: "depth", 
        label: "Depth", 
        value: depth, 
        setter: setDepth, 
        hint: "How iterative/strategic (rounds, frameworks, synthesis)?",
        description: "Sophistication of workflows and multi-step processes"
      },
      { 
        key: "systemization", 
        label: "Systemization", 
        value: systemization, 
        setter: setSystemization, 
        hint: "Templates, workflows, dashboards, automations.",
        description: "Organized processes, templates, and automated workflows"
      },
      { 
        key: "creative", 
        label: "Creative Production", 
        value: creative, 
        setter: setCreative, 
        hint: "Visuals, audio, video, design assets.",
        description: "Using AI for multimedia content and creative assets"
      },
    ],
    [volume, breadth, depth, systemization, creative]
  );

  const avg = useMemo(() => {
    const vals = categories.map((c) => Number(c.value));
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    return Math.round(mean * 10) / 10;
  }, [categories]);

  // Enhanced insights
  const insights = useMemo(() => {
    const suggestions = [];
    const strengths = [];
    
    categories.forEach(cat => {
      const score = Number(cat.value);
      if (score >= 7) {
        strengths.push(cat.label.toLowerCase());
      } else if (score < 4) {
        suggestions.push(`Consider expanding ${cat.label.toLowerCase()}`);
      }
    });

    // Pattern recognition
    if (volume >= 8 && depth >= 8 && systemization < 6) {
      suggestions.push("High usage + depth but low systemization = opportunity for efficiency gains");
    }
    
    if (breadth >= 7 && creative < 5) {
      suggestions.push("Multi-domain user who could explore creative AI applications");
    }

    return {
      strengths: strengths.length ? `Strong in: ${strengths.join(', ')}` : "Building foundational skills",
      suggestions: suggestions.slice(0, 2), // Top 2 suggestions
      maturityLevel: avg >= 7 ? "Advanced User" : avg >= 5 ? "Developing User" : "Beginning User"
    };
  }, [categories, avg]);

  // Color helpers
  const COLORS = {
    bgLight: "#f8fafc",
    textLight: "#0f172a",
    bgDark: "#0b1220",
    textDark: "#f1f5f9",
    panelLight: "#ffffff",
    panelDark: "#101827",
    borderLight: "#e2e8f0",
    borderDark: "#1f2937",
    green: "#22c55e",
    yellow: "#f59e0b",
    red: "#ef4444",
    indigo: "#4f46e5",
    blue: "#3b82f6",
  };

  function stoplightHex(v) {
    const pct = Number(v) / 10;
    if (pct >= 0.7) return COLORS.green;
    if (pct >= 0.4) return COLORS.yellow;
    return COLORS.red;
  }

  function stoplightText(v) {
    const pct = Number(v) / 10;
    if (pct >= 0.7) return "Strong";
    if (pct >= 0.4) return "Developing";
    return "Untapped";
  }

  // Enhanced export with proper canvas rendering
  async function downloadPNG(blank = false) {
    if (!cardRef.current) return;
    setStatus("Preparing export...");

    const original = categories.map(c => c.value);
    
    if (blank) {
      // Set all to 0 for blank template
      categories.forEach(cat => cat.setter(0));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    try {
      // Create a simple canvas-based export since html2canvas isn't available
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 800;
      canvas.height = 600;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Title
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('AI Usage Scorecard', 50, 60);

      // Draw categories
      let y = 120;
      categories.forEach((cat, i) => {
        // Category name
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#000000';
        ctx.fillText(cat.label, 50, y);
        
        // Score
        ctx.font = 'bold 16px Arial';
        ctx.fillText(`${cat.value}/10`, 700, y);
        
        // Progress bar background
        ctx.fillStyle = '#e5e7eb';
        ctx.fillRect(50, y + 10, 400, 20);
        
        // Progress bar fill
        ctx.fillStyle = stoplightHex(cat.value);
        ctx.fillRect(50, y + 10, (cat.value / 10) * 400, 20);
        
        y += 80;
      });

      // Average
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#000000';
      ctx.fillText(`Average: ${avg}/10`, 50, y + 40);
      ctx.fillText(`Level: ${insights.maturityLevel}`, 50, y + 80);

      // Convert to blob and download
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = blank ? 'ai-scorecard-blank.png' : 'ai-scorecard.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setStatus("Downloaded ✓");
        setTimeout(() => setStatus(""), 2000);
      });

    } catch (error) {
      console.error('Export failed:', error);
      setStatus("Export failed");
    }

    // Restore original values if blank export
    if (blank) {
      categories.forEach((cat, i) => cat.setter(original[i]));
    }
  }

  function copySummary() {
    const lines = [
      "🤖 AI Usage Scorecard Results",
      "=" + "=".repeat(30),
      "",
      ...categories.map(cat => `${cat.label}: ${cat.value}/10 (${stoplightText(cat.value)})`),
      "",
      `📊 Overall Average: ${avg}/10`,
      `🎯 Maturity Level: ${insights.maturityLevel}`,
      "",
      `💪 ${insights.strengths}`,
      "",
      "🚀 Growth Opportunities:",
      ...insights.suggestions.map(s => `• ${s}`),
    ];

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(lines.join("\n"));
      setStatus("Summary copied ✓");
      setTimeout(() => setStatus(""), 2000);
    }
  }

  function setPreset(preset) {
    switch(preset) {
      case 'beginner':
        setVolume(3); setBreadth(2); setDepth(2); setSystemization(1); setCreative(1);
        break;
      case 'intermediate':
        setVolume(6); setBreadth(5); setDepth(4); setSystemization(3); setCreative(3);
        break;
      case 'advanced':
        setVolume(9); setBreadth(8); setDepth(8); setSystemization(7); setCreative(6);
        break;
      case 'melissa':
        setVolume(9); setBreadth(8.5); setDepth(9); setSystemization(5); setCreative(2);
        break;
      default:
        setVolume(5); setBreadth(5); setDepth(5); setSystemization(5); setCreative(5);
    }
  }

  // Styles
  const pageStyle = {
    minHeight: "100vh",
    backgroundColor: dark ? COLORS.bgDark : COLORS.bgLight,
    color: dark ? COLORS.textDark : COLORS.textLight,
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "all 0.2s ease",
  };

  const containerStyle = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2rem 1rem",
  };

  const panelStyle = {
    backgroundColor: dark ? COLORS.panelDark : COLORS.panelLight,
    border: `1px solid ${dark ? COLORS.borderDark : COLORS.borderLight}`,
    borderRadius: "1rem",
    padding: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    transition: "all 0.2s ease",
  };

  const buttonStyle = (bg, color = "#ffffff") => ({
    backgroundColor: bg,
    color,
    border: "none",
    borderRadius: "0.5rem",
    padding: "0.5rem 1rem",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "0.9rem",
    transition: "all 0.2s ease",
  });

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ flex: 1, minWidth: "300px" }}>
            <h1 style={{ fontSize: "3rem", fontWeight: "800", margin: 0, lineHeight: 1.1 }}>
              AI Usage Scorecard
            </h1>
            <p style={{ fontSize: "1.2rem", opacity: 0.8, margin: "0.5rem 0 0 0" }}>
              Benchmark your AI capabilities across five key dimensions
            </p>
          </div>
          <button 
            onClick={() => setDark(!dark)} 
            style={buttonStyle(dark ? COLORS.panelLight : COLORS.panelDark, dark ? COLORS.textLight : COLORS.textDark)}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
          <button onClick={() => setPreset('beginner')} style={buttonStyle(COLORS.red)}>Beginner</button>
          <button onClick={() => setPreset('intermediate')} style={buttonStyle(COLORS.yellow, "#000")}>Intermediate</button>
          <button onClick={() => setPreset('advanced')} style={buttonStyle(COLORS.green)}>Advanced</button>
          <button onClick={() => setPreset('melissa')} style={buttonStyle(COLORS.indigo)}>Melissa's Benchmark</button>
          <button onClick={() => setPreset('reset')} style={buttonStyle("#6b7280")}>Reset (5s)</button>
          <button onClick={() => downloadPNG(false)} style={buttonStyle(COLORS.blue)}>📥 Download PNG</button>
          <button onClick={() => downloadPNG(true)} style={buttonStyle("#f97316")}>📄 Download Blank</button>
          <button onClick={copySummary} style={buttonStyle("#8b5cf6")}>📋 Copy Summary</button>
          {status && <span style={{ alignSelf: "center", fontSize: "0.9rem", opacity: 0.8 }}>{status}</span>}
        </div>

        {/* Main Content */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
          {/* Scorecard */}
          <div ref={cardRef} style={panelStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontSize: "2rem", fontWeight: "700", margin: 0 }}>Your Assessment</h2>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>Overall Score</div>
                <div style={{ fontSize: "3rem", fontWeight: "800", color: stoplightHex(avg) }}>{avg}/10</div>
                <div style={{ fontSize: "0.9rem", fontWeight: "600" }}>{insights.maturityLevel}</div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "1.5rem" }}>
              {categories.map((cat) => (
                <div key={cat.key} style={{
                  ...panelStyle,
                  padding: "1.25rem",
                  position: "relative",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <h3 style={{ fontSize: "1.3rem", fontWeight: "700", margin: 0 }}>{cat.label}</h3>
                        <button 
                          onMouseEnter={() => setShowTooltip(cat.key)}
                          onMouseLeave={() => setShowTooltip("")}
                          style={{ background: "none", border: "none", cursor: "help", fontSize: "1rem" }}
                        >
                          ℹ️
                        </button>
                      </div>
                      <p style={{ fontSize: "0.9rem", opacity: 0.7, margin: "0.25rem 0 0 0" }}>{cat.hint}</p>
                      {showTooltip === cat.key && (
                        <div style={{
                          position: "absolute",
                          top: "100%",
                          left: 0,
                          right: 0,
                          backgroundColor: dark ? COLORS.bgDark : COLORS.bgLight,
                          border: `1px solid ${dark ? COLORS.borderDark : COLORS.borderLight}`,
                          borderRadius: "0.5rem",
                          padding: "0.75rem",
                          fontSize: "0.85rem",
                          zIndex: 10,
                          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                        }}>
                          {cat.description}
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "1.5rem", fontWeight: "800" }}>{cat.value}/10</div>
                      <div style={{ 
                        fontSize: "0.8rem", 
                        fontWeight: "600",
                        color: stoplightHex(cat.value),
                        textTransform: "uppercase"
                      }}>
                        {stoplightText(cat.value)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: "1rem" }}>
                    <div style={{
                      height: "0.75rem",
                      backgroundColor: dark ? "#1f2937" : "#e5e7eb",
                      borderRadius: "9999px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${(cat.value / 10) * 100}%`,
                        backgroundColor: stoplightHex(cat.value),
                        borderRadius: "9999px",
                        transition: "all 0.3s ease"
                      }} />
                    </div>
                  </div>

                  {/* Slider */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontSize: "0.8rem", minWidth: "1rem" }}>0</span>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={cat.value}
                      onChange={(e) => cat.setter(Number(e.target.value))}
                      style={{ 
                        flex: 1, 
                        accentColor: stoplightHex(cat.value),
                        height: "0.5rem"
                      }}
                    />
                    <span style={{ fontSize: "0.8rem", minWidth: "1rem" }}>10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights Panel */}
          <div style={panelStyle}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginTop: 0 }}>📊 Your AI Profile</h3>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Maturity Level:</strong> {insights.maturityLevel}
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <strong>Strengths:</strong> {insights.strengths}
            </div>
            {insights.suggestions.length > 0 && (
              <div>
                <strong>Growth Opportunities:</strong>
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.5rem" }}>
                  {insights.suggestions.map((suggestion, i) => (
                    <li key={i} style={{ marginBottom: "0.25rem" }}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Legend and Tips */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            <div style={panelStyle}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: 0 }}>🚦 Score Legend</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {[
                  { range: "7-10", label: "Strong", color: COLORS.green, desc: "Well-developed capability" },
                  { range: "4-6.5", label: "Developing", color: COLORS.yellow, desc: "Growing competency" },
                  { range: "0-3.5", label: "Untapped", color: COLORS.red, desc: "Opportunity area" }
                ].map(item => (
                  <div key={item.range} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div style={{
                      width: "1rem",
                      height: "1rem",
                      backgroundColor: item.color,
                      borderRadius: "50%"
                    }} />
                    <div>
                      <strong>{item.range}:</strong> {item.label} <span style={{ opacity: 0.7 }}>({item.desc})</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginTop: 0 }}>💡 Usage Tips</h3>
              <ul style={{ paddingLeft: "1.25rem", fontSize: "0.9rem", lineHeight: 1.6 }}>
                <li>Be honest about current state, not aspirational goals</li>
                <li>Consider the past 3-6 months of usage patterns</li>
                <li>Think about both personal and professional contexts</li>
                <li>Download the blank version to share with your team</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ 
          textAlign: "center", 
          marginTop: "3rem", 
          opacity: 0.6, 
          fontSize: "0.85rem" 
        }}>
          AI Usage Scorecard • Share your results and help others benchmark their AI journey
        </footer>
      </div>
    </div>
  );
}
