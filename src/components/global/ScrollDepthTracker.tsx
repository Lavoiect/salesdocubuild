"use client";

import { useEffect, useRef } from "react";
import posthog from "posthog-js";

interface Props {
  documentId: string;
}

export default function ScrollDepthTracker({ documentId }: Props) {

    const trackedPercents = useRef<Set<number>>(new Set());

    useEffect(() => {
        const timeout = setTimeout(() => {
          const scrollHeight = document.documentElement.scrollHeight;
          const clientHeight = window.innerHeight;
      
          console.log("ScrollDepthTracker mounted", {
            scrollHeight,
            clientHeight,
          });
      
          if (scrollHeight <= clientHeight) {
            posthog.capture("scroll_depth", {
              documentId,
              percent: 100,
              autoMarked: true,
            });
            return;
          }
      
          const handleScroll = () => {
            const scrollTop = window.scrollY;
            const maxScroll = scrollHeight - clientHeight;
            if (maxScroll <= 0) return;
      
            const percent = Math.round((scrollTop / maxScroll) * 100);
            const rounded = Math.floor(percent / 10) * 10;
      
            if (rounded > 0 && rounded <= 100 && !trackedPercents.current.has(rounded)) {
              trackedPercents.current.add(rounded);
              posthog.capture("scroll_depth", {
                documentId,
                percent: rounded,
              });
            }
          };
      
          window.addEventListener("scroll", handleScroll);
          handleScroll(); // trigger once on mount
      
          return () => window.removeEventListener("scroll", handleScroll);
        }, 100); // Wait 100ms
      
        return () => clearTimeout(timeout);
      }, [documentId]);
      

  return null;
}