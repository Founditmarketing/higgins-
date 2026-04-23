"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBar from "@/components/MobileBar";
import "./consultation.css";

export default function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="cons-hub">
        <div className="wrap cons-grid">
          
          {/* LEFT COLUMN: HUB INFORMATION & LINKS */}
          <div className="cons-l">
            <h1 className="cons-title">
              Let&apos;s Discuss<br />Your <em>Future.</em>
            </h1>
            <p className="cons-desc">
              Every case fundamentally begins with a precise, honest conversation. Reach out directly to secure an initial evaluation securely mapping your legal path forward. Absolute confidentiality is guaranteed natively.
            </p>

            <div className="cons-info">
              <div className="cons-dt">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
                </svg>
                <div>
                  <div className="cons-label">Direct Line</div>
                  <div className="cons-val"><a href="tel:3184734250">318.473.4250</a></div>
                </div>
              </div>
              <div className="cons-dt">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                <div>
                  <div className="cons-label">Louisiana Office</div>
                  <div className="cons-val">
                    <a href="http://maps.google.com/maps?q=Pineville+LA+71360" target="_blank" rel="noopener noreferrer">
                      Pineville, Louisiana 71360
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="cons-links">
              <h4>Explore Our Firm</h4>
              <nav>
                <Link href="/about">Firm History &amp; Legacy</Link>
                <Link href="/team">Meet The Attorneys</Link>
                <Link href="/process">Our 3-Step Process</Link>
                <Link href="/practice">Core Practice Areas</Link>
                <Link href="/faq">Help Center &amp; FAQs</Link>
              </nav>
            </div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <div className="cons-r">
            <div className="cfb">
              <h3 style={{ fontFamily: "var(--fd)", fontSize: "1.75rem", color: "var(--cream)", marginBottom: "0.5rem" }}>
                Schedule an Evaluation
              </h3>
              <p style={{ color: "var(--txtd)", marginBottom: "2rem", lineHeight: "1.6" }}>
                Submit the form absolutely free of obligations. Our team will review your situation contextually and actively respond.
              </p>
              
              {!submitted ? (
                <form id="cf" onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-row">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--txtm)", textTransform: "uppercase", letterSpacing: "0.1em" }}>First Name *</label>
                      <input type="text" required style={{ background: "transparent", border: "1px solid var(--bdr)", padding: "1rem", color: "var(--cream)", outline: "none", borderRadius: "4px" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--txtm)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Last Name *</label>
                      <input type="text" required style={{ background: "transparent", border: "1px solid var(--bdr)", padding: "1rem", color: "var(--cream)", outline: "none", borderRadius: "4px" }} />
                    </div>
                  </div>
                  
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-row">
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--txtm)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Email *</label>
                      <input type="email" required style={{ background: "transparent", border: "1px solid var(--bdr)", padding: "1rem", color: "var(--cream)", outline: "none", borderRadius: "4px" }} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={{ fontSize: "0.85rem", color: "var(--txtm)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Phone *</label>
                      <input type="tel" required style={{ background: "transparent", border: "1px solid var(--bdr)", padding: "1rem", color: "var(--cream)", outline: "none", borderRadius: "4px" }} />
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.85rem", color: "var(--txtm)", textTransform: "uppercase", letterSpacing: "0.1em" }}>How Can We Help?</label>
                    <textarea rows={5} style={{ background: "transparent", border: "1px solid var(--bdr)", padding: "1rem", color: "var(--cream)", outline: "none", borderRadius: "4px", resize: "vertical" }}></textarea>
                  </div>
                  
                  <button type="submit" className="btn bg" style={{ justifyContent: "center", marginTop: "1rem", width: "100%" }}>
                    <span>Submit Request</span>
                  </button>
                </form>
              ) : (
                <div style={{ background: "rgba(200, 164, 78, 0.1)", border: "1px solid var(--goldd)", padding: "2rem", color: "var(--gold)", textAlign: "center", borderRadius: "4px", fontSize: "1.1rem" }}>
                  Thank you. Your request securely filed. We will be directly in touch very soon.
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
