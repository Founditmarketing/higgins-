"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import "./Navbar.css";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Initial check
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleMenu = () => {
    const nextState = !menuOpen;
    setMenuOpen(nextState);
    if (typeof document !== "undefined") {
      document.body.style.overflow = nextState ? "hidden" : "";
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  };

  return (
    <nav className={`nav ${scrolled ? "sc" : ""} ${menuOpen ? "menu-open" : ""}`} id="nav">
      <div className="ni">
        <Link href="/" className="nb" onClick={closeMenu}>
          <Image
            src="/higginslawnewhorizontallogo.png"
            alt="Higgins Law"
            width={240}
            height={48}
            priority
            className="nb-logo"
          />
        </Link>
        <ul className={`nl ${menuOpen ? "open" : ""}`} id="nl">
          <li>
            <Link href="/about" onClick={closeMenu}>
              About
            </Link>
          </li>
          <li>
            <Link href="/team" onClick={closeMenu}>
              Team
            </Link>
          </li>
          <li>
            <Link href="/process" onClick={closeMenu}>
              Process
            </Link>
          </li>
          <li>
            <Link href="/practice" onClick={closeMenu}>
              Practice
            </Link>
          </li>
          <li>
            <Link href="/updates" onClick={closeMenu}>
              Updates
            </Link>
          </li>
          <li>
            <Link href="/faq" onClick={closeMenu}>
              FAQ
            </Link>
          </li>
          <li>
            <a href="tel:3184734250" onClick={closeMenu} style={{ color: "var(--gold)" }}>
              318.473.4250
            </a>
          </li>
          <li className="ncw">
            <Link href="/consultation" onClick={closeMenu}>
              Free Consultation
            </Link>
          </li>
        </ul>
        <button
          className={`nt ${menuOpen ? "act" : ""}`}
          id="nt"
          aria-label="Menu"
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}
