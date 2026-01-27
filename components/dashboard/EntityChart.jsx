"use client";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine, Cell } from 'recharts';
import { motion } from "framer-motion";

export default function EntityChart({ data }) {
  if (!data || data.length === 0) return null;

  // Process data for Diverging Bar Chart effect
  // We make negative comments negative values to they grow left
  const processedData = data.map(item => ({
    ...item,
    // Ensure we have numbers
    positive_comments: item.positive_comments || 0,
    negative_comments: -(item.negative_comments || 0), // Make negative for left-growth
    net_sentiment: (item.positive_comments || 0) - (item.negative_comments || 0)
  })).sort((a, b) => a.net_sentiment - b.net_sentiment); // Sort by polarization

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="col-span-1 lg:col-span-2 bg-white dark:bg-zinc-950/50 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Entity Polarization</h3>
        <p className="text-sm text-zinc-500">Positive vs. Negative sentiment volume per entity</p>
      </div>
      
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={processedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            stackOffset="sign"
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#3f3f46" opacity={0.2} />
            <XAxis 
              type="number" 
              hide 
            />
            <YAxis 
              dataKey="entity" 
              type="category" 
              width={140}
              tick={{ fill: '#a1a1aa', fontSize: 11 }}
              interval={0}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-zinc-900 text-white text-xs rounded-lg p-3 shadow-xl border border-zinc-800">
                      <p className="font-bold mb-1">{label}</p>
                      <div className="flex gap-4">
                        <div className="text-emerald-400">
                          <span className="block text-[10px] uppercase opacity-70">Positive</span>
                          <span className="text-lg font-mono">{Math.abs(data.positive_comments)}</span>
                        </div>
                        <div className="text-rose-400">
                          <span className="block text-[10px] uppercase opacity-70">Negative</span>
                          <span className="text-lg font-mono">{Math.abs(data.negative_comments)}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-zinc-800">
                        <span className="block text-[10px] uppercase opacity-50">Total Engagement</span>
                        <span className="font-mono text-zinc-300">
                          {((data.total_likes_positive || 0) + (data.total_likes_negative || 0)).toLocaleString()} likes
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={0} stroke="#52525b" />
            <Bar dataKey="negative_comments" stackId="stack" fill="#f43f5e" radius={[4, 0, 0, 4]} barSize={20} />
            <Bar dataKey="positive_comments" stackId="stack" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
