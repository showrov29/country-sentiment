"use client";
import { motion } from "framer-motion";

export default function SentimentHero({ analysis }) {
  if (!analysis?.overall_sentiment) return null;

  // Simple keyword highlighter (this could be improved with NLP, but regex works for now)
  const text = analysis.overall_sentiment;
  const highlightRegex = /(polarized|support|solidarity|negative|frustration|biased|manipulative|integrity|misconduct)/gi;
  
  const parts = text.split(highlightRegex);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 sm:p-12"
    >
      {/* Animated Background Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-[50%] -left-[20%] w-[80%] h-[150%] rounded-full bg-emerald-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[120%] rounded-full bg-rose-500/10 blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="relative z-10 max-w-4xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center rounded-full bg-zinc-200 dark:bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:text-zinc-300">
            Executive Summary
          </span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium leading-relaxed text-zinc-900 dark:text-white tracking-tight">
          {parts.map((part, i) => {
            const isHighlight = part.match(highlightRegex);
            return isHighlight ? (
              <span 
                key={i} 
                className="font-bold bg-gradient-to-r from-emerald-500 to-teal-500 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent decoration-emerald-200 dark:decoration-emerald-800 decoration-2 underline-offset-4"
              >
                {part}
              </span>
            ) : (
              <span key={i} className="text-zinc-600 dark:text-zinc-300">{part}</span>
            );
          })}
        </h2>
      </div>
    </motion.section>
  );
}
