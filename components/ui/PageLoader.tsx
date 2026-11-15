"use client";

import LottieLoader from "./LottieLoader";

interface PageLoaderProps {
  fullScreen?: boolean;
  size?: number;
  className?: string;
}

export default function PageLoader({
  fullScreen = true,
  size = 240,
  className = "",
}: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${
        fullScreen
          ? "fixed inset-0 z-50 w-screen h-screen overflow-hidden bg-[#FAF8F3]"
          : "w-full min-h-[280px] p-6 bg-transparent"
      } ${className}`}
    >
      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        <LottieLoader size={size} />
      </div>
    </div>
  );
}
