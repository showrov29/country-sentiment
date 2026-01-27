"use client";
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import SentimentHero from "@/components/dashboard/SentimentHero";
import EntityChart from "@/components/dashboard/EntityChart";
import ThemeList from "@/components/dashboard/ThemeList";
import InsightCards from "@/components/dashboard/InsightCards";

export default function Home() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  async function runAnalysis() {
    setLoading(true);
    try {
      // 1. Fetch Raw Comments (Mocked currently)
      const resYoutube = await fetch("/api/youtube");
      const youtubeData = await resYoutube.json();

      // 2. Flatten Data structure: [{ videoId, comments: [] }] -> [ { text, ... } ]
      let allComments = [];
      if (Array.isArray(youtubeData)) {
        allComments = youtubeData.flatMap(video => 
          video.comments.map(c => ({
            text: c.text,
            likes: c.likes,
            videoId: video.videoId // keep reference if needed
          }))
        );
      } else if (youtubeData.videos) {
         // Handle if API returns { videos: [...] }
         allComments = youtubeData.videos.flatMap(video => video.comments);
      }

      // 3. Send to Gemini Analyzer
      const resAnalyze = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tweets: allComments }), // reusing 'tweets' key expected by analyzer
      });
      
      const data = await resAnalyze.json();
      
      if (data.ok && data.result) {
        setAnalysis(data.result);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error("Analysis failed", e);
    } finally {
      setLoading(false);
    }
  }

  // Auto-run on mount
  useEffect(() => {
    runAnalysis();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100 font-sans selection:bg-emerald-500/30">
      <DashboardHeader 
        onRefresh={runAnalysis} 
        isRefreshing={loading} 
        lastUpdated={lastUpdated} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Loading Skeleton or Content */}
        {loading && !analysis ? (
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-zinc-200 dark:bg-zinc-900 rounded-3xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-zinc-200 dark:bg-zinc-900 rounded-3xl" />
              <div className="h-96 bg-zinc-200 dark:bg-zinc-900 rounded-3xl" />
            </div>
          </div>
        ) : analysis ? (
          <>
            <SentimentHero analysis={analysis.analysis} />
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Entity Chart takes 2/3 width on large screens */}
              <EntityChart data={analysis.statistical_data?.entity_sentiments} />
              
              {/* Theme List takes 1/3 width */}
              <div className="col-span-1">
                <ThemeList themes={analysis.statistical_data?.top_themes} />
              </div>
            </div>

            <InsightCards 
              reasons={analysis.analysis?.reasons_for_sentiment} 
              demands={analysis.analysis?.demands} 
            />
          </>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            Click "Refresh Analysis" to start.
          </div>
        )}
      </main>
    </div>
  );
}
