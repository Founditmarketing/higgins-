"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./Preloader.css";

export default function Preloader() {
  const [fadeOut, setFadeOut] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
      document.body.classList.add("loading-lock");
      window.scrollTo(0, 0); // Ensure they load at top
    }

    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
      }
    }, 2400);

    const unlockTimer = setTimeout(() => {
      if (typeof document !== "undefined") {
        document.body.classList.remove("loading-lock");
      }
    }, 3100);

    const unmountTimer = setTimeout(() => {
      setUnmounted(true);
    }, 3400);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(unlockTimer);
      clearTimeout(unmountTimer);
      if (typeof document !== "undefined") {
        document.body.style.overflow = "";
        document.body.classList.remove("loading-lock");
      }
    };
  }, []);

  if (unmounted) return null;

  return (
    <div className={`preloader ${fadeOut ? "fade-out" : ""}`}>
      <div className="pl-logo-wrapper">
        <Image
          src="/higginslawlogonocircle.png"
          alt="Higgins Law"
          width={50}
          height={50}
          priority
          quality={100}
          unoptimized={true}
          className="pl-logo"
          style={{ opacity: 0 }}
        />
        <svg className="pl-ring" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <circle className="pl-top" cx="100" cy="100" r="90" style={{ strokeDashoffset: 260 }} />
          <circle className="pl-bot" cx="100" cy="100" r="90" style={{ strokeDashoffset: 260 }} />
        </svg>
      </div>
    </div>
  );
}
