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
      maturityLevel: avg >= 7 ? "Advanced User" : avg >= 5 ? "Develop
