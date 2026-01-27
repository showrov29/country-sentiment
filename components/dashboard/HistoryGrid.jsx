"use client";
import { motion } from "framer-motion";
import { Calendar, Trash2, ArrowRight } from "lucide-react";
import clsx from "clsx";

export default function HistoryGrid({ history = [], onView, onDelete }) {
  if (history.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <p className="text-zinc-500">No history found. Start a new analysis!</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((item, index) => {
        const sentiment = item.data.analysis.overall_sentiment || "";
        // Extract a short preview (first 100 chars)
        const preview = sentiment.length > 100 ? sentiment.substring(0, 100) + "..." : sentiment;
        
        // Determine color theme based on text (naive check for now, or use stored score)
        const isNegative = sentiment.toLowerCase().includes("negative") || sentiment.toLowerCase().includes("polarized");
        
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex flex-col justify-between bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all hover:shadow-xl cursor-pointer"
            onClick={() => onView(item)}
          >
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className={clsx(
                  "px-2 py-1 rounded-md text-xs font-medium",
                  isNegative 
                    ? "bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400"
                    : "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                )}>
                  {isNegative ? "High Tension" : "General"}
                </span>
                <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed mb-4">
                "{preview}"
              </h3>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="p-2 text-zinc-400 hover:text-rose-500 transition-colors rounded-full hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1 text-xs font-semibold text-zinc-900 dark:text-white group-hover:gap-2 transition-all">
                View Report <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
