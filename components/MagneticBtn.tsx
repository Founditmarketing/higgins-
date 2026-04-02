"use client";
import { useRef, useState, ReactNode } from "react";

export default function MagneticBtn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.25, y: middleY * 0.25 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      style={{ display: "inline-block" }}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: position.x === 0 ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "transform 0.1s linear",
          display: "inline-block"
        }}
      >
        {children}
      </div>
    </div>
  );
}
