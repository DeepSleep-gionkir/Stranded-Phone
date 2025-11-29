"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroSequenceProps {
  onComplete: () => void;
}

const INTRO_STEPS = [
  "눈을 떠보니 낯선 해변이다...",
  "머리가 깨질 듯이 아프다.",
  "주머니에 스마트폰이 있다.",
  "이것만이 유일한 희망이다.",
  "[조작법] 앱을 터치하여 실행하세요.",
  "[조작법] '탐색'으로 자원을 모으세요.",
  "[조작법] 신호를 찾아 구조 요청을 보내세요.",
  "배터리가 다 되기 전에..."
];

export default function IntroSequence({ onComplete }: IntroSequenceProps) {
  const [step, setStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (step >= INTRO_STEPS.length) {
      onComplete();
      return;
    }

    const text = INTRO_STEPS[step];
    setDisplayedText("");
    setIsTyping(true);

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      setDisplayedText(text.slice(0, charIndex));
      if (charIndex >= text.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 50); // Typing speed

    return () => clearInterval(interval);
  }, [step]); // Removed onComplete from dependencies to prevent re-run on parent render

  useEffect(() => {
    if (step >= INTRO_STEPS.length) {
      onComplete();
    }
  }, [step, onComplete]);

  const handleNext = () => {
    if (isTyping) {
      // Skip typing
      setDisplayedText(INTRO_STEPS[step]);
      setIsTyping(false);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 text-center cursor-pointer"
      onClick={handleNext}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete();
        }}
        className="absolute top-8 right-8 px-4 py-2 text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-white rounded-full transition-colors z-[210]"
      >
        SKIP &gt;&gt;
      </button>

      <motion.p 
        key={step}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl md:text-3xl font-mono text-white leading-relaxed max-w-2xl"
      >
        {displayedText}
        <span className="animate-pulse">_</span>
      </motion.p>
      
      <p className="absolute bottom-10 text-zinc-500 text-sm animate-bounce">
        {isTyping ? "터치하여 건너뛰기" : "터치하여 계속"}
      </p>
    </motion.div>
  );
}
