"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Search, MessageSquare, Flashlight, Camera, Settings, Radio, BookOpen } from "lucide-react";

import PhoneFrame from "@/components/PhoneFrame";
import StatusBar from "@/components/StatusBar";
import Background from "@/components/Background";
import AppGrid from "@/components/AppGrid";
import Glitch from "@/components/effects/Glitch";

import SearchApp from "@/components/apps/SearchApp";
import MessagesApp from "@/components/apps/MessagesApp";
import FlashlightApp from "@/components/apps/FlashlightApp";
import CameraApp from "@/components/apps/CameraApp";
import SettingsApp from "@/components/apps/SettingsApp";
import GuideApp from "@/components/apps/GuideApp";
import IntroSequence from "@/components/IntroSequence";
import EndingScreen from "@/components/EndingScreen";

import { useGameLoop } from "@/hooks/useGameLoop";
import { useGameState } from "@/hooks/useGameState";

import BatteryWarning from "@/components/effects/BatteryWarning";

type AppId = 'search' | 'messages' | 'flashlight' | 'camera' | 'settings' | 'guide' | null;

export default function Home() {
  useGameLoop();
  const [activeApp, setActiveApp] = useState<AppId>(null);
  const { signal, battery, isFlashlightOn, gameStatus, gameOverReason, resetGame, setGameStatus, hasSeenIntro, setHasSeenIntro } = useGameState();
  
  // Initialize showIntro to false to prevent flash
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check localStorage directly to avoid hydration delay flash
    const storage = localStorage.getItem('stranded-phone-storage');
    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        // If hasSeenIntro is true in storage, keep it false.
        // If false or not present, show intro.
        if (!parsed.state.hasSeenIntro) {
          setShowIntro(true);
        }
      } catch (e) {
        // If error parsing, default to showing intro (safe fallback)
        setShowIntro(true);
      }
    } else {
      // No storage found (new user), show intro
      setShowIntro(true);
    }
  }, []);

  const apps = [
    { id: 'search', icon: Search, label: '탐색', onClick: () => setActiveApp('search'), color: 'bg-blue-600' },
    { id: 'messages', icon: MessageSquare, label: '메시지', onClick: () => setActiveApp('messages'), color: 'bg-green-500' },
    { id: 'flashlight', icon: Flashlight, label: '손전등', onClick: () => setActiveApp('flashlight'), color: 'bg-yellow-500' },
    { id: 'camera', icon: Camera, label: '카메라', onClick: () => setActiveApp('camera'), color: 'bg-zinc-700' },
    { id: 'guide', icon: BookOpen, label: '가이드', onClick: () => setActiveApp('guide'), color: 'bg-orange-500' },
    { id: 'settings', icon: Settings, label: '설정', onClick: () => setActiveApp('settings'), color: 'bg-zinc-500' },
  ];

  const closeApp = () => setActiveApp(null);
  
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setHasSeenIntro(true);
  }, [setHasSeenIntro]);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* Global Background (Full Screen) */}
      <Background />
      
      {/* Intro Sequence */}
      <AnimatePresence>
        {showIntro && <IntroSequence onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Flashlight Source Glow (Behind Phone) - Centered behind the phone */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[120px] pointer-events-none transition-opacity duration-300 z-0 ${
        isFlashlightOn ? 'opacity-50' : 'opacity-0'
      }`} />

      <PhoneFrame>
        {/* Phone Wallpaper (Dark overlay to make text readable on phone) */}
        {/* Phone Wallpaper (Brighter Blue/Green Gradient) */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 via-blue-600/30 to-emerald-900/50 backdrop-blur-md -z-10" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 -z-10" />

        <Glitch />
        <BatteryWarning />
        
        {/* Global Overlays */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 z-30 ${
          battery < 20 ? 'opacity-100' : 'opacity-0'
        } shadow-[inset_0_0_100px_rgba(255,0,0,0.3)]`} />
        
        {/* Flashlight Overlay */}
        <div className={`absolute inset-0 pointer-events-none transition-colors duration-300 z-40 ${
          isFlashlightOn ? 'bg-white/10 mix-blend-overlay' : ''
        }`} />


        <StatusBar />
        
        {/* Ending Screen */}
        <AnimatePresence>
          {gameStatus !== 'playing' && gameOverReason && (
            <EndingScreen 
              outcome={gameStatus} 
              reason={gameOverReason} 
              onRestart={() => {
                resetGame();
                setShowIntro(true); // Restart intro on reset
              }} 
            />
          )}
        </AnimatePresence>

        {/* Home Screen Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full pt-20 pb-10 px-4">
          <AnimatePresence>
            {!activeApp && (
              <div className="flex flex-col items-center w-full h-full">
                <h1 className="text-4xl font-thin text-white/80 tracking-widest mb-12 drop-shadow-lg mt-10">
                  STRANDED
                </h1>
                
                <AppGrid apps={apps} />

                {/* SOS Button */}
                {signal >= 4 && (
                  <button 
                    onClick={() => setGameStatus('won', '구조 신호가 성공적으로 전송되었습니다! 구조대가 오고 있습니다.')}
                    className="mt-auto mb-8 w-20 h-20 rounded-full bg-red-600 flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse hover:scale-105 transition-transform"
                  >
                    <Radio size={32} className="text-white" />
                  </button>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Active App Render */}
        <AnimatePresence>
          {activeApp === 'search' && <SearchApp onClose={closeApp} />}
          {activeApp === 'messages' && <MessagesApp onClose={closeApp} />}
          {activeApp === 'flashlight' && <FlashlightApp onClose={closeApp} />}
          {activeApp === 'camera' && <CameraApp onClose={closeApp} />}
          {activeApp === 'guide' && <GuideApp onClose={closeApp} />}
          {activeApp === 'settings' && <SettingsApp onClose={closeApp} />}
        </AnimatePresence>

        {/* Brightness Overlay (Simulate dimming) - Placed last to cover everything */}
        <div 
          className="absolute inset-0 bg-black pointer-events-none z-[200] transition-opacity duration-300"
          style={{ opacity: 1 - (useGameState.getState().brightness / 100) }}
        />

      </PhoneFrame>
    </main>
  );
}
