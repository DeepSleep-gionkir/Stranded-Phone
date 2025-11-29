"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, History, Clock } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { SCENARIOS, ITEMS } from "@/lib/constants";

interface SearchAppProps {
  onClose: () => void;
}

export default function SearchApp({ onClose }: SearchAppProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showLog, setShowLog] = useState(false);
  const { setBattery, setTime, setSanity, addToInventory, setSignal, addExplorationLog, explorationLog, time } = useGameState();

  const formatTime = (minutes: number) => {
    const day = Math.floor(minutes / 1440) + 1;
    const h = Math.floor((minutes % 1440) / 60);
    const m = minutes % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 || 12;
    return `Day ${day} ${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleSearch = () => {
    setIsSearching(true);
    setResult(null);

    // Simulate search delay
    setTimeout(() => {
      const { time, isFlashlightOn } = useGameState.getState();
      const timeOfDay = time % 1440;
      const isNight = timeOfDay >= 1200 || timeOfDay < 360;

      // Night Search Penalty (Without Flashlight)
      if (isNight && !isFlashlightOn && Math.random() > 0.2) {
        // 80% chance to fail at night without light
        setResult("너무 어두워서 아무것도 보이지 않는다... 손전등이 필요하다.");
        setIsSearching(false);
        // Still consume small time/battery for trying
        setBattery((prev) => prev - 1);
        setTime((prev) => prev + 10);
        return;
      }

      // Weighted Random Selection
      const totalWeight = SCENARIOS.reduce((sum, scenario) => sum + scenario.weight, 0);
      let random = Math.random() * totalWeight;
      let scenario = SCENARIOS[0];

      for (const s of SCENARIOS) {
        random -= s.weight;
        if (random <= 0) {
          scenario = s;
          break;
        }
      }
      
      // Apply effects
      if (scenario.effect) {
        if (scenario.effect.battery) setBattery((prev) => prev + scenario.effect!.battery!);
        if (scenario.effect.time) setTime((prev) => prev + scenario.effect!.time!);
        if (scenario.effect.sanity) setSanity((prev) => prev + scenario.effect!.sanity!);
        if (scenario.effect.item) addToInventory(scenario.effect.item!);
        if (scenario.effect.signal) setSignal(scenario.effect.signal!);

        // Special Endings Trigger
        if (scenario.effect.item === "small_boat") {
          useGameState.getState().setGameStatus('won', '작은 보트를 타고 무인도를 탈출했습니다! 며칠 간의 표류 끝에 지나가던 어선에 구조되었습니다.');
        }
        if (scenario.effect.item === "bunker_key") {
          useGameState.getState().setGameStatus('won', '비밀 벙커를 발견했습니다! 그곳에는 충분한 식량과 구조 요청을 보낼 수 있는 고성능 무전기가 있었습니다.');
        }
      }

      // Add to Log
      addExplorationLog({
        id: Math.random().toString(36).substr(2, 9),
        timestamp: time,
        text: scenario.text,
        foundItem: scenario.effect?.item
      });

      setResult(scenario.text);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 bg-zinc-900/95 backdrop-blur-xl z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-white">탐색</h2>
          <button 
            onClick={() => setShowLog(!showLog)}
            className={`p-1.5 rounded-lg transition-colors ${showLog ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-400 hover:bg-white/10'}`}
          >
            <History size={16} />
          </button>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X size={20} className="text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {showLog ? (
            <motion.div
              key="log"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute inset-0 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
            >
              {explorationLog.length > 0 ? (
                explorationLog.map((log) => (
                  <div key={log.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                      <Clock size={12} />
                      <span>{formatTime(log.timestamp)}</span>
                    </div>
                    <p className="text-zinc-200 text-sm leading-relaxed">{log.text}</p>
                    {log.foundItem && ITEMS[log.foundItem] && (
                      <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded text-blue-300 text-xs">
                        <span>🎁 {ITEMS[log.foundItem].name} 획득</span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                  <History size={48} className="mb-4 opacity-20" />
                  <p>탐색 기록이 없습니다.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
            >
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="searching"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-blue-400 animate-pulse">주변을 살피는 중...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <p className="text-lg text-white leading-relaxed">{result}</p>
                    <button 
                      onClick={handleSearch}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-colors"
                    >
                      다시 탐색하기
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6"
                  >
                    <Search size={64} className="text-zinc-600" />
                    <p className="text-zinc-400">주변을 탐색하여<br/>도구와 단서를 찾으세요.</p>
                    <button 
                      onClick={handleSearch}
                      className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
                    >
                      탐색 시작
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
