"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "@/hooks/useGameState";

const WARNING_THRESHOLDS = [
  { level: 50, text: "배터리가 절반 남았다... 아껴써야 해." },
  { level: 30, text: "점점 불안해진다. 구조 요청은 언제쯤..." },
  { level: 15, text: "배터리가 얼마 없어. 서둘러야 해!" },
  { level: 5, text: "제발... 꺼지지 마... 조금만 더..." },
];

export default function BatteryWarning() {
  const battery = useGameState((state) => state.battery);
  const [message, setMessage] = useState<string | null>(null);
  const lastTriggeredRef = useRef<number>(100);

  useEffect(() => {
    // Find the highest threshold that is essentially equal to or greater than current battery
    // But we only want to trigger when we CROSS down past it.
    
    // Check thresholds
    for (const threshold of WARNING_THRESHOLDS) {
      if (battery <= threshold.level && lastTriggeredRef.current > threshold.level) {
        setMessage(threshold.text);
        lastTriggeredRef.current = battery; // Update last triggered to current battery to avoid re-triggering for this threshold
        
        // Auto dismiss after 4 seconds
        setTimeout(() => setMessage(null), 4000);
        break; 
      }
    }
    
    // Update ref if battery goes up (e.g. found battery pack) to allow re-triggering if it drops again?
    // Or just keep it monotonic? Let's allow re-trigger if battery goes significantly up.
    if (battery > lastTriggeredRef.current + 5) {
        lastTriggeredRef.current = battery;
    }

  }, [battery]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute top-1/4 left-0 right-0 z-50 flex justify-center pointer-events-none px-6"
        >
          <div className="bg-black/60 backdrop-blur-md text-white/90 px-6 py-3 rounded-full border border-white/10 shadow-2xl text-center font-medium tracking-wide">
            &quot;{message}&quot;
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
