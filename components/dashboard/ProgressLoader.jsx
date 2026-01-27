"use client";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function ProgressLoader({ progress = 0, status = "Initializing..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8">
      {/* Percentage Circle */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Background Ring */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-200 dark:text-zinc-800"
          />
          {/* Progress Ring */}
          <motion.circle
            cx="64"
            cy="64"
            r="60"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-zinc-900 dark:text-white"
            initial={{ strokeDasharray: 377, strokeDashoffset: 377 }}
            animate={{ strokeDashoffset: 377 - (377 * progress) / 100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            strokeLinecap="round"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-zinc-900 dark:text-white font-mono">
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* Status Text */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white flex items-center justify-center gap-2">
            {status}
            {progress < 100 && <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />}
        </h3>
        <p className="text-sm text-zinc-500">Live processing from secure backend.</p>
      </div>
    </div>
  );
}
