"use client";
import { useState, FormEvent } from "react";
import "./Contact.css";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className="div-f"></div>
      <section className="sec s-dark" id="contact">
        <div className="wrap">
          <div className="cs">
            <div className="cl" data-r>
              <div className="sl">Get in Touch</div>
              <h2 className="sh">
                Let&apos;s Discuss<br />Your <em>Future.</em>
              </h2>
              <p>
                Every case begins with a conversation. Schedule your free consultation and let us show you how we can help protect what matters most.
              </p>
              <div>
                <div className="cd">
                  <div className="cdi">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                    </svg>
                  </div>
                  <div className="cdt">
                    <div className="cdl">Phone</div>
                    <div className="cdv"><a href="tel:3184734250">318.473.4250</a></div>
                  </div>
                </div>
                <div className="cd">
                  <div className="cdi">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                      <circle cx="12" cy="11" r="3" />
                    </svg>
                  </div>
                  <div className="cdt">
                    <div className="cdl">Location</div>
                    <div className="cdv">
                      <a href="http://maps.google.com/maps?q=Pineville+LA+71360" target="_blank" rel="noopener noreferrer">
                        Pineville, Louisiana 71360
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="cfb" data-r="d1">
              <h3>Schedule a Free Consultation</h3>
              <p className="cfs">No fees. No obligation. Just answers.</p>
              
              {!submitted ? (
                <form id="cf" onSubmit={handleSubmit}>
                  <div className="fr">
                    <div className="fg"><label>First Name *</label><input type="text" required /></div>
                    <div className="fg"><label>Last Name *</label><input type="text" required /></div>
                  </div>
                  <div className="fr">
                    <div className="fg"><label>Email *</label><input type="email" required /></div>
                    <div className="fg"><label>Phone *</label><input type="tel" required /></div>
                  </div>
                  <div className="fg">
                    <label>How Can We Help?</label><textarea rows={4}></textarea>
                  </div>
                  <button type="submit" className="btn bg fsb"><span>Submit Request</span></button>
                </form>
              ) : (
                <div id="fm" style={{ display: 'block' }}>Thank you. We&apos;ll be in touch soon.</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
