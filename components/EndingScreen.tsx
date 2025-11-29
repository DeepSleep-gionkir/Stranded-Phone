"use client";

import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";

interface EndingScreenProps {
  outcome: 'won' | 'lost';
  reason: string;
  onRestart: () => void;
}

export default function EndingScreen({ outcome, reason, onRestart }: EndingScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 text-center"
    >
      <h1 className={`text-4xl font-bold mb-4 ${
        outcome === 'won' ? 'text-blue-500' : 
        reason.includes('정신력') ? 'text-purple-600' : 'text-red-500'
      }`}>
        {outcome === 'won' ? '탈출 성공' : reason.includes('정신력') ? '정신 붕괴' : '신호 끊김'}
      </h1>
      
      <p className="text-zinc-400 mb-12 text-lg leading-relaxed">
        {reason}
      </p>

      <button 
        onClick={onRestart}
        className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform"
      >
        <RefreshCw size={20} />
        <span>다시 시작하기</span>
      </button>
    </motion.div>
  );
}
