"use client";

import { useState, useCallback } from "react";

export function useStartEffect() {
  const [isPlaying, setIsPlaying] = useState(false);

  const play = useCallback(() => {
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
