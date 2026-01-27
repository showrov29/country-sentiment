"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

// Dynamic imports for 3D components (no SSR)
const CoreScene = dynamic(() => import("@/components/dashboard/CoreScene"), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#030712]" />
});

// Regular imports
import CommandBar from "@/components/dashboard/CommandBar";
import {
  HoloPanel,
  SentimentPanel,
  EntityPanel,
  ThemesPanel,
  DemandsPanel,
  StatusPanel,
  HistoryCard
} from "@/components/dashboard/HolographicPanel";

export default function Home() {
  // App State
  const [viewState, setViewState] = useState("idle"); // "idle" | "analyzing" | "result"
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // Analysis Progress
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Initializing...");

  // Mount & Load History
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("sentiment_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history:", e);
    }
  }, []);

  // Save Analysis to History (must be defined before runAnalysis)
  const saveToHistory = useCallback((result) => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: result
    };
    setHistory(prev => {
      const updated = [newItem, ...prev].slice(0, 20); // Keep last 20
      localStorage.setItem("sentiment_history", JSON.stringify(updated));
      return updated;
    });
    return newItem;
  }, []);

  // Run Analysis
  const runAnalysis = useCallback(async () => {
    setViewState("analyzing");
    setProgress(0);
    setProgressStatus("Connecting to AI Core...");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.body) throw new Error("No stream body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            
            if (msg.progress !== undefined) {
              setProgress(msg.progress);
              if (msg.status) setProgressStatus(msg.status);
            }

            if (msg.result) {
              saveToHistory(msg.result);
              setAnalysis(msg.result);
              // Smooth transition to results
              setTimeout(() => setViewState("result"), 600);
            }
            
            if (msg.error) {
              console.error("Analysis error:", msg.error);
              setViewState("idle");
            }
          } catch (e) {
            console.error("Stream parse error:", e);
          }
        }
      }

    } catch (e) {
      console.error("Analysis failed:", e);
      setViewState("idle");
    }
  }, [saveToHistory]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && viewState !== "analyzing") {
        e.preventDefault();
        runAnalysis();
      }
      if (e.code === "Escape" && viewState !== "idle") {
        setViewState("idle");
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewState, runAnalysis]);

  // View History Item
  function openAnalysis(item) {
    setAnalysis(item.data);
    setViewState("result");
  }

  // Get sentiment for 3D scene
  const currentSentiment = analysis?.analysis?.overall_sentiment || "neutral";

  return (
    <div className="relative min-h-screen h-screen-safe bg-[#030712] text-white overflow-hidden overscroll-contain">
      
      {/* 3D Core Scene - Always Visible */}
      <CoreScene 
        state={viewState}
        sentiment={currentSentiment}
        progress={progress}
      />

      {/* Main Content Layer */}
      <div className="relative z-content h-full">
        
        <AnimatePresence mode="wait">
          {/* ============================================
              IDLE STATE - Hub / Welcome
              ============================================ */}
          {viewState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col lg:flex-row"
            >
              {/* Left Side - Hero Text */}
              <div className="flex-1 flex flex-col justify-center items-center lg:items-start p-8 lg:p-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="max-w-xl space-y-6 text-center lg:text-left"
                >
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-xs font-mono text-white/50 uppercase tracking-widest">
                      AI Sentiment Core
                    </span>
                  </div>

                  {/* Main Title */}
                  <h1 className="text-display gradient-text">
                    Decode
                    <br />
                    Public Pulse
                  </h1>

                  {/* Subtitle */}
                  <p className="text-lg text-white/50 max-w-md">
                    Advanced AI-powered analysis of social sentiment, 
                    entity polarization, and public demands from real-time data streams.
                  </p>

                  {/* Stats */}
                  <div className="flex gap-8 pt-4">
                    <div>
                      <p className="text-3xl font-bold text-white">{history.length}</p>
                      <p className="text-xs text-white/40 font-mono uppercase">Scans</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">Gemini</p>
                      <p className="text-xs text-white/40 font-mono uppercase">AI Model</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-white">বাংলা</p>
                      <p className="text-xs text-white/40 font-mono uppercase">Language</p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Side - History */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-full lg:w-96 p-6 lg:p-8 overflow-y-auto max-h-[40vh] lg:max-h-full"
              >
                <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">
                  Recent Scans
                </h2>
                
                {isMounted && history.length > 0 ? (
                  <div className="space-y-3">
                    {history.slice(0, 8).map((item, i) => (
                      <HistoryCard
                        key={item.id}
                        item={item}
                        index={i}
                        onView={openAnalysis}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-dashed border-white/10 text-center">
                    <p className="text-sm text-white/30">
                      No previous scans found.
                      <br />
                      Start your first analysis!
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {/* ============================================
              ANALYZING STATE - Progress
              ============================================ */}
          {viewState === "analyzing" && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center p-8"
            >
              <div className="w-full max-w-md">
                <StatusPanel progress={progress} status={progressStatus} />
                
                {/* Additional Status Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 text-center space-y-2"
                >
                  <p className="text-sm text-white/30 font-mono">
                    The Core is processing social data...
                  </p>
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                        className="w-1.5 h-1.5 rounded-full bg-indigo-500"
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* ============================================
              RESULT STATE - Analysis Dashboard
              ============================================ */}
          {viewState === "result" && analysis && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="h-full overflow-y-auto"
            >
              {/* Scrollable Container with proper padding */}
              <div className="min-h-full grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 lg:p-8 pb-32">
                
                {/* Left Column */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {/* Sentiment Display */}
                    <SentimentPanel
                      sentiment={analysis.analysis?.overall_sentiment}
                      score={analysis.analysis?.confidence_score}
                      reasons={analysis.analysis?.reasons_for_sentiment}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Entity Polarization */}
                    <EntityPanel 
                      entities={analysis.statistical_data?.entity_sentiments}
                    />
                  </motion.div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {/* Themes */}
                    <ThemesPanel 
                      themes={analysis.statistical_data?.top_themes}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {/* Demands */}
                    <DemandsPanel 
                      demands={analysis.analysis?.demands}
                    />
                  </motion.div>
                  
                  {/* Raw Data Toggle (Optional) */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <HoloPanel className="p-4">
                      <details className="group">
                        <summary className="cursor-pointer text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                          <span>Raw Data</span>
                          <span className="text-white/20 group-open:rotate-90 transition-transform">
                            ▶
                          </span>
                        </summary>
                        <pre className="mt-4 p-4 bg-black/50 rounded-lg text-xs text-white/50 overflow-auto max-h-60 font-mono">
                          {JSON.stringify(analysis, null, 2)}
                        </pre>
                      </details>
                    </HoloPanel>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Command Bar - Always at Bottom */}
      <CommandBar
        state={viewState}
        progress={progress}
        onAnalyze={runAnalysis}
        onHome={() => setViewState("idle")}
        onHistory={() => setViewState("idle")}
        disabled={viewState === "analyzing"}
      />

      {/* Ambient Glow Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top Left Glow */}
        <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-indigo-500/10 rounded-full blur-[120px]" />
        {/* Bottom Right Glow */}
        <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
