"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./MobileBar.css";

export default function MobileBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past roughly the hero section height (80vh)
      if (window.scrollY > window.innerHeight * 0.8) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`mob-bar ${show ? "show" : ""}`}>
      <a href="tel:3184734250" className="mb-call">
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
        </svg>
        Call Now
      </a>
      <Link href="/consultation" className="mb-consult">
        Free Consultation
      </Link>
    </div>
  );
}
