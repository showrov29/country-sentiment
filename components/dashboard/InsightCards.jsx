"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lightbulb, Megaphone, CheckCircle2 } from "lucide-react";
import { containerStagger, fadeInUp } from "@/lib/motion-variants";

// 3D Tilt Card Component
function TiltCard({ children, className }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

  function onMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set(clientX - left - width / 2);
    y.set(clientY - top - height / 2);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const rotateX = useTransform(mouseY, [-300, 300], [5, -5]); // Inverted for natural tilt
  const rotateY = useTransform(mouseX, [-300, 300], [-5, 5]);

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative transition-all duration-200 ease-out ${className}`}
    >
       <div style={{ transform: "translateZ(20px)" }}>
         {children}
       </div>
    </motion.div>
  );
}

export default function InsightCards({ reasons = [], demands = [] }) {
  // Helper to strip Markdown bolding for cleaner titles
  const cleanText = (text) => text.replace(/\*\*/g, '').split(':')[0];
  const getBody = (text) => {
    const parts = text.split(':');
    return parts.length > 1 ? parts.slice(1).join(':').trim() : text;
  };

  return (
    <motion.div 
       variants={containerStagger}
       initial="hidden"
       animate="show"
       className="grid grid-cols-1 lg:grid-cols-2 gap-8 perspective-1000"
    >
      {/* REASONS COLUMN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Key Drivers</h3>
        </div>

        {reasons.map((reason, idx) => (
          <TiltCard
            key={idx}
            className="group p-5 bg-white dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-2xl dark:hover:shadow-emerald-900/10"
          >
            <h4 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2 group-hover:text-emerald-500 transition-colors">
              {cleanText(reason)}
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {getBody(reason)}
            </p>
          </TiltCard>
        ))}
      </div>

      {/* DEMANDS COLUMN */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Public Demands</h3>
        </div>

        {demands.map((demand, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            whileHover={{ scale: 1.02, x: 5 }}
            className="flex gap-4 p-5 bg-zinc-50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800/50 rounded-2xl cursor-default"
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
      </div>
    </motion.div>
  );
}
