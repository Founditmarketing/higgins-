import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import MobileBar from "@/components/MobileBar";
import "../about/about.css";
import "./page.css";

export default function TeamPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* INNER HERO TEMPLATE */}
        <section className="ih">
          <div className="ih-bg">
            <img
              className="plx"
              style={{ objectPosition: "50% 30%" }}
              data-plx=".08"
              src="/higginlawdoubleteampic.jpeg"
              alt="Higgins Law Team"
              loading="eager"
            />
            <div className="ih-g"></div>
          </div>
          <div className="ih-c">
            <div className="wrap">
              <div className="htag">
                <span className="df">Our Attorneys</span>
                <span className="mf">Our Team</span>
              </div>
              <h1 className="wr go">
                <span className="w" style={{ transitionDelay: "0.1s" }}>Experience</span><br />
                <span className="w" style={{ transitionDelay: "0.2s" }}>You</span>{" "}
                <span className="w" style={{ transitionDelay: "0.3s" }}>Can</span>{" "}
                <span className="w" style={{ transitionDelay: "0.4s" }}><em>Trust.</em></span>
              </h1>
            </div>
          </div>
        </section>

        {/* INNER CONTENT GRID */}
        <section className="ic sec s-elev">
          <div className="wrap ic-w">
            <div className="ic-main">
              <div className="sl" data-r>Meet the Team</div>
              <h2 className="sh" data-r="d1">
                Generations of<br />
                <em>Louisiana Advocacy.</em>
              </h2>
              <div className="ic-body" data-r="d2">
                <p>
                  A tradition of integrity passed from father to son &mdash; blending the wisdom of four decades with the drive of a new generation. We are proud to defend the rights and futures of families across Central Louisiana.
                </p>

                <div className="team-row" style={{ marginTop: "4rem" }}>
                  <img src="/George Lewis Higgins III.jpeg" alt="George Lewis Higgins III" />
                  <div>
                    <h3>George Lewis Higgins III</h3>
                    <span className="team-title">Founding Attorney</span>
                    <p>
                      With over forty years of courtroom experience, George Higgins has built a deeply respected reputation across Louisiana as a formidable advocate and trusted counselor. Through thousands of proceedings, his litigation style has been defined by unwavering integrity, meticulous preparation, and a preeminent understanding of state law.
                    </p>
                    <p>
                      He has dedicated his distinguished career to defending the rights of individuals and families when the stakes are at their absolute highest. Opposing counsel knows that George approaches every single case as if it will inevitably reach a jury, a standard of tireless preparation that consistently secures critical leverage for his clients.
                    </p>
                  </div>
                </div>

                <div className="team-row">
                  <img src="/G. Alexander Higgins.jpeg" alt="G. Alexander Higgins" />
                  <div>
                    <h3>G. Alexander Higgins</h3>
                    <span className="team-title">Attorney &amp; Managing Partner</span>
                    <p>
                      Alex Higgins carries the firm&apos;s legacy forward with a relentless, modern vision for defense and advocacy. Combining the strategic wisdom instilled by a lifetime of legal mentorship with his own elite courtroom instincts, Alex leads Higgins Law into its next chapter without ever compromising its foundational principles.
                    </p>
                    <p>
                      He believes that high-tier legal representation must be paired with fundamental human dignity. Alex is profoundly committed to absolute accessibility, ensuring his clients are actively consulted and continuously informed throughout complex, stressful litigation processes. He fights aggressively to secure stability and resolution for those who need it most.
                    </p>
                  </div>
                </div>

              </div>
            </div>
            
            <aside className="ic-side" data-r="d3">
              <div className="ic-badge-card highlight">
                <h3>Direct Access</h3>
                <p>When you hire Higgins Law, you speak directly with your attorney. No runarounds. No barriers.</p>
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
