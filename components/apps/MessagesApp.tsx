"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Send, User } from "lucide-react";
import { useGameState } from "@/hooks/useGameState";
import { useState } from "react";

interface MessagesAppProps {
  onClose: () => void;
}

export default function MessagesApp({ onClose }: MessagesAppProps) {
  const { messages } = useGameState();
  const [inputText, setInputText] = useState("");

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-black z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-zinc-900 border-b border-zinc-800">
        <button onClick={onClose} className="p-1 -ml-2 text-blue-500">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
            <User size={20} className="text-zinc-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">알 수 없음</h2>
            <p className="text-xs text-zinc-500">오프라인</p>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-600 gap-2">
            <p>메시지 기록이 없습니다.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === 'me' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-zinc-800 text-zinc-200 rounded-tl-none'
              }`}>
                <p>{msg.content}</p>
                <span className="text-[10px] opacity-50 mt-1 block text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="신호가 잡히지 않습니다..."
          disabled
          className="flex-1 bg-zinc-800 text-zinc-400 text-sm px-4 py-2 rounded-full focus:outline-none cursor-not-allowed"
        />
        <button disabled className="p-2 bg-zinc-800 rounded-full text-zinc-600">
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
}
