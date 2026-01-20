"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, TrendingUp, AlertCircle } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { PlatformSelector } from "@/components/PlatformSelector";
import { NicheCard } from "@/components/NicheCard";
import { IdeaModal } from "@/components/IdeaModal";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { getResultsForQuery } from "@/lib/mock-data";
import { NicheResult, Platform } from "@/lib/types";

type ViewState = "home" | "searching" | "results" | "error";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("home");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NicheResult[]>([]);
  const [selectedNiche, setSelectedNiche] = useState<NicheResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [trendingNiches, setTrendingNiches] = useState<NicheResult[]>([]);
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/trending");
        if (!response.ok) throw new Error("Failed to fetch trending");
        const data = await response.json();
        setTrendingNiches(data.niches);
      } catch (error) {
        console.error("Error fetching trending:", error);
      } finally {
        setIsTrendingLoading(false);
      }
    };

    fetchTrending();
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);
      setViewState("searching");
      setErrorMessage("");

      try {
        const response = await fetch("/api/discover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, platform: selectedPlatform }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch");
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setResults(data.niches);
        setViewState("results");
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to mock data on error
        setErrorMessage(
          "Using sample data - AI service temporarily unavailable"
        );
        const mockResults = getResultsForQuery(query);
        setResults(mockResults);
        setViewState("results");
      }
    },
    [selectedPlatform]
  );

  const handleNewSearch = () => {
    setViewState("home");
    setResults([]);
    setSearchQuery("");
    setErrorMessage("");
  };

  const openNicheModal = (niche: NicheResult) => {
    setSelectedNiche(niche);
    setIsModalOpen(true);
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Ankara pattern background */}
      <div className="ankara-pattern" />

      <div className="relative z-10 px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {(viewState === "home" || viewState === "searching") && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Logo & Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-8 sm:mb-12"
              >
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-[#1B5E4A]/10 rounded-full">
                  <Sparkles className="w-4 h-4 text-[#F4B942]" />
                  <span className="text-sm font-medium text-[#1B5E4A]">
                    Find niches that aren&apos;t crowded
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1A1A2E] leading-tight mb-4">
                  Discover Your{" "}
                  <span className="bg-gradient-to-r from-[#1B5E4A] via-[#F4B942] to-[#FF6B6B] bg-clip-text text-transparent">
                    Unique Voice
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#1A1A2E]/60 max-w-xl mx-auto">
                  Stop copying what everyone else is doing. Find content niches
                  with room to grow on TikTok, YouTube & Instagram.
                </p>
              </motion.div>

              {/* Search Input */}
              <div className="mb-8">
                <SearchInput
                  onSearch={handleSearch}
                  isSearching={viewState === "searching"}
                />
              </div>

              {/* Platform Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-12"
              >
                <p className="text-center text-sm text-[#1A1A2E]/50 mb-4">
                  Choose your platform
                </p>
                <PlatformSelector
                  selected={selectedPlatform}
                  onSelect={setSelectedPlatform}
                />
              </motion.div>

              {/* Features hint */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm text-[#1A1A2E]/50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟢</span>
                  <span>Open lanes</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🟡</span>
                  <span>Getting busy</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔴</span>
                  <span>Very crowded</span>
                </div>
              </motion.div>

              {/* Trending Section */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-16 sm:mt-24"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F4B942]/10 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-[#F4B942]" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A2E]">
                        Trending for You
                      </h2>
                      <p className="text-sm text-[#1A1A2E]/50">
                        Real-time AI analysis of Nigerian content gaps
                      </p>
                    </div>
                  </div>
                </div>

                {isTrendingLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-[250px] bg-white/50 animate-pulse rounded-3xl border border-[#E8E0D8]"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trendingNiches.slice(0, 3).map((niche, index) => (
                      <NicheCard
                        key={niche.id}
                        niche={niche}
                        index={index}
                        onClick={() => openNicheModal(niche)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}

          {viewState === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-6xl mx-auto"
            >
              {/* Results Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <button
                  onClick={handleNewSearch}
                  className="flex items-center gap-2 text-[#1B5E4A] hover:text-[#164a3b] font-medium mb-4 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>New search</span>
                </button>

                {/* Error banner if using fallback */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 px-4 py-3 mb-4 bg-[#F4B942]/20 border border-[#F4B942]/30 rounded-2xl"
                  >
                    <AlertCircle className="w-4 h-4 text-[#F4B942]" />
                    <span className="text-sm text-[#1A1A2E]/70">
                      {errorMessage}
                    </span>
                  </motion.div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E]">
                      Results for &ldquo;{searchQuery}&rdquo;
                    </h2>
                    <p className="text-[#1A1A2E]/60 mt-1">
                      {results.length} niche ideas found
                    </p>
                  </div>

                  <div className="flex items-center gap-2 px-4 py-2 bg-[#1B5E4A]/10 rounded-2xl">
                    <TrendingUp className="w-4 h-4 text-[#1B5E4A]" />
                    <span className="text-sm font-medium text-[#1B5E4A]">
                      {results.filter((r) => r.saturation === "open").length}{" "}
                      open lanes found!
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Platform Filter (in results view) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <PlatformSelector
                  selected={selectedPlatform}
                  onSelect={setSelectedPlatform}
                />
              </motion.div>

              {/* Results Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {results.map((niche, index) => (
                  <NicheCard
                    key={niche.id}
                    niche={niche}
                    index={index}
                    onClick={() => openNicheModal(niche)}
                  />
                ))}
              </div>

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-12 text-center"
              >
                <p className="text-[#1A1A2E]/50 text-sm mb-4">
                  Not finding what you need?
                </p>
                <button
                  onClick={handleNewSearch}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E8E0D8] rounded-2xl text-[#1B5E4A] font-medium hover:bg-[#FFF8F0] transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Try a different search
                </button>
              </motion.div>
            </motion.div>
          )}

          {viewState === "searching" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-6xl mx-auto mt-12"
            >
              <div className="text-center mb-8">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[#1B5E4A] to-[#2D7A5E] rounded-full mb-4"
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
                  Analyzing Nigerian trends...
                </h3>
                <p className="text-[#1A1A2E]/60">
                  Finding open lanes for your content
                </p>
              </div>
              <LoadingSkeleton />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Idea Modal */}
      <IdeaModal
        niche={selectedNiche}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-[#1A1A2E]/40">
        <p>Made with love for Nigerian creators</p>
      </footer>
    </main>
  );
}
