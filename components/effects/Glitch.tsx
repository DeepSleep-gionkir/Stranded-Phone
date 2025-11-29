"use client";

import { useGameState } from "@/hooks/useGameState";
import { useEffect, useState } from "react";

export default function Glitch() {
  const { sanity } = useGameState();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (sanity > 80) return;

    // Probability increases as sanity decreases
    const probability = (100 - sanity) / 2000; // 0.01 to 0.05 per tick roughly
    
    const interval = setInterval(() => {
      if (Math.random() < probability) {
        setActive(true);
        setTimeout(() => setActive(false), 150 + Math.random() * 200);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sanity]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none overflow-hidden mix-blend-hard-light opacity-50">
      <div className="absolute inset-0 bg-red-500/20 translate-x-[2px] animate-pulse" />
      <div className="absolute inset-0 bg-blue-500/20 -translate-x-[2px] animate-pulse" />
      <div className="absolute top-1/4 left-0 right-0 h-2 bg-white/30 skew-x-12" />
      <div className="absolute bottom-1/3 left-0 right-0 h-1 bg-white/30 -skew-x-12" />
    </div>
  );
}
