"use client";

import React from "react";

interface ReaderProgressBarProps {
  progressPercent: number;
  currentChapterNumber: number;
  totalChapters?: number;
  estimatedMinutes?: number;
  className?: string;
}

export function ReaderProgressBar({
  progressPercent,
  currentChapterNumber,
  totalChapters,
  estimatedMinutes,
  className = "",
}: ReaderProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round(progressPercent)));

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 pointer-events-none ${className}`}
      style={{ height: "3px", background: "rgba(0, 0, 0, 0.08)" }}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          height: "100%",
          width: `${percent}%`,
          background: "linear-gradient(90deg, var(--brand-sky) 0%, var(--accent) 100%)",
          transition: "width 0.15s ease-out",
          boxShadow: "0 0 8px var(--accent)",
        }}
      />
    </div>
  );
}
