"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ExpandableSynopsis({ text }: { text?: string }) {
  const [expanded, setExpanded] = useState(false);

  if (!text) return null;

  const isLong = text.length > 280;

  return (
    <div style={{ marginTop: "1rem" }}>
      <p
        style={{
          fontSize: "0.95rem",
          lineHeight: 1.7,
          color: "var(--text-secondary)",
          margin: 0,
          whiteSpace: "pre-line",
          maxHeight: expanded || !isLong ? "none" : "110px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {text}
        {!expanded && isLong && (
          <span
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "45px",
              background: "linear-gradient(to top, var(--bg-card) 20%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
        )}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.25rem",
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "var(--accent)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "0.4rem 0 0",
            marginTop: "0.25rem",
          }}
        >
          <span>{expanded ? "Show Less" : "Read Full Synopsis"}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      )}
    </div>
  );
}
