import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import MobileBar from "@/components/MobileBar";
import "../about/about.css";
import "./page.css";

export default function ProcessPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* INNER HERO TEMPLATE */}
        <section className="ih">
          <div className="ih-bg">
            <img
              className="plx"
              data-plx=".08"
              src="/higginslawinlawroom.jpeg"
              alt="Our Legal Process"
              loading="eager"
            />
            <div className="ih-g"></div>
          </div>
          <div className="ih-c">
            <div className="wrap">
              <div className="htag">
                <span className="df">How We Work</span>
                <span className="mf">Our Process</span>
              </div>
              <h1 className="wr go">
                <span className="w" style={{ transitionDelay: "0.1s" }}>Three</span>{" "}
                <span className="w" style={{ transitionDelay: "0.2s" }}>Steps</span>{" "}
                <span className="w" style={{ transitionDelay: "0.3s" }}>to</span><br />
                <span className="w" style={{ transitionDelay: "0.4s" }}><em>Protecting</em></span>{" "}
                <span className="w" style={{ transitionDelay: "0.5s" }}><em>Your</em></span>{" "}
                <span className="w" style={{ transitionDelay: "0.6s" }}><em>Future.</em></span>
              </h1>
            </div>
          </div>
        </section>

        {/* INNER CONTENT GRID */}
        <section className="ic sec s-elev">
          <div className="wrap ic-w">
            <div className="ic-main">
              <div className="sl" data-r>How It Works</div>
              <h2 className="sh" data-r="d1">
                Straightforward Guidance.<br />
                <em>No Exceptions.</em>
              </h2>
              <div className="ic-body" data-r="d2">
                <p>
                  Legal situations often arrive tangled in confusion, anxiety, and uncertainty. Our focus is completely untangling the complexity so you can focus exclusively on your family and your health while we aggressively shield what matters most. 
                </p>
                <p>
                  When you retain Higgins Law, you are immediately walked through our established, three-step framework. You will never be left to wonder what comes next or what our strategy looks like moving into the courtroom.
                </p>

                <div className="proc-step">
                  <div className="proc-num">01</div>
                  <div>
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                    </svg>
                    <h3>Free Consultation</h3>
                    <p>
                      Communication is the absolute bedrock of our firm. The process starts simple: call us or fill out the form. We will actively listen to your situation, exhaustively answer your initial questions, and clearly explain all available legal avenues entirely at no cost and zero obligation to you. We simply assess the facts on the table.
                    </p>
                  </div>
                </div>

                <div className="proc-step">
                  <div className="proc-num">02</div>
                  <div>
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    <h3>Strategy &amp; Preparation</h3>
                    <p>
                      If we take the case, we immediately commence building a tailored, unshakeable legal strategy. We rapidly gather all essential evidence, secure vital expert testimony from our extensive network when needed, and meticulously prepare every single dimension of your case with surgical precision. We treat every file as though it is bound for a jury trial.
                    </p>
                  </div>
                </div>

                <div className="proc-step">
                  <div className="proc-num">03</div>
                  <div>
                    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3>Resolution &amp; Results</h3>
                    <p>
                      We refuse to accept unfavorable compromises. Whether fighting through aggressive negotiation channels or defending you at a litigious public trial, we pursue the absolute maximum possible outcome—fiercely protecting your reputation, your familial structure, and your financial future without backing down.
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            <aside className="ic-side" data-r="d3">
              <div className="ic-badge-card highlight">
                <h3>Start Step 01</h3>
                <p>We are ready to hear your story. Reach out to secure your initial consultation and establish a path forward.</p>
                <a href="#contact" className="btn bg" style={{ width: "100%", justifyContent: "center" }}>
                  <span>Free Consultation</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
