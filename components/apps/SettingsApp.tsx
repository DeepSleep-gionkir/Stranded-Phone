"use client";

import { motion } from "framer-motion";
import { Battery, Signal, Thermometer, X, Brain } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { ITEMS } from "@/lib/constants";

interface SettingsAppProps {
  onClose: () => void;
}

export default function SettingsApp({ onClose }: SettingsAppProps) {
  const { battery, signal, sanity, inventory } = useGameState();

  return (
    <motion.div 
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      className="absolute inset-0 bg-zinc-950 z-50 flex flex-col"
    >
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">시스템 상태</h2>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-white">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {/* Status Section */}
        <section className="space-y-4">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">상태</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-green-400">
                <Battery size={20} />
                <span className="font-bold">배터리</span>
              </div>
              <p className="text-2xl font-mono text-white">{Math.floor(battery)}%</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="flex items-center gap-2 mb-2 text-purple-400">
                <Brain size={20} />
                <span className="font-bold">멘탈</span>
              </div>
              <p className="text-2xl font-mono text-white">{Math.floor(sanity)}%</p>
            </div>
          </div>
        </section>

        {/* Inventory Section */}
        <section className="space-y-4">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">인벤토리</h3>
          {inventory.length > 0 ? (
            <div className="space-y-2">
              {inventory.map((itemId, i) => {
                const item = ITEMS[itemId];
                if (!item) return null; // Skip invalid items
                
                return (
                  <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
                    <div>
                      <span className="text-white font-medium block">{item.name}</span>
                      <span className="text-xs text-zinc-500">{item.description}</span>
                      <span className="text-xs text-zinc-500">{item.description}</span>
                    </div>
                    {item.isConsumable && (
                      <button 
                        onClick={() => useGameState.getState().useItem(itemId)}
                        className="px-3 py-1 bg-blue-600/20 text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-600/40 transition-colors"
                      >
                        사용
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-zinc-600 text-center py-4">획득한 아이템이 없습니다.</p>
          )}
        </section>

        {/* Display Settings */}
        <section className="space-y-4">
          <h3 className="text-zinc-400 text-sm font-medium uppercase tracking-wider">화면 밝기</h3>
          <div className="bg-white/10 p-5 rounded-3xl backdrop-blur-md border border-white/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-white">
                <span className="text-yellow-400">☀</span>
                <span className="font-medium">밝기</span>
              </div>
              <span className="text-zinc-300 font-mono">{useGameState.getState().brightness}%</span>
            </div>
            
            <div className="relative w-full h-6 rounded-full bg-zinc-800/50 overflow-hidden border border-white/5">
              {/* Fill Bar */}
              <div 
                className="absolute top-0 left-0 h-full bg-white/90 transition-all duration-75 ease-out"
                style={{ width: `${useGameState.getState().brightness}%` }}
              />
              {/* Invisible Input for Interaction */}
              <input 
                type="range" 
                min="10" 
                max="100" 
                value={useGameState.getState().brightness} 
                onChange={(e) => useGameState.getState().setBrightness(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            
            <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500/50"></span>
              밝기를 높이면 배터리가 더 빨리 소모됩니다.
            </p>
          </div>
        </section>
        {/* Danger Zone */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <h3 className="text-red-500 text-sm font-medium uppercase tracking-wider">시스템 초기화</h3>
          <button 
            onClick={() => {
              if (confirm("정말로 게임을 초기화하시겠습니까? 모든 진행 상황이 삭제됩니다.")) {
                const { resetGame } = useGameState.getState();
                resetGame();
                onClose();
                window.location.reload(); // Force reload to ensure clean state
              }
            }}
            className="w-full py-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 font-bold hover:bg-red-500/20 transition-colors"
          >
            게임 리셋
          </button>
        </section>
      </div>
    </motion.div>
  );
}
