"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Animated Before/After demo showing how CatalogIQ optimization works.
 * Auto-plays a loop: Original → Scanning → Optimized → Stats reveal
 */
export default function BeforeAfterMotion() {
  const [phase, setPhase] = useState(0); // 0=before, 1=scanning, 2=optimizing, 3=after, 4=stats
  const [auto, setAuto] = useState(true);

  useEffect(() => {
    if (!auto) return;
    const delays = [2500, 1800, 1500, 2000, 2200];
    const t = setTimeout(() => setPhase((p) => (p + 1) % 5), delays[phase]);
    return () => clearTimeout(t);
  }, [phase, auto]);

  const coverageBefore = 90;
  const coverageAfter = 58;
  const slabBefore = { label: "500g–1kg", cost: 100 };
  const slabAfter = { label: "0–500g", cost: 75 };
  const savings = slabBefore.cost - slabAfter.cost;

  return (
    <div className="w-full max-w-4xl mx-auto" onMouseEnter={() => setAuto(false)} onMouseLeave={() => setAuto(true)}>
      {/* Phase indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {["Upload", "Analyze", "Optimize", "Result", "Savings"].map((label, i) => (
          <button key={i} onClick={() => setPhase(i)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${phase === i ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30 scale-105' : 'bg-[#f1f5f9] text-[#64748b] hover:bg-[#e2e8f0]'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${phase === i ? 'bg-white' : phase > i ? 'bg-[#10B981]' : 'bg-[#cbd5e1]'}`}></span>
            {label}
          </button>
        ))}
      </div>

      {/* Main viewport */}
      <div className="relative bg-[#0A0A14] rounded-2xl overflow-hidden border border-[#1a1a2e] shadow-2xl" style={{ aspectRatio: "16/9" }}>
        {/* Product image container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Background transition */}
          <motion.div className="absolute inset-0" animate={{ backgroundColor: phase >= 2 ? "rgb(255,214,224)" : "rgb(255,255,255)" }} transition={{ duration: 0.8 }} />

          {/* Product — scales from 90% to 58% coverage */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={{
              scale: phase >= 2 ? 0.58 : 0.90,
              y: phase >= 2 ? 10 : 0,
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: "100%", height: "100%" }}
          >
            <div className="w-[60%] h-[70%] bg-gradient-to-br from-[#7C3AED]/20 to-[#A78BFA]/30 rounded-2xl flex items-center justify-center border-2 border-[#7C3AED]/20">
              <i className="ti ti-shirt text-[100px] md:text-[160px] text-[#7C3AED]/40"></i>
            </div>
          </motion.div>

          {/* Scanning overlay */}
          <AnimatePresence>
            {phase === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 pointer-events-none">
                {/* Scan line */}
                <motion.div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#7C3AED] to-transparent shadow-[0_0_20px_#7C3AED]" animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                {/* Grid */}
                <motion.div className="absolute inset-[15%] border-2 border-[#7C3AED] border-dashed rounded-xl" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: [0, 0.8, 0.4], scale: 1 }} transition={{ duration: 0.6 }}>
                  <div className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-[#7C3AED] rounded-tl-lg"></div>
                  <div className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-[#7C3AED] rounded-tr-lg"></div>
                  <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-[#7C3AED] rounded-bl-lg"></div>
                  <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-[#7C3AED] rounded-br-lg"></div>
                </motion.div>
                {/* Data readouts */}
                <motion.div className="absolute top-4 left-4 bg-black/80 text-[#A78BFA] text-xs font-mono px-3 py-1.5 rounded-lg" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  COVERAGE: {coverageBefore}%
                </motion.div>
                <motion.div className="absolute top-4 right-4 bg-black/80 text-[#EF4444] text-xs font-mono px-3 py-1.5 rounded-lg" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                  SLAB: {slabBefore.label} • ₹{slabBefore.cost}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Optimization particles */}
          <AnimatePresence>
            {phase === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
                {[...Array(12)].map((_, i) => (
                  <motion.div key={i} className="absolute w-2 h-2 rounded-full bg-[#7C3AED]"
                    style={{ left: `${20 + Math.random() * 60}%`, top: `${20 + Math.random() * 60}%` }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 0], opacity: [0, 0.8, 0], x: (Math.random() - 0.5) * 200, y: (Math.random() - 0.5) * 200 }}
                    transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                  />
                ))}
                <motion.div className="absolute inset-0 bg-[#7C3AED]/10" initial={{ opacity: 0 }} animate={{ opacity: [0, 0.3, 0] }} transition={{ duration: 1 }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* After badges */}
          <AnimatePresence>
            {phase >= 3 && (
              <>
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", damping: 15 }} className="absolute top-4 left-4 bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-lg z-30 shadow-lg flex items-center gap-1.5">
                  <i className="ti ti-check"></i> Coverage: {coverageAfter}%
                </motion.div>
                <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0 }} transition={{ type: "spring", damping: 15, delay: 0.2 }} className="absolute top-4 right-4 bg-[#10B981] text-white text-xs font-bold px-3 py-1.5 rounded-lg z-30 shadow-lg flex items-center gap-1.5">
                  <i className="ti ti-coin-rupee"></i> Slab: {slabAfter.label} • ₹{slabAfter.cost}
                </motion.div>
                <motion.div initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring" }} className="absolute bottom-4 left-4 bg-black/80 text-white text-[10px] font-mono px-3 py-1.5 rounded-lg z-30">
                  Optimized • Compressed • 142KB
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Coverage meter bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#1a1a2e] z-40">
          <motion.div className="h-full rounded-r-full" animate={{
            width: phase >= 2 ? `${coverageAfter}%` : `${coverageBefore}%`,
            backgroundColor: phase >= 2 ? "#10B981" : "#EF4444",
          }} transition={{ duration: 1, ease: "easeInOut" }} />
        </div>
      </div>

      {/* Stats reveal — bottom panel */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div initial={{ y: 20, opacity: 0, height: 0 }} animate={{ y: 0, opacity: 1, height: "auto" }} exit={{ y: 20, opacity: 0, height: 0 }} transition={{ type: "spring", damping: 20 }} className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0 }} className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-sm text-center">
              <div className="text-xs font-bold text-[#64748b] uppercase mb-1">Before</div>
              <div className="text-lg font-black text-[#EF4444] line-through">₹{slabBefore.cost}</div>
              <div className="text-[10px] text-[#94a3b8]">{slabBefore.label}</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }} className="bg-white p-4 rounded-xl border-2 border-[#10B981] shadow-md text-center">
              <div className="text-xs font-bold text-[#10B981] uppercase mb-1">After</div>
              <div className="text-lg font-black text-[#10B981]">₹{slabAfter.cost}</div>
              <div className="text-[10px] text-[#94a3b8]">{slabAfter.label}</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }} className="bg-[#EDE9FE] p-4 rounded-xl border border-[#7C3AED]/20 text-center">
              <div className="text-xs font-bold text-[#7C3AED] uppercase mb-1">Per Order</div>
              <div className="text-lg font-black text-[#7C3AED]">₹{savings} saved</div>
            </motion.div>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }} className="bg-[#0A0A14] p-4 rounded-xl text-center text-white">
              <div className="text-xs font-bold text-[#64748b] uppercase mb-1">100 Orders/mo</div>
              <div className="text-lg font-black text-[#10B981]">₹{savings * 100}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
