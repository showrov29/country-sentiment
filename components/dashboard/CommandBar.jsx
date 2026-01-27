"use client";
import { motion } from "framer-motion";
import { 
  Play, 
  RotateCcw, 
  History, 
  Home,
  Zap,
  Activity
} from "lucide-react";

export default function CommandBar({ 
  state = "idle", // "idle" | "analyzing" | "result"
  onAnalyze,
  onHome,
  onHistory,
  progress = 0,
  disabled = false
}) {
  const isAnalyzing = state === "analyzing";
  
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 20 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
    >
      {/* Glass Container */}
      <div className="relative flex items-center gap-1 px-2 py-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50">
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl opacity-50" />
        
        {/* Home Button */}
        <CommandButton 
          icon={Home} 
          label="Hub"
          onClick={onHome}
          disabled={isAnalyzing}
          active={state === "idle"}
        />
        
        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />
        
        {/* Main Action Button */}
        {isAnalyzing ? (
          <div className="relative flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600">
            {/* Progress Ring */}
            <div className="relative w-6 h-6">
              <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-white/20"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={62.83}
                  strokeDashoffset={62.83 * (1 - progress / 100)}
                  className="text-white transition-all duration-300"
                  strokeLinecap="round"
                />
              </svg>
              <Activity className="absolute inset-0 w-3 h-3 m-auto text-white animate-pulse" />
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white tracking-wide">
                ANALYZING
              </span>
              <span className="text-[10px] font-mono text-white/60">
                {Math.round(progress)}% complete
              </span>
            </div>
          </div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAnalyze}
            disabled={disabled}
            className="group relative flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </div>
            
            <Zap className="w-5 h-5 text-white fill-white/30" />
            <span className="text-sm font-bold text-white tracking-wide">
              {state === "result" ? "NEW SCAN" : "START ANALYSIS"}
            </span>
          </motion.button>
        )}
        
        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />
        
        {/* History Button */}
        <CommandButton 
          icon={History} 
          label="History"
          onClick={onHistory}
          disabled={isAnalyzing}
        />
        
        {/* Refresh Button (only in result state) */}
        {state === "result" && (
          <>
            <CommandButton 
              icon={RotateCcw} 
              label="Refresh"
              onClick={onAnalyze}
              disabled={isAnalyzing}
            />
          </>
        )}
      </div>
      
      {/* Keyboard Shortcut Hints */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-mono text-white/30"
      >
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 mr-1">Space</kbd>
          Analyze
        </span>
        <span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 mr-1">Esc</kbd>
          Home
        </span>
      </motion.div>
    </motion.div>
  );
}

// Individual Command Button
function CommandButton({ icon: Icon, label, onClick, disabled, active }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative group flex flex-col items-center justify-center w-14 h-14 rounded-xl
        transition-all duration-200
        ${active 
          ? "bg-white/10 text-white" 
          : "text-white/50 hover:text-white hover:bg-white/5"
        }
        disabled:opacity-30 disabled:cursor-not-allowed
      `}
    >
      <Icon className="w-5 h-5" />
      <span className="text-[10px] font-medium mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {label}
      </span>
      
      {/* Active Indicator */}
      {active && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-500"
        />
      )}
    </motion.button>
  );
}
