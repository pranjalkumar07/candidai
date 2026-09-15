"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * BfcacheHandler ensures that when a browser restores a page from the
 * Back-Forward Cache (bfcache), broken HMR WebSocket connections and
 * desynchronized router states are cleanly refreshed rather than hanging.
 */
export default function BfcacheHandler() {
  const router = useRouter();

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // event.persisted indicates the page was restored from bfcache
      if (event.persisted) {
        if (process.env.NODE_ENV === "development") {
          // Reconnect dev WebSocket and re-establish Fast Refresh cleanly
          window.location.reload();
        } else {
          // In production, refresh server-rendered data without a hard reload
          router.refresh();
        }
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}
