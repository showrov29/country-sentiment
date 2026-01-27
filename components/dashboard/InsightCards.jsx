"use client";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle, CheckCircle2, Megaphone } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function InsightCards({ reasons = [], demands = [] }) {
  // Helper to strip Markdown bolding for cleaner titles
  const cleanText = (text) => text.replace(/\*\*/g, '').split(':')[0];
  const getBody = (text) => {
    const parts = text.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : text;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* REASONS COLUMN */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Key Drivers</h3>
        </div>

        {reasons.map((reason, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="group relative p-5 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors"
          >
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 group-hover:text-emerald-500 transition-colors">
              {cleanText(reason)}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {getBody(reason)}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* DEMANDS COLUMN */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Public Demands</h3>
        </div>

        {demands.map((demand, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl"
          >
            <div className="flex-shrink-0 mt-1">
              <CheckCircle2 className="w-5 h-5 text-emerald-500/50" />
            </div>
            <div>
              <h4 className="font-medium text-zinc-800 dark:text-zinc-300 mb-1">
                {cleanText(demand)}
              </h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {getBody(demand)}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
