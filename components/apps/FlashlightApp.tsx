"use client";

import { motion } from "framer-motion";
import { Power } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";

interface FlashlightAppProps {
  onClose: () => void;
}

export default function FlashlightApp({ onClose }: FlashlightAppProps) {
  const { isFlashlightOn, toggleFlashlight } = useGameState();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center"
    >
      {/* Flashlight Overlay Effect (Global) is handled in Page or Layout, this is just the UI control */}
      
      <button 
        onClick={toggleFlashlight}
        className="relative group"
      >
        <div className={`absolute inset-0 blur-3xl transition-opacity duration-500 ${
          isFlashlightOn ? "bg-white/40 opacity-100" : "opacity-0"
        }`} />
        
        <div className={`relative w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
          isFlashlightOn 
            ? "border-white bg-white text-black shadow-[0_0_50px_rgba(255,255,255,0.5)]" 
            : "border-zinc-700 bg-zinc-900 text-zinc-700"
        }`}>
          <Power size={48} />
        </div>
      </button>

      <p className="mt-8 text-zinc-500 font-medium tracking-widest">
        {isFlashlightOn ? "ON" : "OFF"}
      </p>

      <button 
        onClick={onClose}
        className="absolute bottom-12 text-zinc-500 hover:text-white transition-colors"
      >
        닫기
      </button>
    </motion.div>
  );
}
