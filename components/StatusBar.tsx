"use client";

import { useGameState } from "@/hooks/useGameState";
import { Battery, Signal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export default function StatusBar() {
  const { time, battery, signal } = useGameState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Format time (minutes to HH:MM)
  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  return (
    <div className="absolute top-0 left-0 right-0 h-14 px-6 pt-2 flex justify-between items-center z-40 text-xs font-medium tracking-wide text-white">
      {/* Time */}
      <div className="w-20 drop-shadow-md">
        <span className="text-sm font-semibold">{formatTime(time)}</span>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-3 drop-shadow-md">
        {/* Signal */}
        <div className="flex items-end gap-0.5 h-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`w-1 rounded-sm transition-all duration-300 ${
                i < signal ? "bg-white h-full" : "bg-white/30 h-1/2"
              }`}
            />
          ))}
        </div>

        {/* Battery */}
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{Math.floor(battery)}%</span>
          <div className="relative">
            <Battery 
              size={22} 
              className={`${battery < 20 ? "text-red-500" : "text-white"}`} 
            />
            <div 
              className={`absolute top-[7px] left-[2px] h-[7px] rounded-[1px] ${
                battery < 20 ? "bg-red-500" : "bg-white"
              }`}
              style={{ width: `${Math.max(0, (battery / 100) * 13)}px` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
