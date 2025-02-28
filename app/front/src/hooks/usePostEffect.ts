"use client";

import { useState, useCallback } from "react";

export function usePostEffect() {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback((distance?: number) => {
    setIsPlaying(true);
  }, []);

  const handleComplete = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    play,
    handleComplete,
  };
}
