"use client";

import { useCallback, useState } from "react";

export function useFadeIn(threshold = 0.15) {
  const [isVisible, setIsVisible] = useState(false);

  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(node);
          }
        },
        { threshold }
      );
      observer.observe(node);
    },
    [threshold]
  );

  return [callbackRef, isVisible] as const;
}
