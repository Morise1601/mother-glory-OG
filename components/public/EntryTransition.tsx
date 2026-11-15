"use client";

import { useEffect, useRef, ReactNode } from "react";

export interface EntryTransitionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function EntryTransition({
  children,
  className = "",
  delay = 0,
}: EntryTransitionProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = elementRef.current;
    if (!current) return;
    // Content remains visible during SSR and with reduced motion or no observer.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          current.classList.remove('entry-pending');
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    current.classList.add('entry-pending');
    observer.observe(current);

    return () => {
      observer.disconnect();
      current.classList.remove('entry-pending');
    };
  }, []);

  return (
    <div
      ref={elementRef}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`entry-transition transition-all duration-600 ease-out ${className}`}
    >
      {children}
    </div>
  );
}

export default EntryTransition;

