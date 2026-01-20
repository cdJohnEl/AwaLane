"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Lightbulb, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NicheResult } from "@/lib/types";

interface IdeaModalProps {
  niche: NicheResult | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const saturationEmojis = {
  open: "🟢",
  busy: "🟡",
  crowded: "🔴",
};

export function IdeaModal({ niche, open, onOpenChange }: IdeaModalProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  if (!niche) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#FFF8F0] border-[#E8E0D8] rounded-3xl p-0 overflow-hidden">
        <div className="relative">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-[#1B5E4A] to-[#2D7A5E] p-6 pb-8">
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
            <DialogHeader>
              <DialogTitle className="text-white text-xl sm:text-2xl font-bold pr-8">
                {niche.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-white/90 text-sm">
                  {saturationEmojis[niche.saturation]} {niche.saturationLabel}
                </span>
              </div>
            </DialogHeader>
          </div>

          {/* Content */}
          <div className="p-6 -mt-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E8E0D8]">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#F4B942]/20 flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-[#F4B942]" />
                </div>
                <h4 className="font-semibold text-[#1A1A2E]">
                  Try these twists
                </h4>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {niche.twists.map((twist, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group flex items-start gap-3 p-3 rounded-xl bg-[#FFF8F0] hover:bg-[#FFF0E6] transition-colors"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#1B5E4A]/10 flex items-center justify-center text-xs font-bold text-[#1B5E4A]">
                        {index + 1}
                      </span>
                      <p className="flex-1 text-sm text-[#1A1A2E]/80 leading-relaxed">
                        {twist}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(twist, index)}
                        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 rounded-lg hover:bg-[#1B5E4A]/10"
                      >
                        {copiedIndex === index ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check className="w-4 h-4 text-[#6BCB77]" />
                          </motion.div>
                        ) : (
                          <Copy className="w-4 h-4 text-[#1B5E4A]" />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Pro tip */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#F4B942]/10 to-[#FF6B6B]/10 border border-[#F4B942]/20">
              <p className="text-xs text-[#1A1A2E]/70">
                <span className="font-semibold text-[#F4B942]">Pro tip:</span>{" "}
                Combine multiple twists to create even more unique content that
                stands out!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
