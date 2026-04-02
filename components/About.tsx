import "./About.css";

export default function About() {
  return (
    <section className="sec s-elev" id="about" style={{ position: 'relative' }}>
      <div className="ab-watermark"></div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ab-g">
          <div className="ab-m" data-r>
            <div className="ab-ib"></div>
            <div className="ab-iw">
              <img
                className="plx"
                data-plx="-.04"
                src="/george-higgins-meeting.webp"
                alt="George Higgins consulting with a client"
                loading="lazy"
              />
              <div className="ab-io"></div>
            </div>
            <div className="ab-badge">
              <div className="abn">
                54<span style={{ fontSize: ".5em", color: "var(--goldd)" }}>+</span>
              </div>
              <div className="abt">
                Years Combined<br />
                Experience
              </div>
            </div>
          </div>
          <div className="ab-c">
            <div className="sl" data-r>About the Firm</div>
            <h2 className="sh" data-r="d1">
              Trusted Advocates.<br />
              Steady Support.<br />
              <em>Rooted in Louisiana.</em>
            </h2>
            <div data-r="d2">
              <p>
                At Higgins Law, every case matters &mdash; your freedom, your family, your future. Whether defending against charges, planning for your estate, or seeking justice after an injury, we guide you with skill and care.
              </p>
              <p>
                As a father&ndash;son firm in Pineville, we bring a personal, hands-on approach. You&apos;ll never be treated as just a file. Clear communication and steady support are our promises.
              </p>
              <p>
                Our mission is to resolve matters efficiently while safeguarding what matters most. With Higgins Law, you gain more than representation &mdash; you gain a team committed to your rights, your family, and your future.
              </p>
            </div>
            <div className="ab-p" data-r="d3">
              <div>
                <div className="pn">54+</div>
                <div className="pt">Years Combined</div>
              </div>
              <div>
                <div className="pn">4</div>
                <div className="pt">Practice Areas</div>
              </div>
              <div>
                <div className="pn">&infin;</div>
                <div className="pt">Commitment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
