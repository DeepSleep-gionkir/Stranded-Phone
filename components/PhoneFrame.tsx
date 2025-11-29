"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export default function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative flex items-center justify-center h-[100dvh] w-full overflow-hidden">
      {/* Desktop Background Blur (Only visible on large screens) - REMOVED to use global background */}
      
      {/* Phone Container */}
      <motion.div 
        className="relative z-10 w-[min(375px,92vw)] h-[min(812px,92dvh)] rounded-[2.5rem] border-[6px] md:border-[8px] border-zinc-800 bg-black/30 overflow-hidden shadow-2xl backdrop-blur-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] md:w-[120px] h-[25px] md:h-[30px] bg-zinc-900 rounded-b-2xl z-50 pointer-events-none" />

        {/* Screen Content */}
        <div className="relative w-full h-full text-white font-sans">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
