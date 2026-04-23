"use client";
import { useEffect, useRef } from "react";
import "./Practice.css";

export default function Practice() {
  const scrollWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sw = scrollWrapperRef.current;
    if (!sw) return;

    const updateCards = () => {
      const cards = sw.querySelectorAll<HTMLElement>(".pc");
      const sl = sw.scrollLeft;
      const vw = sw.clientWidth;

      cards.forEach((c) => {
        const cl = c.offsetLeft - sl;
        const cc = cl + c.offsetWidth / 2;
        const center = vw / 2;
        const dist = Math.abs(cc - center);
        const maxD = vw * 0.7;
        const ratio = Math.max(0, 1 - dist / maxD);

        c.style.opacity = (0.4 + ratio * 0.6).toFixed(2);
        c.style.transform = `scale(${(0.95 + ratio * 0.05).toFixed(3)}) translateY(${((1 - ratio) * 8).toFixed(1)}px)`;
      });
    };

    sw.addEventListener("scroll", updateCards, { passive: true });
    window.addEventListener("resize", updateCards);
    updateCards();

    return () => {
      sw.removeEventListener("scroll", updateCards);
      window.removeEventListener("resize", updateCards);
    };
  }, []);

  return (
    <section className="sec s-dark" id="practice">
      <div className="wrap">
        <div className="pr-h">
          <div>
            <div className="sl" data-r>Areas of Practice</div>
            <h2 className="sh" data-r="d1">
              Protecting Your Rights,<br />
              Securing Your <em>Future.</em>
            </h2>
          </div>
          <p className="sd" data-r="d2">
            Trusted legal guidance and strong representation across Louisiana for over five decades.
          </p>
        </div>
      </div>
      <div className="wrap pr-c">
        <div className="pr-sw" ref={scrollWrapperRef}>
          <div className="pr-tr">
            <div className="pr-intro-m df">
              <div className="pr-intro-ib"></div>
              <div className="pr-intro-img">
                <img src="/alex-higgins-meeting.webp" alt="Alex Higgins Meeting" />
                <div className="pr-io"></div>
              </div>
            </div>
            <div className="pc">
              <div className="pcn">01</div>
              <h3>Criminal Defense</h3>
              <p>We stand for the person behind the accusation &mdash; protecting your rights, telling your story, and fighting for your future.</p>
              <div className="ps">
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Guidance at Every Step</h4><p>You&apos;ll understand the process, know your options, and never feel left in the dark.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Defense Built Around You</h4><p>We analyze evidence, challenge the State&apos;s claims, and develop a strategy for your future.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Trial Experience That Matters</h4><p>Decades of advocacy ready to fight for the best possible outcome.</p></div></div>
              </div>
            </div>
            <div className="pc">
              <div className="pcn">02</div>
              <h3>Estate Planning</h3>
              <p>Protecting your family, preserving your legacy, and making sure your wishes are carried out with clarity.</p>
              <div className="ps">
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Wills &amp; Trusts</h4><p>Safeguard assets, reduce conflict, and protect your family&apos;s future.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Powers of Attorney</h4><p>Ensure decisions are in the hands of those you trust most.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Successions &amp; Probate</h4><p>Guiding families through the process with clarity and compassion.</p></div></div>
              </div>
            </div>
            <div className="pc">
              <div className="pcn">03</div>
              <h3>Personal Injury</h3>
              <p>We combine negotiation, clear communication, and trial-ready strategies to maximize results for you and your family.</p>
              <div className="ps">
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Listening to Your Story</h4><p>Our advocacy reflects the full reality of your loss.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Building a Relentless Case</h4><p>Medical records, expert testimony &mdash; thorough and deliberate.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Negotiating from Strength</h4><p>Our trial reputation gives us leverage at the table.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Maximizing Compensation</h4><p>Medical bills, lost wages, pain &mdash; nothing left on the table.</p></div></div>
              </div>
            </div>
            <div className="pc">
              <div className="pcn">04</div>
              <h3>Juvenile Law</h3>
              <p>We stand beside families facing difficult times. Our focus is always the well-being and future of the young person involved.</p>
              <div className="ps">
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Delinquency Defense</h4><p>Protecting minors with emphasis on rehabilitation, not punishment.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Custody &amp; DCFS</h4><p>Standing with parents when DCFS threatens parental rights.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Adult Charge Protection</h4><p>Fighting to keep juveniles in the juvenile system.</p></div></div>
                <div className="pst"><div className="pst-a">&rarr;</div><div><h4>Family Solutions</h4><p>Guidance and resources to help families heal and rebuild.</p></div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="pr-hint" data-r>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          Scroll to explore all practice areas
        </div>
      </div>
    </section>
  );
}
