"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Footprints, Heart, Star } from "lucide-react";

interface PostCompleteEffectProps {
  onComplete?: () => void;
}

export function PostEffect({ onComplete }: PostCompleteEffectProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      onComplete?.();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {/* 背景のグラデーション */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500/80 to-pink-500/80 backdrop-blur-sm"
        />

        {/* メインコンテンツ */}
        <div className="relative">
          {/* 回転する輪 */}
          <motion.div
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              scale: [0, 1.2, 1],
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border-4 border-white/30"
          />

          {/* ハートのパーティクル */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 300],
                y: [0, (Math.random() - 0.5) * 300],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Heart className="w-4 h-4 text-pink-300" fill="currentColor" />
            </motion.div>
          ))}

          {/* メインカード */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              duration: 0.6,
              bounce: 0.4,
            }}
            className="bg-white rounded-3xl p-8 shadow-xl flex flex-col items-center gap-4 relative w-80"
          >
            {/* アイコンとメッセージ */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20" />
                </motion.div>
              </div>
              <Footprints className="w-12 h-12 text-purple-500 relative z-10" />
            </motion.div>

            {/* テキストコンテンツ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center space-y-2"
            >
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                投稿完了！
              </h2>
              <p className="text-gray-600 text-sm">
                今日も素晴らしい記録ですね！
              </p>
            </motion.div>

            {/* 距離表示 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 w-full text-center"
            >
              <div className="text-sm text-gray-600 mb-1">お疲れ様でした！</div>
              <div className="text-2xl font-bold text-purple-600">
                明日も頑張ろう!
              </div>
            </motion.div>

            {/* 装飾的な要素 */}
            <div className="absolute -bottom-4 -right-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Star className="w-8 h-8 text-purple-400" fill="currentColor" />
              </motion.div>
            </div>
          </motion.div>

          {/* キラキラエフェクト */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 400],
                y: [0, (Math.random() - 0.5) * 400],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              <div
                className="w-1 h-1 rounded-full"
                style={{
                  backgroundColor: ["#C084FC", "#F0ABFC", "#E879F9"][
                    Math.floor(Math.random() * 3)
                  ],
                  boxShadow: "0 0 4px currentColor",
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
