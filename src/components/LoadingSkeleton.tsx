"use client";

import { motion } from "framer-motion";

export function LoadingSkeleton() {
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {skeletons.map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-[#E8E0D8]"
        >
          <div className="space-y-4">
            <div className="shimmer h-6 w-3/4 rounded-lg" />
            <div className="shimmer h-6 w-24 rounded-full" />
            <div className="space-y-2">
              <div className="shimmer h-4 w-full rounded" />
              <div className="shimmer h-4 w-5/6 rounded" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <div className="shimmer h-4 w-28 rounded" />
              <div className="shimmer h-8 w-8 rounded-full" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
