import "./Process.css";

export default function Process() {
  return (
    <>
      <div className="div-f"></div>
      <section className="sec s-elev" id="how">
        <div className="wrap">
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
            <div className="sl" style={{ justifyContent: "center" }} data-r>
              How It Works
            </div>
            <h2 className="sh" style={{ textAlign: "center" }} data-r="d1">
              Three Steps to<br />
              <em>Protecting Your Future.</em>
            </h2>
            <p className="sd" style={{ textAlign: "center", margin: "0 auto" }} data-r="d2">
              Getting started is straightforward. We handle the complexity so you can focus on what matters.
            </p>
          </div>
          <div className="how-grid">
            <div className="how-card" data-r>
              <div className="how-num">01</div>
              <svg className="how-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
              </svg>
              <h3>Free Consultation</h3>
              <p>
                Call us or fill out the form. We&apos;ll listen to your situation, answer your questions, and explain your options &mdash; all at no cost and no obligation.
              </p>
            </div>
            <div className="how-card" data-r="d1">
              <div className="how-num">02</div>
              <svg className="how-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3>Strategy &amp; Preparation</h3>
              <p>
                We build a tailored legal strategy, gather evidence, consult with experts when needed, and prepare every detail of your case with precision.
              </p>
            </div>
            <div className="how-card" data-r="d2">
              <div className="how-num">03</div>
              <svg className="how-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Resolution &amp; Results</h3>
              <p>
                Whether through negotiation or trial, we fight relentlessly for the best possible outcome &mdash; protecting your rights, your family, and your future.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
