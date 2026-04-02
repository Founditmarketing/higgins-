import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import MobileBar from "@/components/MobileBar";
import "../about/about.css";
import "./page.css";

export default function PracticePage() {
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
              src="/alexhigginswithclient.webp"
              alt="Higgins Law Practice Areas"
              loading="eager"
            />
            <div className="ih-g"></div>
          </div>
          <div className="ih-c">
            <div className="wrap">
              <div className="htag">
                <span className="df">Our Legal Services</span>
                <span className="mf">Practice Areas</span>
              </div>
              <h1 className="wr go">
                <span className="w" style={{ transitionDelay: "0.1s" }}>Fierce</span>{" "}
                <span className="w" style={{ transitionDelay: "0.2s" }}><em>Defense.</em></span><br />
                <span className="w" style={{ transitionDelay: "0.3s" }}>Focused</span>{" "}
                <span className="w" style={{ transitionDelay: "0.4s" }}><em>Counsel.</em></span>
              </h1>
            </div>
          </div>
        </section>

        {/* INNER CONTENT GRID */}
        <section className="ic sec s-elev">
          <div className="wrap ic-w">
            <div className="ic-main">
              <div className="sl" data-r>Practice Areas</div>
              <h2 className="sh" data-r="d1">
                Protecting Your Rights,<br />
                Securing Your <em>Future.</em>
              </h2>
              <div className="ic-body" data-r="d2">
                <p>
                  Trusted legal guidance and strong representation across Louisiana for over five decades. Regardless of your legal battle, we bring absolute transparency and aggressive advocacy to every specific dimension of your litigation.
                </p>

                <div style={{ marginTop: "4rem" }}>
                  <div className="prac-card">
                    <div className="prac-num">01</div>
                    <h3>Criminal Defense</h3>
                    <p>We stand for the person behind the accusation &mdash; protecting your rights, telling your story, and fighting for your future.</p>
                    <div className="prac-list">
                      <div>
                        <h4>Guidance at Every Step</h4>
                        <p>You&apos;ll understand the process, know your options, and never feel left in the dark.</p>
                      </div>
                      <div>
                        <h4>Defense Built Around You</h4>
                        <p>We analyze evidence, challenge the State&apos;s claims, and develop a strategy for your future.</p>
                      </div>
                      <div>
                        <h4>Trial Experience That Matters</h4>
                        <p>Decades of advocacy ready to fight for the best possible outcome inside a courtroom.</p>
                      </div>
                    </div>
                  </div>

                  <div className="prac-card">
                    <div className="prac-num">02</div>
                    <h3>Estate Planning &amp; Successions</h3>
                    <p>Protecting your family, preserving your legacy, and making sure your exact wishes are legally carried out with absolute clarity.</p>
                    <div className="prac-list">
                      <div>
                        <h4>Wills &amp; Trusts</h4>
                        <p>Safeguard assets effectively, drastically reduce family conflict, and map out your legacy securely.</p>
                      </div>
                      <div>
                        <h4>Powers of Attorney</h4>
                        <p>Ensure medical and financial decisions rest explicitly in the hands of those you definitively trust most.</p>
                      </div>
                      <div>
                        <h4>Successions &amp; Probate</h4>
                        <p>We actively guide grieving families rapidly through the complexities of the legal process.</p>
                      </div>
                    </div>
                  </div>

                  <div className="prac-card">
                    <div className="prac-num">03</div>
                    <h3>Personal Injury</h3>
                    <p>We combine massive negotiation leverage with sheer trial-ready reputation to maximize physical and financial results for victims.</p>
                    <div className="prac-list">
                      <div>
                        <h4>Relentless Investigation</h4>
                        <p>Our advocacy deeply reflects the uncompromising reality of your physical, emotional, and financial loss.</p>
                      </div>
                      <div>
                        <h4>Maximizing Compensation</h4>
                        <p>Medical bills, pain and suffering, dramatically reduced earning capacity &mdash; absolutely nothing is abandoned.</p>
                      </div>
                    </div>
                  </div>

                  <div className="prac-card">
                    <div className="prac-num">04</div>
                    <h3>Juvenile Law</h3>
                    <p>We proudly stand beside families facing extremely difficult times. Our primary focus is shielding the structural well-being and future capabilities of the minor involved.</p>
                    <div className="prac-list">
                      <div>
                        <h4>Delinquency Defense</h4>
                        <p>Assertively protecting accused minors with a massive overriding emphasis on rehabilitation.</p>
                      </div>
                      <div>
                        <h4>Adult Charge Protection</h4>
                        <p>Deploying specialized maneuvers and legal motions to fight to keep juveniles aggressively within the juvenile structure.</p>
                      </div>
                      <div>
                        <h4>Custody &amp; DCFS</h4>
                        <p>Uncompromising support precisely when DCFS unethically threatens your foundational parental rights.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            
            <aside className="ic-side" data-r="d3">
              <div className="ic-badge-card highlight">
                <h3>Request an Evaluation</h3>
                <p>Ready to structure your legal strategy? Get in touch and define your explicit path forward today.</p>
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
