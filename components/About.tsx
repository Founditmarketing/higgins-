import "./About.css";

export default function About() {
  return (
    <section className="sec s-elev" id="about" style={{ position: 'relative' }}>
      <div className="ab-watermark"></div>
      <div className="wrap" style={{ position: 'relative', zIndex: 1 }}>
        <div className="ab-g">

          {/* Sibling 1: The Content (Desktop layout places this on the right) */}
          <div className="ab-c">
            <div className="sl" data-r>About the Firm</div>
            <h2 className="sh" data-r="d1">We Listen. We Fight.<br /><em>We Win.</em></h2>
            
            <p className="sd" data-r="d2">
              When you contact Higgins Law, you don&apos;t just get a case number. You get a direct line to attorneys who know your family, understand your struggles, and have the experience to push back against insurance giants. 
            </p>
            <p data-r="d2">
              We are not a volume-based firm. We are trial lawyers. We meticulously prepare every case as if it will go before a jury, a strategy that often forces early, maximum settlements.
            </p>
            <p className="df" data-r="d3">
              Born and raised in Louisiana, our attorneys leverage their deep community roots and courtroom authority to secure your future.
            </p>

            {/* Sibling 1.A: The Stats (Desktop puts this below the text, Mobile stacks it) */}
            <div className="ab-p" data-r="d3">
              <div>
                <div className="pn">54+</div>
                <div className="pt">Years of Combined Experience</div>
              </div>
              <div>
                <div className="pn">04</div>
                <div className="pt">Louisiana Locations</div>
              </div>
              <div>
                <div className="pn">&infin;</div>
                <div className="pt">Commitment to Clients</div>
              </div>
            </div>
          </div>

          {/* Sibling 2: The Image (Desktop layout places this on the left) */}
          <div className="ab-m" data-r>
            <div className="ab-ib"></div>
            <div className="ab-iw">
              <img src="/george-higgins-meeting.webp" alt="George Higgins III consulting with a client" loading="lazy" />
            </div>
            <div className="ab-io"></div>
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

        </div>
      </div>
    </section>
  );
}
