"use client";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, Server, Database, Sparkles, FileText, Check } from "lucide-react";
import { SPRING_TIGHT, containerStagger, listItem } from "@/lib/motion-variants";
import { Canvas } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere } from "@react-three/drei";

function AnimatedCore({ progress }) {
  // Speed up rotation based on progress
  const speed = 1 + (progress / 20);
  
  return (
    <div className="w-48 h-48 relative">
       <Canvas>
         <ambientLight intensity={0.5} />
         <pointLight position={[10, 10, 10]} />
         <Sphere args={[1, 32, 32]} scale={1.8}>
            <MeshDistortMaterial 
               color={progress > 90 ? "#10b981" : "#18181b"} 
               attach="material" 
               distort={0.4} 
               speed={speed} 
               roughness={0.2}
            />
         </Sphere>
       </Canvas>
       <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-zinc-900 dark:text-white font-mono tracking-tighter">
            {Math.round(progress)}%
          </span>
       </div>
    </div>
  );
}

export default function PipelineVisualizer({ progress = 0, status = "Initializing..." }) {
  // Define steps based on progress thresholds
  const steps = [
    { id: 1, label: "Connecting to Secure Grid", threshold: 10, icon: Server },
    { id: 2, label: "Synthesizing Social Data", threshold: 30, icon: Database },
    { id: 3, label: "Filtering High-Signal Context", threshold: 50, icon: Sparkles },
    { id: 4, label: "Gemini 2.0 AI Analysis", threshold: 70, icon: Loader2 },
    { id: 5, label: "Generating Final Report", threshold: 90, icon: FileText },
  ];

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-[60vh] gap-12 max-w-5xl mx-auto px-4">
      
      {/* Left: 3D Visualization */}
      <motion.div 
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         transition={SPRING_TIGHT}
         className="flex-shrink-0"
      >
        <AnimatedCore progress={progress} />
      </motion.div>

      {/* Right: Vertical Timeline */}
      <div className="w-full max-w-md space-y-2">
         <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            System Status
         </h3>
         
         <motion.div 
            variants={containerStagger}
            initial="hidden"
            animate="show"
            className="space-y-4"
         >
            {steps.map((step) => {
               const isCompleted = progress >= step.threshold;
               const isCurrent = progress >= step.threshold && progress < step.threshold + 20;
               const Icon = step.icon;

               return (
                  <motion.div 
                     key={step.id}
                     variants={listItem}
                     className={`flex items-center gap-4 p-3 rounded-xl transition-colors duration-500 ${
                        isCompleted ? "bg-zinc-100 dark:bg-zinc-900" : "opacity-40"
                     }`}
                  >
                     <div className={`p-2 rounded-lg ${
                        isCompleted ? "bg-emerald-500/10 text-emerald-500" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
                     }`}>
                        {isCompleted && !isCurrent ? <CheckCircle2 className="w-5 h-5" /> : <Icon className={`w-5 h-5 ${isCurrent ? "animate-spin" : ""}`} />}
                     </div>
                     
                     <div className="flex-1">
                        <p className={`text-sm font-medium ${
                           isCompleted ? "text-zinc-900 dark:text-white" : "text-zinc-500"
                        }`}>
                           {step.label}
                        </p>
                        {isCurrent && (
                           <motion.p 
                              initial={{ opacity: 0 }} 
                              animate={{ opacity: 1 }} 
                              className="text-xs text-emerald-500 font-mono mt-0.5"
                           >
                              Processing...
                           </motion.p>
                        )}
                     </div>
                  </motion.div>
               );
            })}
         </motion.div>

         <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
             <p className="text-xs font-mono text-zinc-400">
                 Server Message: {status}
             </p>
         </div>
      </div>
    </div>
  );
}
