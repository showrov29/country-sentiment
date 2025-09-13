'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

export default function SentimentCharts({ data }) {
  const lineData = (data.byDay||[]).map(d => ({
    date: d.date, angry: d.counts.angry, sad: d.counts.sad, happy: d.counts.happy, neutral: d.counts.neutral
  }));
  const pieData = Object.entries(data.totals||{}).map(([name, value]) => ({ name, value }));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">Daily Sentiment (7 days)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="date" /><YAxis allowDecimals={false} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="angry" stroke="#ef4444" />
              <Line type="monotone" dataKey="sad" stroke="#3b82f6" />
              <Line type="monotone" dataKey="happy" stroke="#22c55e" />
              <Line type="monotone" dataKey="neutral" stroke="#a3a3a3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl shadow">
        <h3 className="font-semibold mb-2">Overall Sentiment Share</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((_, i) => <Cell key={i} fill={["#ef4444","#3b82f6","#22c55e","#a3a3a3"][i%4]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}