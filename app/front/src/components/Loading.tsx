"use client";

import { motion } from "framer-motion";
import { Footprints } from "lucide-react";

interface LoadingScreenProps {
  message?: string;
}

export default function Loading({
  message = "読み込み中...",
}: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-purple-700 to-indigo-800 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* ロゴとリングのコンテナ */}
        <div className="relative w-32 h-32 mx-auto">
          {/* 回転するリング */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2 - i * 0.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className={`w-full h-full rounded-full border-4 border-transparent
                ${i === 0 ? "border-t-purple-500" : i === 1 ? "border-r-pink-500" : "border-b-indigo-500"}`}
                style={{
                  borderWidth: `${4 - i}px`,
                }}
              />
            </motion.div>
          ))}

          {/* 中央のロゴ */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center"
          >
            <Footprints className="h-12 w-12 text-white" />
          </motion.div>
        </div>

        {/* パルスするドット */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </div>

        {/* メッセージ */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-white text-lg font-medium"
        >
          {message}
        </motion.div>
      </div>
    </div>
  );
}
