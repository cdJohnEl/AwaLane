"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Lightbulb, X, Sparkles, Download } from "lucide-react";
import { toJpeg } from "html-to-image";
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
  const [activeTab, setActiveTab] = useState<"twists" | "script" | "hooks" | "seo">("twists");
  const [generationLoading, setGenerationLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  const copyToClipboard = async (text: string, index: number | string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(typeof index === "number" ? index : 999);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      console.error("Failed to copy");
    }
  };

  const generateAIContent = async (type: string) => {
    if (!niche || generatedContent[type]) return;

    setGenerationLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          niche: niche.name,
          twist: niche.twists[0],
          platform: "all"
        }),
      });

      if (!response.ok) throw new Error("Failed to generate");
      const data = await response.json();
      setGeneratedContent(prev => ({ ...prev, [type]: data.result }));
    } catch (error) {
      console.error("AI Generation error:", error);
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    if (tab !== "twists") {
      generateAIContent(tab);
    }
  };

  const downloadReport = async () => {
    if (!modalRef.current || !niche) return;

    try {
      const dataUrl = await toJpeg(modalRef.current, {
        quality: 0.95,
        backgroundColor: "#FFF8F0",
        style: {
          borderRadius: "0",
        }
      });
      const link = document.createElement("a");
      link.download = `awalane-${niche.name.toLowerCase().replace(/\s+/g, "-")}-report.jpg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download report", err);
    }
  };

  if (!niche) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-[#FFF8F0] dark:bg-[#0B0E14] border-[#E8E0D8] dark:border-white/10 rounded-3xl p-0 overflow-hidden transition-colors max-h-[90vh] flex flex-col">
        <div className="relative flex flex-col h-full overflow-hidden">
          {/* Main Content Area to Capture */}
          <div ref={modalRef} className="flex flex-col flex-1 overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1B5E4A] to-[#2D7A5E] dark:from-[#164a3b] dark:to-[#1B5E4A] p-6 pb-8 flex-shrink-0 relative">
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-bold uppercase tracking-widest">AwaLane Report</div>
                </div>
                <DialogTitle className="text-white text-xl sm:text-3xl font-bold pr-8 leading-tight">
                  {niche.name}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-white/90 text-sm font-medium">
                    {saturationEmojis[niche.saturation as keyof typeof saturationEmojis]} {niche.saturationLabel}
                  </span>
                </div>
              </DialogHeader>
            </div>

            {/* Navigation Tabs (Not captured in image ideally, but simple for now) */}
            <div className="flex border-b border-[#E8E0D8] dark:border-white/10 bg-white dark:bg-[#141824] px-4 flex-shrink-0 transition-colors">
              {[
                { id: "twists", label: "Twists", icon: Lightbulb },
                { id: "script", label: "Script", icon: Sparkles },
                { id: "hooks", label: "Hooks", icon: Copy },
                { id: "seo", label: "SEO", icon: Sparkles },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`
                    flex items-center gap-2 px-4 py-4 text-xs sm:text-sm font-bold transition-all relative
                    ${activeTab === tab.id
                      ? "text-[#1B5E4A] dark:text-[#2D9F7D]"
                      : "text-[#1A1A2E]/50 dark:text-white/40 hover:text-[#1A1A2E] dark:hover:text-white"
                    }
                  `}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden xs:inline">{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1B5E4A] dark:bg-[#2D9F7D]"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                {activeTab === "twists" ? (
                  <motion.div
                    key="twists"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-white dark:bg-[#141824] rounded-2xl p-5 shadow-sm border border-[#E8E0D8] dark:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-[#F4B942]/20 flex items-center justify-center">
                          <Lightbulb className="w-4 h-4 text-[#F4B942]" />
                        </div>
                        <h4 className="font-bold text-[#1A1A2E] dark:text-white">
                          Growth Strategies
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {niche.twists.map((twist, index) => (
                          <div
                            key={index}
                            className="group flex items-start gap-4 p-4 rounded-xl bg-[#FFF8F0] dark:bg-white/5 border border-transparent hover:border-[#1B5E4A]/20 dark:hover:border-[#2D9F7D]/20 transition-all"
                          >
                            <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-[#1B5E4A] dark:bg-[#2D9F7D] flex items-center justify-center text-xs font-black text-white">
                              {index + 1}
                            </span>
                            <p className="flex-1 text-sm text-[#1A1A2E] dark:text-white/80 leading-relaxed font-medium">
                              {twist}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="bg-white dark:bg-[#141824] rounded-2xl p-5 shadow-sm border border-[#E8E0D8] dark:border-white/10 transition-colors">
                      {generationLoading ? (
                        <div className="py-20 flex flex-col items-center justify-center gap-6">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-12 h-12 border-4 border-[#1B5E4A] dark:border-[#2D9F7D] border-t-transparent rounded-full"
                          />
                          <p className="text-sm font-bold text-[#1A1A2E]/50 dark:text-white/40 animate-pulse uppercase tracking-widest">
                            AI Generating {activeTab}...
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-[#1A1A2E] dark:text-white capitalize flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#F4B942]" />
                              AI {activeTab}
                            </h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(generatedContent[activeTab] || "", activeTab)}
                              className="h-8 px-4 rounded-full bg-[#1B5E4A]/5 hover:bg-[#1B5E4A]/10 dark:bg-white/5 dark:hover:bg-white/10 text-[#1B5E4A] dark:text-[#2D9F7D] font-bold text-xs"
                            >
                              {copiedIndex === 999 ? (
                                <Check className="w-3.5 h-3.5 mr-1.5" />
                              ) : (
                                <Copy className="w-3.5 h-3.5 mr-1.5" />
                              )}
                              {copiedIndex === 999 ? "COPIED" : "COPY ALL"}
                            </Button>
                          </div>
                          <div className="whitespace-pre-wrap text-sm text-[#1A1A2E] dark:text-white/80 leading-relaxed bg-[#FFF8F0] dark:bg-white/5 p-5 rounded-xl border border-[#E8E0D8] dark:border-white/5 font-medium shadow-inner">
                            {generatedContent[activeTab]}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Persistent Footer Actions */}
          <div className="p-4 border-t border-[#E8E0D8] dark:border-white/10 bg-white dark:bg-[#141824] flex items-center justify-between gap-3 flex-shrink-0 transition-colors">
            <button
              onClick={() => onOpenChange(false)}
              className="text-xs font-bold text-[#1A1A2E]/50 dark:text-white/40 hover:text-[#1A1A2E] dark:hover:text-white transition-colors"
            >
              CLOSE
            </button>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={downloadReport}
                className="bg-[#1B5E4A] dark:bg-[#2D9F7D] hover:opacity-90 text-white rounded-full px-6 font-bold h-10 shadow-lg shadow-[#1B5E4A]/20"
              >
                <Download className="w-4 h-4 mr-2" />
                SAVE REPORT
              </Button>
            </div>
          </div>

          {/* Manual close button in top right (outside capture ref) */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-[60] w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
