"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  // Reveal Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    // Initial check for elements
    const elements = document.querySelectorAll("[data-r]");
    elements.forEach((el) => observer.observe(el));

    // Cleanup observer on unmount
    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [pathname]);

  // Parallax Logic
  useEffect(() => {
    let ticking = false;

    const updateParallax = () => {
      const plxElements = Array.from(document.querySelectorAll<HTMLElement>(".plx"));
      
      const isMobile = window.innerWidth <= 768;
      document.querySelectorAll<HTMLElement>(".plx-mobile").forEach((el) => {
        if (isMobile) plxElements.push(el);
        else el.style.transform = "";
      });

      plxElements.forEach((el) => {
        const speed = parseFloat(el.dataset.plx || "0");
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        let offset = (center - window.innerHeight / 2) * speed;
        
        // Clamp translation aggressively to mathematically prevent tearing/gaps
        const limit = rect.height * 0.06;
        offset = Math.max(-limit, Math.min(limit, offset));

        el.style.transform = `translateY(${offset}px)`;
      });
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateParallax();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  return null;
}
