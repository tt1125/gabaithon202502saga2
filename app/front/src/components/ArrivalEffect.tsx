"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Trophy, Star, MapPin } from "lucide-react";

interface ArrivalEffectProps {
  name: string;
  onComplete?: () => void;
}

export function ArrivalEffect({ name, onComplete }: ArrivalEffectProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      onComplete?.();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {/* 背景のオーバーレイ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* メインコンテナ */}
        <div className="relative">
          {/* キラキラエフェクト */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.5, 1.5, 0],
                x: [0, (Math.random() - 0.5) * 400],
                y: [0, (Math.random() - 0.5) * 400],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              <Star className="w-4 h-4 text-yellow-300" fill="currentColor" />
            </motion.div>
          ))}

          {/* トロフィーアイコン */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              duration: 0.7,
              bounce: 0.5,
            }}
            className="absolute -top-20  -translate-x-1/2"
            style={{ left: "calc(50% - 20px)" }}
          >
            <Trophy className="w-16 h-16 text-yellow-400" fill="currentColor" />
          </motion.div>

          {/* メインメッセージ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-xl flex flex-col items-center gap-4 relative"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-purple-600 flex items-center gap-2"
            >
              <MapPin className="w-8 h-8" />
              <span>到着!!</span>
            </motion.div>

            {/* 場所の名前 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-700 font-medium text-center"
            >
              {name}
            </motion.div>

            {/* お祝いメッセージ */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-sm text-gray-500"
            >
              おめでとうございます！
            </motion.div>
          </motion.div>

          {/* 紙吹雪エフェクト */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`confetti-${i}`}
              className="absolute left-1/2 -translate-x-1/2"
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 1, 0],
                x: [0, (Math.random() - 0.5) * 400],
                y: [0, Math.random() * -400],
                rotate: [0, Math.random() * 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.05,
                ease: "easeOut",
              }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#7C3AED", "#C026D3", "#818CF8", "#34D399"][
                    Math.floor(Math.random() * 4)
                  ],
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatePresence>,
    document.body,
  );
}
