"use client";

import LottieLoader from "./LottieLoader";

interface PageLoaderProps {
  fullScreen?: boolean;
  size?: number;
}

export default function PageLoader({
  fullScreen = true,
  size = 240,
}: PageLoaderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#FAF8F3] select-none ${
        fullScreen
          ? "fixed inset-0 z-50 w-screen h-screen overflow-hidden"
          : "w-full min-h-[360px] p-8"
      }`}
    >
      <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300">
        <LottieLoader size={size} />
      </div>
    </div>
  );
}
