"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Contact from "@/components/Contact";
import MobileBar from "@/components/MobileBar";
import "../about/about.css";
import "@/components/FAQ.css";

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const categories = [
    { id: "all", label: "All Questions" },
    { id: "general", label: "General" },
    { id: "criminal", label: "Criminal Defense" },
    { id: "estate", label: "Estate Planning" },
    { id: "juvenile", label: "Juvenile" },
    { id: "injury", label: "Personal Injury" },
  ];

  const questions = [
    { cat: "general", label: "General", q: "Do you charge for an initial consultation?", a: "We offer a free initial consultation to help you understand your options and decide how to move forward — without any financial obligation." },
    { cat: "general", label: "General", q: "What should I bring to my first appointment?", a: "Bring relevant documents like police reports, medical records, or court notices. A list of questions is also helpful. We'll guide you on what's needed." },
    { cat: "general", label: "General", q: "Do you offer virtual meetings?", a: "Yes. Our office is in Pineville, Louisiana, and we serve clients throughout the region. We also offer virtual meetings via secure platforms." },
    { cat: "general", label: "General", q: "Who will handle my case?", a: "At least one experienced attorney, supported by knowledgeable staff. You'll always know who to contact for updates." },
    { cat: "criminal", label: "Criminal Defense", q: "What should I do if I'm arrested?", a: "Stay calm and remain respectful. Request an attorney immediately. Do not answer questions or sign anything without legal representation. Contact our firm as soon as possible." },
    { cat: "criminal", label: "Criminal Defense", q: "Do I need a lawyer if I plan to plead guilty?", a: "Yes. An experienced lawyer can review the facts, advocate on your behalf, and potentially secure a reduction in fines or sentencing." },
    { cat: "criminal", label: "Criminal Defense", q: "Can you help get charges reduced or dismissed?", a: "We carefully evaluate evidence to identify weaknesses in the prosecution's case. We can't guarantee results, but we guarantee our very best effort." },
    { cat: "criminal", label: "Criminal Defense", q: "Can you help clear my criminal record?", a: "Yes — expungement is something we handle regularly. Contact us to discuss your eligibility." },
    { cat: "estate", label: "Estate Planning & Successions", q: "What is estate planning?", a: "Estate planning ensures your wishes are carried out when you're gone or unable to make decisions. It's for anyone who wants to protect their family and control where their assets go." },
    { cat: "estate", label: "Estate Planning & Successions", q: "Do I need an estate plan with few assets?", a: "Yes! A will and power of attorney prevent unnecessary court battles and family stress — regardless of estate size." },
    { cat: "estate", label: "Estate Planning & Successions", q: "What if I die without a will in Louisiana?", a: "Louisiana law — not you — decides who gets your assets. Your spouse doesn't automatically inherit everything, leading to costly delays and disputes." },
    { cat: "juvenile", label: "Juvenile Law", q: "What if my child is accused of a crime?", a: "Remain calm. Don't let your child talk to police without a lawyer. Call us immediately to protect their rights." },
    { cat: "juvenile", label: "Juvenile Law", q: "Can my child be charged as an adult?", a: "Yes — certain serious crimes can result in a child being tried as an adult. We fight to keep them in the juvenile system where rehabilitation is the focus." },
    { cat: "juvenile", label: "Juvenile Law", q: "What if DCFS removed my children?", a: "Call us immediately. DCFS cases move fast on strict timelines. Every decision now affects your ability to get your children back." },
    { cat: "injury", label: "Personal Injury", q: "What should I do after an accident?", a: "Seek medical attention. Photograph the scene. Get witness information. Don't talk to insurance about settling before calling a lawyer." },
    { cat: "injury", label: "Personal Injury", q: "Insurance offered money — should I take it?", a: "No. Insurance companies generally lowball. Once you accept, it's final — even if injuries worsen." },
    { cat: "injury", label: "Personal Injury", q: "How much does a PI lawyer cost?", a: "We work on contingency — you pay nothing upfront. We only get paid if we win." },
    { cat: "injury", label: "Personal Injury", q: "Filing deadline in Louisiana?", a: "One year from the date of the accident. Don't wait — contact us as soon as possible." },
  ];

  const groupedQuestions = questions.reduce((acc, obj) => {
    if (!acc[obj.cat]) acc[obj.cat] = { label: obj.label, items: [] };
    acc[obj.cat].items.push(obj);
    return acc;
  }, {} as Record<string, { label: string, items: typeof questions }>);

  let globalIndex = 0;

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
              src="/george-higgins-meeting.webp"
              alt="Higgins Law FAQs"
              loading="eager"
            />
            <div className="ih-g"></div>
          </div>
          <div className="ih-c">
            <div className="wrap">
              <div className="htag">
                <span className="df">Answers &amp; Resources</span>
                <span className="mf">Help Center</span>
              </div>
              <h1 className="wr go">
                <span className="w" style={{ transitionDelay: "0.1s" }}>Frequently</span><br />
                <span className="w" style={{ transitionDelay: "0.2s" }}>Asked</span>{" "}
                <span className="w" style={{ transitionDelay: "0.3s" }}><em>Questions.</em></span>
              </h1>
            </div>
          </div>
        </section>

        {/* INNER CONTENT GRID */}
        <section className="ic sec s-elev">
          <div className="wrap ic-w">
            <div className="ic-main">
              <div className="sl" data-r>Legal Guidance</div>
              <h2 className="sh" data-r="d1">
                Definitive Answers<br />
                <em>You Can Trust.</em>
              </h2>
              <div className="ic-body" data-r="d2">
                <p>
                  Navigating the Louisiana legal system can be a daunting, deeply confusing process. Over the past five decades, our firm has compiled the most critical inquiries our clients commonly face when encountering the courtroom. Utilize the filter below to rapidly explore specific practice-area facts.
                </p>

                <div className="fql" style={{ marginTop: "4rem" }}>
                  <div className="fqn">
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        className={`fqnb ${activeCategory === c.id ? "act" : ""}`}
                        onClick={() => setActiveCategory(c.id)}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <div className="fqgs">
                    {Object.keys(groupedQuestions).map((catKey) => {
                      if (activeCategory !== "all" && activeCategory !== catKey) return null;
                      const group = groupedQuestions[catKey];
                      return (
                        <div className="fqg" data-cat={catKey} key={catKey}>
                          <div className="fqgl">{group.label}</div>
                          {group.items.map((q) => {
                            const idx = globalIndex++;
                            const isOpen = !!openItems[idx];
                            return (
                              <div className={`fi ${isOpen ? "op" : ""}`} key={idx}>
                                <button className="fq" onClick={() => toggleItem(idx)}>
                                  {q.q}
                                  <span className="fqi"></span>
                                </button>
                                <div
                                  className="fa"
                                  style={{ maxHeight: isOpen ? "500px" : "0" }}
                                >
                                  <div className="fai">{q.a}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
            
            <aside className="ic-side" data-r="d3">
              <div className="ic-badge-card highlight">
                <h3>Still Have Questions?</h3>
                <p>No generic answer can ever fully encompass the gravity of your specific case. Reach out directly.</p>
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
