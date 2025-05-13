/*
'use client';


'use client';

// Import necessary dependencies

// Custom hook to track user interactions and analytics for a specific document
export const useDocumentAnalytics = (documentId: string) => {
    useEffect(() => {
        // Record the start time when the component mounts
        const startTime = Date.now();

        // 👆 Click tracking: Captures details of elements clicked by the user
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement; // Get the clicked element
            posthog.capture('element_clicked', {
                tag: target.tagName, // Tag name of the element (e.g., DIV, BUTTON)
                text: target.innerText?.slice(0, 100), // First 100 characters of the element's text
                id: target.id || null, // Element's ID (if available)
                class: target.className || null, // Element's class name (if available)
                documentId // ID of the document being tracked
            });
        };

        // 👇 Scroll tracking: Captures the percentage of the document scrolled by the user
        const handleScroll = () => {
            const scrollTop = window.scrollY; // Current vertical scroll position
            const docHeight = document.documentElement.scrollHeight - window.innerHeight; // Total scrollable height
            const scrollPercent = (scrollTop / docHeight) * 100; // Calculate scroll percentage

            posthog.capture('scroll_depth', {
                scrollPercent: Math.round(scrollPercent), // Round to nearest integer
                documentId // ID of the document being tracked
            });
        };

        // Add event listeners for click and scroll events
        document.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll);

        // ⏳ Time on page: Cleanup function to capture time spent on the document
        return () => {
            const duration = Math.round((Date.now() - startTime) / 1000); // Calculate duration in seconds
            posthog.capture('document_time_spent', {
                duration_seconds: duration, // Total time spent on the document
                documentId // ID of the document being tracked
            });

            // Remove event listeners to prevent memory leaks
            document.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [documentId]); // Re-run the effect if the documentId changes
};

import { useEffect } from 'react';
import posthog from 'posthog-js';

// Custom hook to track user interactions and analytics for a specific document
export const useDocumentAnalytics = (documentId: string) => {
    useEffect(() => {
        // Record the start time when the component mounts
        const startTime = Date.now();

        // 👆 Click tracking: Captures details of elements clicked by the user
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement; // Get the clicked element
            posthog.capture('element_clicked', {
                tag: target.tagName, // Tag name of the element (e.g., DIV, BUTTON)
                text: target.innerText?.slice(0, 100), // First 100 characters of the element's text
                id: target.id || null, // Element's ID (if available)
                class: target.className || null, // Element's class name (if available)
                documentId // ID of the document being tracked
            });
        };

        // 👇 Scroll tracking: Captures the percentage of the document scrolled by the user
        const handleScroll = () => {
            const scrollTop = window.scrollY; // Current vertical scroll position
            const docHeight = document.documentElement.scrollHeight - window.innerHeight; // Total scrollable height
            const scrollPercent = (scrollTop / docHeight) * 100; // Calculate scroll percentage

            posthog.capture('scroll_depth', {
                scrollPercent: Math.round(scrollPercent), // Round to nearest integer
                documentId // ID of the document being tracked
            });
        };

        // Add event listeners for click and scroll events
        document.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll);

        // ⏳ Time on page: Cleanup function to capture time spent on the document
        return () => {
            const duration = Math.round((Date.now() - startTime) / 1000); // Calculate duration in seconds
            posthog.capture('document_time_spent', {
                duration_seconds: duration, // Total time spent on the document
                documentId // ID of the document being tracked
            });

            // Remove event listeners to prevent memory leaks
            document.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [documentId]); // Re-run the effect if the documentId changes
};

*/
