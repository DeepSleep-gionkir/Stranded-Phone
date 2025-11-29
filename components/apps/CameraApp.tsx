"use client";

import { motion } from "framer-motion";
import { Camera, X, Zap, ZapOff } from "lucide-react";
import { useState } from "react";

interface CameraAppProps {
  onClose: () => void;
}

export default function CameraApp({ onClose }: CameraAppProps) {
  const [flash, setFlash] = useState(false);
  const [shutterEffect, setShutterEffect] = useState(false);

  const takePhoto = () => {
    setShutterEffect(true);
    setTimeout(() => setShutterEffect(false), 100);
    // Logic to analyze surroundings could go here
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black z-50 flex flex-col"
    >
      {/* Viewfinder (Simulated with blurred background passthrough or static noise) */}
      <div className="relative flex-1 bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50" />
        <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
          <p>카메라 모듈 손상됨</p>
        </div>

        {/* Shutter Flash Effect */}
        {shutterEffect && (
          <div className="absolute inset-0 bg-white z-50 animate-flash" />
        )}

        {/* Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-white/10" />
          <div className="border-r border-white/10" />
          <div />
        </div>
      </div>

      {/* Controls */}
      <div className="h-32 bg-black flex items-center justify-around px-8">
        <button className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white">
          <div className="w-10 h-10 rounded-md bg-zinc-800 border border-zinc-700" />
        </button>

        <button 
          onClick={takePhoto}
          className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-white active:scale-90 transition-transform" />
        </button>

        <button onClick={onClose} className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white">
          <X size={24} />
        </button>
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button onClick={() => setFlash(!flash)} className="text-white">
          {flash ? <Zap size={24} /> : <ZapOff size={24} />}
        </button>
      </div>
    </motion.div>
  );
}
