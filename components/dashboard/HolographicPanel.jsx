"use client";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MessageSquare,
  Target,
  Flame,
  Users,
  AlertTriangle
} from "lucide-react";

// Helper: Parse markdown **bold** to JSX
function parseMarkdown(text) {
  if (!text || typeof text !== 'string') return text;
  
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

// Helper: Detect sentiment from Bangla text
function detectSentiment(text) {
  if (!text || typeof text !== 'string') return 'neutral';
  
  const lower = text.toLowerCase();
  
  // Positive indicators
  if (lower.includes('ইতিবাচক') || lower.includes('আশাবাদী') || lower.includes('positive') || 
      lower.includes('hopeful') || lower.includes('সন্তুষ্ট') || lower.includes('উৎসাহ')) {
    return 'positive';
  }
  
  // Negative indicators
  if (lower.includes('নেতিবাচক') || lower.includes('হতাশ') || lower.includes('negative') ||
      lower.includes('ক্ষোভ') || lower.includes('রাগ') || lower.includes('বিরক্ত') ||
      lower.includes('হতাশা') || lower.includes('angry') || lower.includes('frustrated')) {
    return 'negative';
  }
  
  // Mixed indicators
  if (lower.includes('মিশ্র') || lower.includes('mixed') || lower.includes('বিভক্ত') ||
      lower.includes('দ্বিধা') || lower.includes('polarized')) {
    return 'mixed';
  }
  
  return 'neutral';
}

// Main Holographic Panel Container
export function HoloPanel({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 100, damping: 20 }}
      className={`
        relative overflow-hidden
        bg-white/5 backdrop-blur-xl 
        border border-white/10 
        rounded-2xl
        shadow-2xl shadow-black/20
        ${className}
      `}
    >
      {/* Holographic shimmer */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      {/* Scan line animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ y: "-100%" }}
          animate={{ y: "200%" }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"
        />
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-indigo-500/50 rounded-tl-lg" />
      <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-indigo-500/50 rounded-tr-lg" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-indigo-500/50 rounded-bl-lg" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-indigo-500/50 rounded-br-lg" />
      
      {children}
    </motion.div>
  );
}

// Sentiment Display Panel
export function SentimentPanel({ sentiment, score, reasons = [] }) {
  // Auto-detect sentiment from the text if it's a description
  const detectedSentiment = typeof sentiment === 'string' && sentiment.length > 20 
    ? detectSentiment(sentiment) 
    : sentiment;

  const sentimentConfig = {
    positive: { 
      icon: TrendingUp, 
      color: "text-emerald-400", 
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      label: "Positive",
      bangla: "ইতিবাচক"
    },
    negative: { 
      icon: TrendingDown, 
      color: "text-red-400", 
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      label: "Negative",
      bangla: "নেতিবাচক"
    },
    mixed: { 
      icon: Minus, 
      color: "text-amber-400", 
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      label: "Mixed",
      bangla: "মিশ্র"
    },
    neutral: { 
      icon: Minus, 
      color: "text-gray-400", 
      bg: "bg-gray-500/10",
      border: "border-gray-500/20",
      label: "Neutral",
      bangla: "নিরপেক্ষ"
    }
  };

  const config = sentimentConfig[detectedSentiment] || sentimentConfig.neutral;
  const Icon = config.icon;

  // If sentiment is a long description, show it as summary
  const summaryText = typeof sentiment === 'string' && sentiment.length > 20 ? sentiment : null;

  return (
    <HoloPanel className="p-6" delay={0.1}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
            Overall Sentiment
          </span>
          <div className={`px-2 py-1 rounded-full ${config.bg} ${config.border} border`}>
            <span className={`text-xs font-bold ${config.color}`}>
              {score ? `${score}%` : config.label}
            </span>
          </div>
        </div>
        
        {/* Main Display */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${config.bg}`}>
            <Icon className={`w-8 h-8 ${config.color}`} />
          </div>
          <div>
            <h2 className={`text-3xl font-bold ${config.color}`}>
              {config.bangla}
            </h2>
            <p className="text-sm text-white/50 font-mono">
              {config.label}
            </p>
          </div>
        </div>

        {/* Summary Text (if sentiment was a description) */}
        {summaryText && (
          <div className="pt-3 border-t border-white/10">
            <p className="text-sm text-white/60 leading-relaxed">
              {parseMarkdown(summaryText)}
            </p>
          </div>
        )}
        
        {/* Reasons */}
        {reasons && reasons.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-2">
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
              Key Factors
            </span>
            <ul className="space-y-2">
              {reasons.slice(0, 3).map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/70 leading-relaxed">
                  <span className={`w-1.5 h-1.5 mt-2 rounded-full flex-shrink-0 ${config.bg.replace('/10', '/50')}`} />
                  <span>{parseMarkdown(reason)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </HoloPanel>
  );
}

// Entity Sentiment Panel
export function EntityPanel({ entities = [] }) {
  if (!entities || entities.length === 0) return null;

  return (
    <HoloPanel className="p-6" delay={0.2}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
            Entity Analysis
          </span>
        </div>
        
        <div className="space-y-3">
          {entities.slice(0, 5).map((entity, i) => (
            <EntityBar 
              key={i}
              name={entity.entity}
              positive={entity.positive_comments ?? entity.positive ?? 0}
              negative={entity.negative_comments ?? entity.negative ?? 0}
              index={i}
            />
          ))}
        </div>
      </div>
    </HoloPanel>
  );
}

function EntityBar({ name, positive = 0, negative = 0, index }) {
  const total = (positive || 0) + (negative || 0);
  const positivePercent = total > 0 ? (positive / total) * 100 : 50;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
      className="space-y-1"
    >
      <div className="flex justify-between text-sm">
        <span className="text-white/80 font-medium truncate">{name}</span>
        <span className="text-xs font-mono text-white/40">
          {Math.round(positivePercent)}% pos
        </span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${positivePercent}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400"
        />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${100 - positivePercent}%` }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          className="h-full bg-gradient-to-r from-red-400 to-red-500"
        />
      </div>
    </motion.div>
  );
}

