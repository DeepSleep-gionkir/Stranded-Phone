"use client";

import { motion } from "framer-motion";
import { BookOpen, X, Battery, Signal, Moon, Sun, Search, AlertTriangle } from "lucide-react";

interface GuideAppProps {
  onClose: () => void;
}

export default function GuideApp({ onClose }: GuideAppProps) {
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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-xl">
              <BookOpen size={24} className="text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white">생존 가이드</h2>
          </div>
          <button onClick={onClose} className="p-2 bg-zinc-900 rounded-full text-white hover:bg-zinc-800 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        
        {/* Goal Section */}
        <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold text-white mb-3">🎯 목표: 탈출</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            당신은 무인도에 고립되었습니다. 구조 신호를 보내거나, 숨겨진 탈출 수단을 찾아 이 섬을 빠져나가야 합니다.
          </p>
        </section>

        {/* Core Mechanics */}
        <section className="space-y-4">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest px-1">핵심 생존 수칙</h3>
          
          <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="p-2 bg-green-500/20 rounded-lg shrink-0">
              <Battery size={20} className="text-green-500" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">배터리 관리</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                모든 행동은 배터리를 소모합니다. <span className="text-green-400">화면 밝기</span>가 높을수록, <span className="text-green-400">손전등</span>을 켤수록 소모 속도가 빨라집니다. 0%가 되면 게임 오버입니다.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
              <Signal size={20} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">신호 확보</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                구조 요청을 보내려면 <span className="text-blue-400">신호 4칸</span>이 필요합니다. 해변가나 높은 언덕 등 신호가 잘 잡히는 장소를 탐색하세요.
              </p>
            </div>
          </div>

          <div className="bg-zinc-900/50 p-5 rounded-2xl border border-white/5 flex gap-4 items-start">
            <div className="p-2 bg-purple-500/20 rounded-lg shrink-0">
              <Moon size={20} className="text-purple-500" />
            </div>
            <div>
              <h4 className="text-white font-bold mb-1">밤과 멘탈</h4>
              <p className="text-zinc-400 text-xs leading-relaxed">
                밤(20:00~06:00)에는 어둠의 공포로 인해 <span className="text-purple-400">멘탈</span>이 서서히 감소합니다. 손전등을 켜서 이를 막을 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="space-y-4">
          <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest px-1">유용한 팁</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-yellow-500">
                <Search size={16} />
                <span className="font-bold text-sm">탐색 기록</span>
              </div>
              <p className="text-zinc-500 text-xs">탐색 앱 상단의 시계 아이콘으로 지난 기록을 확인하세요.</p>
            </div>

            <div className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center gap-2 mb-2 text-orange-500">
                <Sun size={16} />
                <span className="font-bold text-sm">밝기 조절</span>
              </div>
              <p className="text-zinc-500 text-xs">설정 앱에서 밝기를 낮춰 배터리를 절약하세요.</p>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section className="bg-red-500/10 p-5 rounded-2xl border border-red-500/20 flex gap-4 items-start">
          <AlertTriangle size={24} className="text-red-500 shrink-0" />
          <div>
            <h4 className="text-red-500 font-bold mb-1">주의사항</h4>
            <p className="text-red-200/70 text-xs leading-relaxed">
              밤에 손전등 없이 탐색을 시도하면 실패할 확률이 매우 높습니다. 불필요한 행동은 자제하세요.
            </p>
          </div>
        </section>

        <div className="h-8" /> {/* Bottom spacer */}
      </div>
    </motion.div>
  );
}
