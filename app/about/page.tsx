import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import MobileBar from "@/components/MobileBar";
import "./about.css";

export default function AboutPage() {
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
              src="/alex-higgins-meeting.webp"
              alt="Higgins Law Firm Team"
              loading="eager"
            />
            <div className="ih-g"></div>
          </div>
          <div className="ih-c">
            <div className="wrap">
              <div className="htag">
                <span className="df">About Higgins Law</span>
                <span className="mf">About Us</span>
              </div>
              <h1 className="wr go">
                <span className="w" style={{ transitionDelay: "0.1s" }}>Built</span>{" "}
                <span className="w" style={{ transitionDelay: "0.2s" }}>on</span>{" "}
                <span className="w" style={{ transitionDelay: "0.3s" }}><em>relationships,</em></span><br />
                <span className="w" style={{ transitionDelay: "0.4s" }}><em>respect,</em></span>{" "}
                <span className="w" style={{ transitionDelay: "0.5s" }}>and</span>{" "}
                <span className="w" style={{ transitionDelay: "0.6s" }}><em>results.</em></span>
              </h1>
            </div>
          </div>
        </section>

        {/* INNER CONTENT GRID TEMPLATE */}
        <section className="ic sec s-elev">
          <div className="wrap ic-w">
            <div className="ic-main">
              <div className="sl" data-r>Our Firm&apos;s History</div>
              <h2 className="sh" data-r="d1">
                Trusted Advocates.<br />
                Steady Support.<br />
                <em>Rooted in Louisiana.</em>
              </h2>
              <div className="ic-body" data-r="d2">
                <p>
                  At Higgins Law, every case matters &mdash; your freedom, your family, your future. Whether defending against charges, planning for your estate, or seeking justice after an injury, we guide you with skill and care.
                </p>
                <p>
                  As a father&ndash;son firm in Pineville, we bring a personal, hands-on approach. You&apos;ll never be treated as just a file. Clear communication and steady support are our promises.
                </p>
                <p>
                  Our mission is to resolve matters efficiently while safeguarding what matters most. With Higgins Law, you gain more than representation &mdash; you gain a team committed to your rights, your family, and your future.
                </p>
                
                <h3>A Legacy of Results</h3>
                <p>
                  For over five decades of combined practice, George Lewis Higgins III and G. Alexander Higgins have forged a reputation in the courtroom that precedes them. Our opponents know we prepare every case as if it will go to trial. That preparation gives our clients leverage at the negotiation table and confidence before a judge or jury.
                </p>
                
                <ul>
                  <li><strong>Clear Communication:</strong> You will never be left in the dark wondering about the status of your case.</li>
                  <li><strong>Relentless Defense:</strong> We leave no stone unturned when exploring legal strategies on your behalf.</li>
                  <li><strong>Compassionate Counsel:</strong> We understand the deep personal stakes involved in every legal matter.</li>
                </ul>
              </div>
            </div>
            
            <aside className="ic-side" data-r="d3">
              <div className="ic-badge-card">
                <div className="abn" style={{ fontFamily: "var(--fd)", fontSize: "4.5rem", fontWeight: 800, color: "rgba(200, 164, 78, 0.08)", lineHeight: 0.85, marginBottom: "1rem" }}>
                  54<span style={{ fontSize: ".5em", color: "var(--goldd)" }}>+</span>
                </div>
                <div className="abt" style={{ fontFamily: "var(--fu)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--cream)" }}>
                  Years Combined<br />
                  Experience
                </div>
              </div>
              <div className="ic-badge-card highlight">
                <h3>Need Immediate Assistance?</h3>
                <p>Our team is ready to evaluate your case and map out a path forward.</p>
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
