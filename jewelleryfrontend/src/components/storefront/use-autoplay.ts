"use client";
import { useEffect, useRef, useState } from "react";
/** Stop for pointer/keyboard interaction, background tabs and reduced motion. */
export function useAutoplay(count: number) {
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    const stop = () => clearInterval(timer);
    const start = () => {
      stop();
      if (
        !document.hidden &&
        !motion.matches &&
        !element.matches(":hover") &&
        !element.contains(document.activeElement)
      )
        timer = setInterval(() => setIndex((i) => (i + 1) % count), 4000);
    };
    const blur = () => {
      focusTimer = setTimeout(start, 0);
    };
    element.addEventListener("mouseenter", stop);
    element.addEventListener("mouseleave", start);
    element.addEventListener("focusin", stop);
    element.addEventListener("focusout", blur);
    document.addEventListener("visibilitychange", start);
    motion.addEventListener("change", start);
    start();
    return () => {
      stop();
      clearTimeout(focusTimer);
      element.removeEventListener("mouseenter", stop);
      element.removeEventListener("mouseleave", start);
      element.removeEventListener("focusin", stop);
      element.removeEventListener("focusout", blur);
      document.removeEventListener("visibilitychange", start);
      motion.removeEventListener("change", start);
    };
  }, [count]);
  return { index, setIndex, root };
}
