"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";

interface SearchInputProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const placeholderExamples = [
  "comedy skits",
  "fashion styling",
  "cooking tutorials",
  "tech reviews",
  "fitness content",
  "relationship advice",
  "travel vlogs",
  "money tips",
];

export function SearchInput({ onSearch, isSearching }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [placeholder, setPlaceholder] = useState("e.g. \"cooking tutorials\"");

  useEffect(() => {
    const randomExample = placeholderExamples[Math.floor(Math.random() * placeholderExamples.length)];
    setPlaceholder(`e.g. "${randomExample}"`);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch(query.trim());
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="w-full max-w-xl mx-auto"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E4A] via-[#F4B942] to-[#FF6B6B] rounded-3xl blur-xl opacity-20" />
        <div className="relative flex items-center bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E8E0D8] overflow-hidden">
          <div className="flex-1 flex items-center">
            <Search className="w-5 h-5 text-[#1B5E4A]/50 ml-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              disabled={isSearching}
              className="flex-1 px-4 py-5 text-base sm:text-lg text-[#1A1A2E] placeholder:text-[#1A1A2E]/40 bg-transparent outline-none disabled:opacity-50"
            />
          </div>
          <motion.button
            type="submit"
            disabled={!query.trim() || isSearching}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 m-2 px-5 sm:px-6 py-3 bg-gradient-to-r from-[#1B5E4A] to-[#2D7A5E] text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSearching ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="hidden sm:inline">Finding...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span className="hidden sm:inline">Discover</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-sm text-[#1A1A2E]/50 mt-4"
      >
        Type any content idea you&apos;re thinking about
      </motion.p>
    </motion.form>
  );
}
