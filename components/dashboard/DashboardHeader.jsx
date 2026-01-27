"use client";
import { motion } from "framer-motion";
import { RefreshCw, Activity, ArrowLeft } from "lucide-react";
import clsx from "clsx";

export default function DashboardHeader({ onRefresh, isRefreshing, lastUpdated, onHome, showHome }) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showHome ? (
             <button 
               onClick={onHome}
               className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group"
             >
               <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-zinc-900 dark:group-hover:text-white" />
             </button>
          ) : (
            <div className="p-2 bg-zinc-900 dark:bg-white rounded-lg">
               <Activity className="w-5 h-5 text-white dark:text-zinc-900" />
            </div>
          )}
          
          <div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-none">
              Country Sentiment
            </h1>
            <p className="text-xs text-zinc-500 font-medium">
              AI-Powered Social Analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="hidden sm:block text-xs text-zinc-500 font-mono">
              Last updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={clsx(
              "group relative overflow-hidden rounded-full bg-zinc-900 dark:bg-white px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50",
              isRefreshing && "cursor-not-allowed"
            )}
          >
            <div className="flex items-center gap-2 relative z-10">
              <RefreshCw 
                className={clsx(
                  "w-4 h-4",
                  isRefreshing && "animate-spin"
                )} 
              />
              <span>{isRefreshing ? "Analyzing..." : "Refresh Analysis"}</span>
            </div>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
