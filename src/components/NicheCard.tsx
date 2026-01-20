"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { NicheResult } from "@/lib/types";

interface NicheCardProps {
  niche: NicheResult;
  index: number;
  onClick: () => void;
}

const saturationEmojis = {
  open: "🟢",
  busy: "🟡",
  crowded: "🔴",
};

const saturationColors = {
  open: "badge-open",
  busy: "badge-busy",
  crowded: "badge-crowded",
};

export function NicheCard({ niche, index, onClick }: NicheCardProps) {
  const isGem = niche.saturation === "open";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`
        ${niche.cardGradient}
        relative p-5 sm:p-6 rounded-3xl cursor-pointer
        transform transition-shadow duration-200
        hover:shadow-xl hover:shadow-black/5
        group
      `}
    >
      {isGem && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          className="absolute -top-2 -right-2 bg-[#F4B942] rounded-full p-1.5 shadow-lg"
        >
          <Sparkles className="w-4 h-4 text-white" />
        </motion.div>
      )}

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-[#1A1A2E] leading-tight">
            {niche.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`
            ${saturationColors[niche.saturation]}
            px-3 py-1 rounded-full text-xs font-semibold
            flex items-center gap-1.5
          `}
          >
            <span>{saturationEmojis[niche.saturation]}</span>
            <span>{niche.saturationLabel}</span>
          </span>
        </div>

        <p className="text-sm text-[#1A1A2E]/70 leading-relaxed">
          {niche.why}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#1B5E4A] font-medium">
            Tap for content ideas
          </span>
          <motion.div
            className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1B5E4A]/10 group-hover:bg-[#1B5E4A] transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <ArrowRight className="w-4 h-4 text-[#1B5E4A] group-hover:text-white transition-colors" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
