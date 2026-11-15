"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Trash2, X, Loader2 } from "lucide-react";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string | React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "primary";
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & trap focus
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (!isLoading) onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Auto-focus the cancel or confirm button safely
    confirmButtonRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const isDanger = variant === "danger";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop with Mother Glory navy/black tint & blur */}
      <div
        className="fixed inset-0 bg-[#0c1836]/65 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in"
        onClick={() => {
          if (!isLoading) onClose();
        }}
      />

      {/* Dialog Card Styled in Mother Glory Institution Theme */}
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl sm:rounded-3xl bg-[#FAF8F3] border border-[#DFE3EA] p-6 sm:p-7 shadow-2xl z-10 transition-all duration-200 animate-in zoom-in-95"
      >
        {/* Close "X" Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-[#596579] hover:text-[#122452] hover:bg-white border border-transparent hover:border-[#DFE3EA] transition-all cursor-pointer disabled:opacity-40"
          aria-label="Close confirmation dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dialog Header / Icon */}
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-xs ${isDanger
                ? "bg-rose-50 border-rose-200 text-rose-600"
                : "bg-amber-50 border-amber-200 text-amber-600"
              }`}
          >
            {isDanger ? (
              <Trash2 className="w-5 h-5 text-rose-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            )}
          </div>

          <div className="space-y-1.5 pr-4">
            <h3
              id="confirm-dialog-title"
              className="font-serif font-bold text-lg sm:text-xl text-[#122452] leading-tight"
            >
              {title}
            </h3>
            <div className="text-xs sm:text-sm text-[#596579] leading-relaxed">
              {description}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-5 border-t border-[#DFE3EA] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-[#DFE3EA] text-xs sm:text-sm font-semibold text-[#122452] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${isDanger
                ? "bg-[#DC2626] hover:bg-[#B91C1C] hover:shadow-lg focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                : "bg-[#B68A35] hover:bg-[#9c7328] hover:shadow-lg focus:ring-2 focus:ring-[#B68A35] focus:ring-offset-2"
              }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

