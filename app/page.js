"use client";
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SentimentHero from "@/components/dashboard/SentimentHero";
import EntityChart from "@/components/dashboard/EntityChart";
import ThemeList from "@/components/dashboard/ThemeList";
import InsightCards from "@/components/dashboard/InsightCards";
import HistoryGrid from "@/components/dashboard/HistoryGrid";
import ProgressLoader from "@/components/dashboard/ProgressLoader";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Play } from "lucide-react";

export default function Home() {
  const [viewState, setViewState] = useState("HUB"); // HUB, ANALYZING, VIEWING
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Progress State
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState("Starting...");

  // Load History on Mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem("sentiment_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  }, []);

  // Save Analysis to History
  function saveToHistory(result) {
    const newItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: result
    };
    const updated = [newItem, ...history];
    setHistory(updated);
    localStorage.setItem("sentiment_history", JSON.stringify(updated));
    return newItem;
  }

  // Delete Item
  function deleteHistory(id) {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("sentiment_history", JSON.stringify(updated));
  }

  async function runAnalysis() {
    setViewState("ANALYZING");
    setProgress(0);
    setProgressStatus("Connecting...");

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
        
        // Process buffer line by line
        const lines = buffer.split("\n");
        buffer = lines.pop(); // Keep incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const msg = JSON.parse(line);
            
            if (msg.progress) {
              setProgress(msg.progress);
              if (msg.status) setProgressStatus(msg.status);
            }

            if (msg.result) {
              saveToHistory(msg.result);
              setAnalysis(msg.result);
              setLastUpdated(new Date().toLocaleTimeString());
              // Small delay to show 100% completion before switching
              setTimeout(() => setViewState("VIEWING"), 800);
            }
            
            if (msg.error) {
                alert("Error: " + msg.error);
                setViewState("HUB");
            }
          } catch (e) {
            console.error("Stream parse error", e);
          }
        }
      }

    } catch (e) {
      console.error("Analysis failed", e);
      setViewState("HUB");
    }
  }

  function openAnalysis(item) {
    setAnalysis(item.data);
    setLastUpdated(new Date(item.timestamp).toLocaleTimeString());
    setViewState("VIEWING");
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30">
      <DashboardHeader 
        onRefresh={runAnalysis} 
        isRefreshing={viewState === "ANALYZING"} 
        lastUpdated={lastUpdated} 
        showHome={viewState === "VIEWING"}
        onHome={() => setViewState("HUB")}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <AnimatePresence mode="wait">
          {/* STATE: HUB (HISTORY) */}
          {viewState === "HUB" && (
            <motion.div 
              key="hub"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-12"
            >
              {/* Hero Action */}
              <div className="text-center space-y-6 py-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 text-xs font-medium text-zinc-500 border border-zinc-200 dark:border-zinc-800">
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>AI-Powered Sentiment Engine</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold tracking-tighter bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500 bg-clip-text text-transparent">
                  Analyze Public Pulse.
                </h2>
                
                <p className="max-w-xl mx-auto text-lg text-zinc-500">
                  Instantly decode social sentiment, polarizing topics, and public demands using advanced AI.
                </p>

                <div className="flex justify-center">
                  <button 
                    onClick={runAnalysis}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-white transition-all duration-200 bg-zinc-900 dark:bg-white dark:text-zinc-900 rounded-full hover:scale-105 focus:outline-none ring-offset-2 focus:ring-2 ring-zinc-900 dark:ring-white"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    Start New Analysis
                    <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 animate-pulse" />
                  </button>
                </div>
              </div>

              {/* History Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider pl-1">
                  Recent Snapshots
                </h3>
                {isMounted ? (
                  <HistoryGrid 
                    history={history} 
                    onView={openAnalysis} 
                    onDelete={deleteHistory} 
                  />
                ) : (
                   <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-2xl animate-pulse" />
                )}
              </div>
            </motion.div>
          )}

          {/* STATE: ANALYZING (LOADER) */}
          {viewState === "ANALYZING" && (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressLoader progress={progress} status={progressStatus} />
            </motion.div>
          )}

          {/* STATE: VIEWING (DASHBOARD) */}
          {viewState === "VIEWING" && analysis && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="space-y-8">
                <SentimentHero analysis={analysis.analysis} />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                  <EntityChart data={analysis.statistical_data?.entity_sentiments} />
                  <div className="col-span-1">
                    <ThemeList themes={analysis.statistical_data?.top_themes} />
                  </div>
                </div>

                <InsightCards 
                  reasons={analysis.analysis?.reasons_for_sentiment} 
                  demands={analysis.analysis?.demands} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
