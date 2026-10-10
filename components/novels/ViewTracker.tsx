"use client";

import { useEffect, useRef } from "react";

interface ViewTrackerProps {
  novelId: string;
}

export function ViewTracker({ novelId }: ViewTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!novelId || trackedRef.current) return;
    trackedRef.current = true;

    // Check session storage to prevent inflating count on multiple F5 refreshes in same tab
    const sessionKey = `bluenov_view_${novelId}`;
    try {
      const alreadyTracked = sessionStorage.getItem(sessionKey);
      if (alreadyTracked) return;
      sessionStorage.setItem(sessionKey, Date.now().toString());
    } catch {}

    // Send view increment request
    fetch(`/api/novels/${novelId}/view`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    }).catch(() => {
      // Non-critical, ignore silent network drops
    });
  }, [novelId]);

  return null;
}
