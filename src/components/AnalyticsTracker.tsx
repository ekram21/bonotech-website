import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView, trackSectionView } from "@/lib/analytics";

const SECTION_IDS = [
  "home",
  "sprint-numbers",
  "our-clients",
  "about-bonotech",
  "delivery-times",
  "ways-in",
  "service-tiers",
  "expertise-summary",
  "our-technology",
  "client-testimonials",
  "discovery-call",
  "footer",
] as const;

/**
 * Emits page_view on route changes and section_view when homepage
 * sections enter the viewport (once per section per page load).
 */
export function AnalyticsTracker() {
  const location = useLocation();
  const seenSections = useRef(new Set<string>());

  useEffect(() => {
    if (location.pathname.startsWith("/admin")) return;
    const path = `${location.pathname}${location.hash || ""}`;
    trackPageView(path);
    seenSections.current = new Set();
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id;
          if (!id || seenSections.current.has(id)) continue;
          seenSections.current.add(id);
          trackSectionView(id);
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -10% 0px" },
    );

    const nodes: Element[] = [];
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el) {
        nodes.push(el);
        observer.observe(el);
      }
    }

    return () => {
      observer.disconnect();
      nodes.length = 0;
    };
  }, [location.pathname]);

  return null;
}
