"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AppIconProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

function AppIcon({ icon: Icon, label, onClick, color = "bg-zinc-800" }: AppIconProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shadow-lg backdrop-blur-md bg-opacity-80 border border-white/10`}>
        <Icon size={28} className="text-white" />
      </div>
      <span className="text-xs font-medium text-white/90 drop-shadow-md">{label}</span>
    </motion.button>
  );
}

interface AppGridProps {
  apps: {
    id: string;
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    color?: string;
  }[];
}

export default function AppGrid({ apps }: AppGridProps) {
  return (
    <div className="grid grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-8 w-full max-w-xs px-4">
      {apps.map((app) => (
        <AppIcon key={app.id} {...app} />
      ))}
    </div>
  );
}
