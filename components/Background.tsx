"use client";

import { useGameState } from "@/hooks/useGameState";

export default function Background() {
  const { weather, time } = useGameState();
  
  // Determine day/night
  const isNight = (time % 1440) < 360 || (time % 1440) > 1080; // 6 PM to 6 AM roughly

  // SVG 패턴 및 색상 설정 (무인도 테마)
  const getBackgroundContent = () => {
    // 공통 요소: 땅 (모래/흙)
    const Ground = () => (
      <path d="M0 80 Q 50 70 100 80 V 100 H 0 Z" fill={isNight ? "#1c1917" : "#d97706"} fillOpacity={isNight ? "0.8" : "0.4"} />
    );

    // 공통 요소: 나무 (단순화된 형태)
    const Trees = () => (
      <g fill={isNight ? "#0f172a" : "#166534"} fillOpacity={isNight ? "0.9" : "0.6"}>
        <path d="M10 80 L20 50 L30 80 Z" />
        <path d="M80 85 L90 60 L100 85 Z" />
        <path d="M40 82 L55 45 L70 82 Z" />
      </g>
    );

    if (isNight) {
      // 밤: 어두운 남색 + 달 + 별
      return (
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="nightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#020617" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
          </defs>
          <rect width="100" height="100" fill="url(#nightGrad)" />
          <circle cx="85" cy="15" r="8" fill="#fefce8" fillOpacity="0.8" /> {/* 달 */}
          <circle cx="20" cy="20" r="0.5" fill="white" /> <circle cx="50" cy="10" r="0.5" fill="white" /> {/* 별 */}
          <Trees />
          <Ground />
        </svg>
      );
    }
    
    switch (weather) {
      case 'rain':
        // 비: 회색 + 빗방울
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#rainGrad)" />
            <Trees />
            <Ground />
            {/* 빗방울 */}
            <line x1="10" y1="10" x2="8" y2="20" stroke="#94a3b8" strokeWidth="0.5" opacity="0.5" />
            <line x1="50" y1="30" x2="48" y2="40" stroke="#94a3b8" strokeWidth="0.5" opacity="0.5" />
            <line x1="80" y1="50" x2="78" y2="60" stroke="#94a3b8" strokeWidth="0.5" opacity="0.5" />
          </svg>
        );
      case 'fog':
        // 안개: 탁한 회색/녹색
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="#52525b" />
            <Trees />
            <Ground />
            <rect width="100" height="100" fill="#d1d5db" fillOpacity="0.3" /> {/* 안개 오버레이 */}
          </svg>
        );
      default:
        // 맑음: 파란 하늘 + 해
        return (
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="clearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#bae6fd" />
              </linearGradient>
            </defs>
            <rect width="100" height="100" fill="url(#clearGrad)" />
            <circle cx="85" cy="15" r="10" fill="#fde047" fillOpacity="0.8" /> {/* 해 */}
            <Trees />
            <Ground />
          </svg>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
      {/* Blur 강도 증가 (blur-3xl -> blur-[100px]) */}
      <div className="absolute inset-0 blur-[80px] scale-110 transition-all duration-1000">
        {getBackgroundContent()}
      </div>
      {/* Overlay gradient for better text visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
    </div>
  );
}
