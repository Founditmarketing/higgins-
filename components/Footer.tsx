import Link from "next/link";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-top">
          <div>
            <img src="/higginslawnewlogo.png" alt="Higgins Law" className="foot-logo" loading="lazy" />
            <p className="foot-tagline">We Build Relationships<br />That Deliver Results.</p>
            <div className="foot-social">
              <a href="https://www.facebook.com/p/Higgins-Law-Office-LLC-100069113966915/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
            </div>
          </div>
          <div className="foot-col">
            <h4>Navigation</h4>
            <Link href="/about">About Us</Link>
            <Link href="/team">Our Team</Link>
            <Link href="/process">How It Works</Link>
            <Link href="/practice">Practice Areas</Link>
            <Link href="/#testimonials">Testimonials</Link>
            <Link href="/faq">FAQ</Link>
          </div>
          <div className="foot-col">
            <h4>Practice Areas</h4>
            <Link href="/practice">Criminal Defense</Link>
            <Link href="/practice">Estate Planning</Link>
            <Link href="/practice">Personal Injury</Link>
            <Link href="/practice">Juvenile Law</Link>
          </div>
          <div className="foot-col">
            <h4>Contact</h4>
            <div className="foot-contact-item">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"/></svg>
              <span><a href="tel:3184734250">318.473.4250</a></span>
            </div>
            <div className="foot-contact-item">
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
              <span>Pineville, Louisiana<br />71360</span>
            </div>
            <Link href="/consultation" style={{ display: 'inline-block', marginTop: '.75rem', fontSize: '.78rem', color: 'var(--gold)' }}>
              Schedule a Consultation &rarr;
            </Link>
          </div>
        </div>
        <div className="foot-bottom">
          <div className="foot-copy">&copy; 2026 Higgins Law &mdash; All Rights Reserved.</div>
          <div className="foot-legal">
            <Link href="#">Disclaimer</Link>
            <Link href="#">Privacy Policy</Link>
            <Link href="/admin">Admin Access</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
