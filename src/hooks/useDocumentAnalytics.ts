'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export const useDocumentAnalytics = (documentId: string) => {
  useEffect(() => {
    const startTime = Date.now();

    // 👆 Click tracking
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      posthog.capture('element_clicked', {
        tag: target.tagName,
        text: target.innerText?.slice(0, 100),
        id: target.id || null,
        class: target.className || null,
        documentId
      });
    };

    // 👇 Scroll tracking
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;

      posthog.capture('scroll_depth', {
        scrollPercent: Math.round(scrollPercent),
        documentId
      });
    };

    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    // ⏳ Time on page
    return () => {
      const duration = Math.round((Date.now() - startTime) / 1000);
      posthog.capture('document_time_spent', {
        duration_seconds: duration,
        documentId
      });

      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [documentId]);
};
