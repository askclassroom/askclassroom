"use client";

import { useEffect, useRef } from "react";

/**
 * Attaches an IntersectionObserver to the returned ref.
 * When the element enters the viewport, the class `lp-visible` is added,
 * triggering the CSS reveal animations defined in globals.css.
 */
export function useScrollReveal(threshold = 0.15) {
    const ref = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("lp-visible");
                        observer.unobserve(entry.target); // fire once
                    }
                });
            },
            { threshold }
        );

        // Observe all children that have a reveal class
        const targets = el.querySelectorAll(
            ".lp-reveal, .lp-reveal-left, .lp-reveal-right, .lp-reveal-scale"
        );

        targets.forEach((t) => observer.observe(t));

        return () => observer.disconnect();
    }, [threshold]);

    return ref;
}
