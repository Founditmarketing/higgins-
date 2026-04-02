import Link from "next/link";
import MagneticBtn from "./MagneticBtn";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-bg">
        <img
          className="hero-bg-i plx-mobile"
          data-plx=".12"
          src="/newheropic2.jpeg"
          alt=""
          loading="eager"
        />
        <div className="lightning-flash"></div>
        <div className="god-rays"></div>
        <div className="hero-bg-g"></div>
      </div>
      <div className="hero-vl"></div>
      <div className="hi">
        <div>
          <div className="htag">
            <span className="df">Pineville, Louisiana &mdash; Trial Attorneys</span>
            <span className="mf">Pineville, LA</span>
          </div>
          <h1 className="wr go" id="ht">
            <span className="w" style={{ transitionDelay: "0.3s" }}>Truth.</span><br />
            <span className="w" style={{ transitionDelay: "0.4s" }}>Grace.</span><br />
            <span className="w" style={{ transitionDelay: "0.5s" }}><em>Resolution.</em></span>
          </h1>
          <p className="hsub">
            Steadfast counsel. Unwavering integrity. A calling to defend your future, your family, and your freedoms with ethical excellence.
          </p>
          <div className="hact">
            <MagneticBtn>
              <Link href="/consultation" className="btn bg">
                <span>Schedule a Consultation</span>
              </Link>
            </MagneticBtn>
            <MagneticBtn>
              <a href="tel:3184734250" className="btn bgh">
                Call 318.473.4250{" "}
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            </MagneticBtn>
          </div>
        </div>
        <div className="hlow">
          <div className="hstats">
            <div className="hs">
              <div className="hn">54+</div>
              <div className="hl">
                <span className="df">Years Combined Experience</span>
                <span className="mf">Years Experience</span>
              </div>
            </div>
            <div className="hs">
              <div className="hn">4</div>
              <div className="hl">Practice Areas</div>
            </div>
            <div className="hs">
              <div className="hn">2</div>
              <div className="hl">
                <span className="df">Generations of Advocacy</span>
                <span className="mf">Generations</span>
              </div>
            </div>
          </div>
          <div className="hscr">
            <div className="hscr-l"></div>
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
