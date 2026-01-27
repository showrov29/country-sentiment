"use client";
import { motion } from "framer-motion";
import { TrendingUp, MessageCircle, Heart } from "lucide-react";
import clsx from "clsx";

export default function ThemeList({ themes = [] }) {
  if (!themes.length) return null;

  const maxLikes = Math.max(...themes.map(t => t.total_likes || 0));

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 h-full"
    >
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <TrendingUp className="w-5 h-5 text-zinc-900 dark:text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Trending Narratives</h3>
          <p className="text-xs text-zinc-500">Ranked by engagement</p>
        </div>
      </div>

      <div className="space-y-4">
        {themes.sort((a, b) => (b.total_likes || 0) - (a.total_likes || 0)).map((theme, i) => {
          const percent = maxLikes > 0 ? (theme.total_likes / maxLikes) * 100 : 0;
          
          return (
            <div key={i} className="relative group">
              {/* Progress Background */}
              <div 
                className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/50 rounded-xl transition-all duration-1000 ease-out origin-left"
                style={{ width: `${percent}%`, opacity: 0.5 }}
              />
              
              <div className="relative p-3 flex justify-between items-center z-10">
                <div className="flex-1 pr-4">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-2">
                    {theme.theme}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                    <span>{theme.comment_count}</span>
                  </div>
                  <div className="flex items-center gap-1 w-16 justify-end text-rose-500/80">
                    <Heart className="w-3 h-3 fill-current" />
                    <span>{(theme.total_likes / 1000).toFixed(1)}k</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
