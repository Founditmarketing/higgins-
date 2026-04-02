import "./Marquee.css";

interface MarqueeProps {
  reverse?: boolean;
  items: string[];
}

export default function Marquee({ reverse = false, items }: MarqueeProps) {
  return (
    <div className="marquee">
      <div
        className="marquee-track"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: reverse ? "35s" : "30s",
        }}
      >
        <div className="marquee-item">
          {items.map((item, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <span>{item}</span>
              <span className="dot"></span>
            </span>
          ))}
        </div>
        <div className="marquee-item">
          {items.map((item, i) => (
            <span key={`dup-${i}`} style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
              <span>{item}</span>
              <span className="dot"></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
