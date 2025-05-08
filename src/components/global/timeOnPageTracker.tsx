// components/TimeOnPageTracker.tsx
"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function TimeOnPageTracker({ documentId }: { documentId: string }) {
    useEffect(() => {
        const startTime = Date.now();

        const sendTimeSpent = () => {
            const duration = (Date.now() - startTime) / 1000; // seconds
            if (duration > 1) {
                posthog.capture("document_time_spent", {
                    documentId,
                    duration,
                });
            }
        };

        window.addEventListener("beforeunload", sendTimeSpent);
        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") sendTimeSpent();
        });

        return () => {
            sendTimeSpent();
            window.removeEventListener("beforeunload", sendTimeSpent);
        };
    }, [documentId]);

    return null;
}
