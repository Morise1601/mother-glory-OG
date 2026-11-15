"use client";

import { useEffect, useRef, useState } from "react";
import type { AnimationItem } from "lottie-web";

interface LottieLoaderProps {
  size?: number;
  className?: string;
  text?: string;
  subtext?: string;
  loop?: boolean;
}

export default function LottieLoader({
  size = 220,
  className = "",
  loop = true,
}: LottieLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Dynamically import lottie-web on client side
    import("lottie-web")
      .then((lottieModule) => {
        if (!isMounted || !containerRef.current) return;
        const lottie = lottieModule.default || lottieModule;

        // Clean up any existing animation instance
        if (animRef.current) {
          animRef.current.destroy();
        }

        try {
          animRef.current = lottie.loadAnimation({
            container: containerRef.current,
            renderer: "svg",
            loop,
            autoplay: true,
            path: "/MGCT_Loader.json",
          });
        } catch {
          if (isMounted) setHasError(true);
        }
      })
      .catch(() => {
        if (isMounted) setHasError(true);
      });

    return () => {
      isMounted = false;
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [loop]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center select-none ${className}`}
    >
      <div
        ref={containerRef}
        style={{ width: size, height: size }}
        className="relative flex items-center justify-center shrink-0"
      >
        {/* Subtle fallback spinner if SVG rendering is delayed or unsupported */}
        {hasError && (
          <div
            style={{ width: size * 0.4, height: size * 0.4 }}
            className="rounded-full border-3 border-[#122452]/20 border-t-[#B68A35] animate-spin"
          />
        )}
      </div>
    </div>
  );
}
