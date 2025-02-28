"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface StartEffectProps {
  onComplete?: () => void;
}

export function StartEffect({ onComplete }: StartEffectProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // エフェクト完了後にコールバックを実行
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* フラッシュエフェクト */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.5, times: [0, 0.1, 1] }}
          className="absolute inset-0 bg-white"
        />

        {/* 中央から広がる波紋 */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 2.5, opacity: 0 }}
              transition={{
                duration: 1,
                delay: i * 0.2,
                ease: "easeOut",
              }}
              className="absolute w-96 h-96 rounded-full border-2 border-purple-500"
              style={{
                background:
                  "radial-gradient(circle, rgba(147,51,234,0.2) 0%, rgba(147,51,234,0) 70%)",
              }}
            />
          ))}
        </div>

        {/* パーティクル爆発エフェクト */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                x: "-50%",
                y: "-50%",
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x: `calc(-50% + ${(Math.random() - 0.5) * 500}px)`,
                y: `calc(-50% + ${(Math.random() - 0.5) * 500}px)`,
                scale: [0, 1.5, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500"
            />
          ))}
        </div>

        {/* エネルギー集中エフェクト */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-fuchsia-600"
            style={{
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