// Themes Panel
export function ThemesPanel({ themes = [] }) {
  if (!themes || themes.length === 0) return null;

  // Support both 'count' and 'comment_count' field names
  const getCount = (t) => t.comment_count ?? t.count ?? 0;
  const maxCount = Math.max(...themes.map(getCount), 1);

  return (
    <HoloPanel className="p-6" delay={0.3}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
            Trending Topics
          </span>
        </div>
        
        <div className="space-y-2">
          {themes.slice(0, 6).map((theme, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="group flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <span className="text-xs font-mono text-white/30 w-4">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 text-sm text-white/80 group-hover:text-white transition-colors">
                {theme.theme}
              </span>
              <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(getCount(theme) / maxCount) * 100}%` }}
                  transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </HoloPanel>
  );
}

// Demands Panel
export function DemandsPanel({ demands = [] }) {
  if (!demands || demands.length === 0) return null;

  return (
    <HoloPanel className="p-6" delay={0.4}>
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
            Public Demands
          </span>
        </div>
        
        <div className="space-y-3">
          {demands.slice(0, 5).map((demand, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-cyan-400">{i + 1}</span>
              </div>
              <p className="text-sm text-white/70 leading-relaxed">
                {parseMarkdown(demand)}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </HoloPanel>
  );
}

// Status Indicator (for analyzing state)
export function StatusPanel({ progress = 0, status = "Initializing..." }) {
  return (
    <HoloPanel className="p-6" delay={0}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
              System Status
            </span>
          </div>
          <span className="text-2xl font-bold font-mono text-white">
            {Math.round(progress)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </motion.div>
          </div>
          
          <p className="text-sm text-white/50 font-mono">
            {status}
          </p>
        </div>
        
        {/* Stage Indicators */}
        <div className="grid grid-cols-5 gap-1">
          {[20, 40, 60, 80, 100].map((threshold, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-colors duration-300 ${
                progress >= threshold 
                  ? "bg-indigo-500" 
                  : "bg-white/10"
              }`}
            />
          ))}
        </div>
      </div>
    </HoloPanel>
  );
}

// History Item Card
export function HistoryCard({ item, onView, onDelete, index = 0 }) {
  const rawSentiment = item?.data?.analysis?.overall_sentiment || "";
  const sentiment = detectSentiment(rawSentiment);
  const timestamp = item?.timestamp 
    ? new Date(item.timestamp).toLocaleString()
    : "Unknown";

  const sentimentColors = {
    positive: "bg-emerald-500",
    negative: "bg-red-500",
    mixed: "bg-amber-500",
    neutral: "bg-gray-500"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={() => onView?.(item)}
      className="group relative cursor-pointer"
    >
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all duration-300">
        <div className="flex items-center gap-3">
          {/* Sentiment Indicator */}
          <div className={`w-3 h-3 rounded-full ${sentimentColors[sentiment] || sentimentColors.neutral}`} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/80 font-medium truncate">
              Sentiment Scan
            </p>
            <p className="text-xs text-white/40 font-mono">
              {timestamp}
            </p>
          </div>
          
          {/* View Arrow */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <MessageSquare className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
