"use client";
import { useState } from "react";
import "./Process.css";

export default function Process() {
  // Mobile accordion state. Defaults to first item open.
  const [activeStep, setActiveStep] = useState<number>(0);

  const toggleStep = (index: number) => {
    setActiveStep(activeStep === index ? -1 : index);
  };

  const steps = [
    {
      num: "01",
      title: "Free Consultation",
      desc: "Call us or fill out the form. We'll listen to your situation, answer your questions, and explain your options — all at no cost and no obligation.",
      icon: (
        <svg className="how-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.07 3.21a1 1 0 01-.22 1L8.09 9.91a16 16 0 006 6l2.02-2.02a1 1 0 011-.22l3.21 1.07a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z" />
        </svg>
      )
    },
    {
      num: "02",
      title: "Strategy & Preparation",
      desc: "We build a tailored legal strategy, gather evidence, consult with experts when needed, and prepare every detail of your case with precision.",
      icon: (
        <svg className="how-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      num: "03",
      title: "Resolution & Results",
      desc: "Whether through negotiation or trial, we fight relentlessly for the best possible outcome — protecting your rights, your family, and your future.",
      icon: (
        <svg className="how-icon" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

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
          <div className="how-grid" data-r="d1">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div 
                  key={idx} 
                  className={`how-card ${isActive ? 'active' : ''}`}
                  onClick={() => toggleStep(idx)}
                >
                  <div className="how-card-header">
                    <div className="how-num">{step.num}</div>
                    {step.icon}
                    <h3>{step.title}</h3>
                    <div className="how-toggle-icon">
                      <span></span><span></span>
                    </div>
                  </div>
                  <div className="how-card-body" style={{ maxHeight: isActive ? '300px' : '0' }}>
                    <p>{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
