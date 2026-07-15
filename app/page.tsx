// @ts-nocheck -- direct port of the verified LAMPLIGHT CINEMA static build.
// The runtime script is kept verbatim so tested behavior stays identical.
"use client";

import { useEffect } from "react";
import "./engraved.css";

export default function Home() {
  useEffect(() => {
    if (document.documentElement.dataset.engInit) return;
    document.documentElement.dataset.engInit = '1';
document.documentElement.classList.add('js');
const REDUCE=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* NAV state + tucked mobile bar */
const nav=document.getElementById('nav');
const mob=document.querySelector('.mob');
let ioAlive=false;
const navIO=new IntersectionObserver(es=>{ioAlive=true;es.forEach(e=>{
  nav.classList.toggle('sc',!e.isIntersecting);
  mob.classList.toggle('on',!e.isIntersecting);
})},{rootMargin:'-64px 0px 0px 0px'});
navIO.observe(document.querySelector('.hero'));

/* SAFETY VALVE · IO fires immediately on observe in any live browser.
   If it has not fired within 1.6s the renderer is frozen or throttled:
   reveal everything, show the call bar, settle the ledger at 54+. */
setTimeout(()=>{
  if(ioAlive)return;
  document.documentElement.classList.add('no-io');
  const led=document.getElementById('led-big');if(led)led.textContent='54+';
},1600);

/* MOBILE MENU · focus trapped, Escape closes */
const nt=document.getElementById('nt'),nl=document.getElementById('nl');
function menuSet(open){
  nt.setAttribute('aria-expanded',open);
  nl.classList.toggle('open',open);
  document.body.style.overflow=open?'hidden':'';
  if(open)nl.querySelector('a').focus();
}
nt.addEventListener('click',()=>menuSet(nt.getAttribute('aria-expanded')!=='true'));
addEventListener('keydown',e=>{
  if(!nl.classList.contains('open'))return;
  if(e.key==='Escape'){menuSet(false);nt.focus();return}
  if(e.key==='Tab'){
    const f=[...nl.querySelectorAll('a'),nt];
    const first=f[0],lastEl=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();lastEl.focus()}
    else if(!e.shiftKey&&document.activeElement===lastEl){e.preventDefault();first.focus()}
  }
});
nl.addEventListener('click',e=>{if(e.target.closest('a'))menuSet(false)});

/* REVEALS */
const ro=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');ro.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('[data-r]').forEach(el=>ro.observe(el));

/* THE LAMP · live office line (America/Chicago, Mon to Fri 8:00 to 4:30) */
(function(){
  const TZ='America/Chicago',OPEN=8*60,CLOSE=16*60+30,WK=['Mon','Tue','Wed','Thu','Fri'];
  const fmt=new Intl.DateTimeFormat('en-US',{timeZone:TZ,weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  const COPY={
    hero:{
      open:'The office is open today until 4:30. <a href="tel:+13184734250">Call 318.473.4250</a>.',
      before:'The office opens at 8:00 this morning. <a href="#call">Write to us now</a> and it will be waiting when we open.',
      evening:'The office is closed for the evening. We open at 8:00 tomorrow. <a href="#call">Write to us tonight</a>. It will be waiting at 8:00.',
      weekend:'The office opens Monday at 8:00. You do not have to wait until then to write. <a href="#call">Tell us what happened</a> and it will be waiting when we open.'
    },
    contact:{
      open:'Open now · until 4:30 today',
      before:'Opens at 8:00 this morning',
      evening:'Closed for the evening · opens 8:00 tomorrow',
      weekend:'Closed for the weekend · opens Monday at 8:00'
    },
    f24:{
      open:'The office is open right now. <a href="tel:+13184734250">Call 318.473.4250</a> before 4:30.',
      before:'It is early. The office opens at 8:00. Write everything down while it is fresh, <a href="#call">send the form</a>, and call at 8:00.',
      evening:'It is after hours. Write everything down while it is fresh, <a href="#call">send the form</a>, and call at 8:00 tomorrow.',
      weekend:'It is after hours. Write everything down while it is fresh, <a href="#call">send the form</a>, and call Monday at 8:00.'
    }
  };
  function officeState(){
    const p=Object.fromEntries(fmt.formatToParts(new Date()).map(x=>[x.type,x.value]));
    const mins=(+p.hour)*60+(+p.minute),wk=WK.includes(p.weekday);
    if(wk&&mins>=OPEN&&mins<CLOSE)return'open';
    if(wk&&mins<OPEN)return'before';
    if(p.weekday==='Fri'||p.weekday==='Sat'||p.weekday==='Sun')return'weekend';
    return'evening';
  }
  let last=null;
  function render(){
    const s=officeState();if(s===last)return;last=s;
    document.querySelectorAll('[data-office]').forEach(el=>{
      el.dataset.state=(s==='open')?'open':'closed';
      const map=COPY[el.dataset.office];
      if(map&&map[s])el.querySelector('.office-copy').innerHTML=map[s];
    });
  }
  render();setInterval(render,60000);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
})();

/* LEDGER SUM · 40 becomes 54, the son added in front of you */
(function(){
  const el=document.getElementById('led-big');if(!el||REDUCE)return;
  el.textContent='40+';
  const io=new IntersectionObserver(es=>{es.forEach(e=>{
    if(!e.isIntersecting)return;io.unobserve(el);
    let s=null;const D=1200;
    const step=ts=>{if(!s)s=ts;const p=Math.min((ts-s)/D,1),v=40+14*(1-Math.pow(1-p,4));
      el.textContent=Math.round(v)+'+';if(p<1)requestAnimationFrame(step)};
    setTimeout(()=>requestAnimationFrame(step),450);
  })},{threshold:.6});
  io.observe(el);
})();

/* PRACTICE INDEX + FAQ · shared expander pattern */
function wireExpander(btnSel){
  document.querySelectorAll(btnSel).forEach(btn=>{
    btn.addEventListener('click',()=>{
      const panel=document.getElementById(btn.getAttribute('aria-controls'));
      const open=btn.getAttribute('aria-expanded')==='true';
      btn.setAttribute('aria-expanded',String(!open));
      panel.classList.toggle('open',!open);
    });
  });
}
wireExpander('.pr-btn');
wireExpander('.fq');

/* PRACTICE INDEX · on touch screens the row in view lights its photo */
(function(){
  if(matchMedia('(hover: hover)').matches)return;
  const rows=[...document.querySelectorAll('.pr')];
  const io=new IntersectionObserver(es=>{es.forEach(e=>{
    e.target.classList.toggle('lit',e.isIntersecting);
  })},{rootMargin:'-38% 0px -38% 0px'});
  rows.forEach(r=>io.observe(r));
})();

/* PRESCRIPTION LEDGER · elapsed time only, never a deadline.
   The date entered is sensitive: never store or transmit it. */
(function(){
  const input=document.getElementById('rx-date'),out=document.getElementById('rx-result');if(!input)return;
  const today=new Date();
  input.max=today.getFullYear()+'-'+String(today.getMonth()+1).padStart(2,'0')+'-'+String(today.getDate()).padStart(2,'0');
  input.addEventListener('change',()=>{
    if(!input.value){out.textContent='';return}
    const[y,m,d]=input.value.split('-').map(Number);
    const injury=new Date(y,m-1,d),now=new Date();
    if(injury>now){out.textContent='That date has not happened yet. Check the year and try again.';return}
    let months=0,walk=new Date(injury);
    while(true){const next=new Date(injury);next.setMonth(injury.getMonth()+months+1);if(next<=now){months++;walk=next}else break}
    const days=Math.floor((now-walk)/86400000);
    const span=months<1?(days+(days===1?' day':' days')):(months+(months===1?' month':' months')+' and '+days+(days===1?' day':' days'));
    if(months>=12){
      out.innerHTML='More than a year has passed. That does not always mean it is too late. Some deadlines pause, some extend, and some claims carry longer periods. The only way to know is to ask. <a href="tel:+13184734250">Call 318.473.4250</a> today.';
    }else{
      out.innerHTML='It has been '+span+' since that date. The strongest cases are built early, while witnesses remember and records are easy to find. <a href="tel:+13184734250">Call 318.473.4250</a> and let us look at the calendar with you.';
    }
  });
})();

/* THE DRAWER · nothing checked here is saved or sent (by design) */
(function(){
  const list=document.getElementById('drawer-list'),out=document.getElementById('drawer-result');if(!list)return;
  list.addEventListener('change',()=>{
    const n=list.querySelectorAll('input:checked').length;
    out.textContent=
      n===0?'Most families start at zero. One conversation puts the first three in motion.':
      n<=2?n+' of 5 in the drawer. The rest is one appointment, not a season of paperwork.':
      n<=4?n+' of 5. You are closer than most. Let us help you finish.':
      'All five. Well done. If any are more than a few years old, it may be time to read them again together.';
  });
})();

/* FIRST 24 HOURS · print + share */
(function(){
  const pb=document.getElementById('f24-print'),sb=document.getElementById('f24-share');if(!pb)return;
  pb.addEventListener('click',()=>{
    document.body.classList.add('printing-f24');
    window.print();
  });
  addEventListener('afterprint',()=>document.body.classList.remove('printing-f24'));
  const F24_TEXT='If someone you love was arrested: 1) Say "I am not answering questions. I want a lawyer." Then stop talking. 2) Do not sign, consent, or explain. 3) Jail phones are recorded. Never discuss the case. 4) Write everything down tonight. 5) Call Higgins Law, Pineville: 318.473.4250.';
  sb.addEventListener('click',async()=>{
    const url=location.origin+location.pathname+'#first24';
    try{
      if(navigator.share){await navigator.share({title:'The First 24 Hours',text:F24_TEXT,url})}
      else{await navigator.clipboard.writeText(F24_TEXT+' '+url);const t=sb.textContent;sb.textContent='Copied';setTimeout(()=>sb.textContent=t,2000)}
    }catch(e){
      if(e&&e.name==='AbortError')return;
      const t=sb.textContent;sb.textContent='Could not copy. Call 318.473.4250';setTimeout(()=>sb.textContent=t,3000);
    }
  });
})();

/* FORM · DEMO ONLY, UNWIRED. Success state is simulated for the pitch. */
(function(){
  const cf=document.getElementById('cf'),fm=document.getElementById('fm');if(!cf)return;
  cf.addEventListener('submit',e=>{
    e.preventDefault();
    if(!cf.checkValidity()){cf.reportValidity();return}
    cf.style.display='none';fm.style.display='block';
    fm.innerHTML='Thank you. Your message will be waiting when the office opens, Monday to Friday at 8:00 AM. If this cannot wait, call <a href="tel:+13184734250">318.473.4250</a>.';
    fm.focus();
  });
})();
  }, []);

  return (
    <div id="eng">
<a className="skip" href="#main">Skip to content</a>


<nav className="nav" id="nav" aria-label="Main"><div className="ni">
<a href="#top" className="nb"><span className="nb-t">Higgins <span>Law</span></span><span className="nb-s">Trial Attorneys, Pineville LA</span></a>
<ul className="nl" id="nl">
<li><a href="#first24">If You Are Arrested</a></li>
<li><a href="#generations">Two Generations</a></li>
<li><a href="#practice">What We Handle</a></li>
<li><a href="#faq">Questions</a></li>
<li><a className="n-tel" href="tel:+13184734250">318.473.4250</a></li>
<li className="ncw"><a href="#call">Free Consultation</a></li>
</ul>
<button className="nt" id="nt" aria-label="Menu" aria-expanded="false" aria-controls="nl"><span></span><span></span><span></span></button>
</div></nav>

<main id="main">

<header className="hero" id="top">
<div className="hero-media"><img src="/assets/lawroom.jpeg" alt="George and Alex Higgins working together at the wood table of their law library" width="2596" height="1632" fetchPriority="high" /></div>
<div className="hero-grade" aria-hidden="true"></div>
<div className="hero-frame" aria-hidden="true"></div>
<div className="hero-inner">
<p className="eyebrow">Pineville, Louisiana <span className="dia" aria-hidden="true"></span> A father and son trial firm</p>
<h1 className="title">
<span className="tl"><span className="tw">Experience<span className="dot">.</span></span></span>
<span className="tl"><span className="tw">Compassion<span className="dot">.</span></span></span>
<span className="tl"><span className="tw tw--brass">Results.</span></span>
</h1>
<p className="hero-sub">Over 54 years of combined experience. The first conversation is free.</p>
<div className="hero-acts">
<a className="btn btn-brass" href="tel:+13184734250">Call 318.473.4250</a>
<a className="btn btn-quiet" href="#call">Request a Free Consultation</a>
</div>
<p className="office-line" data-office="hero" data-state="closed" role="status"><span className="lamp" aria-hidden="true"></span><span className="office-copy">Monday to Friday, 8:00 to 4:30 · <a href="tel:+13184734250">318.473.4250</a></span></p>
<a className="hero-emergency" href="#first24">If someone was arrested tonight, start here.</a>
</div>
</header>


<div className="facts" role="note" aria-label="Firm facts">
<div className="facts-in">
<div className="fact"><b>Over 54 years</b><span>Combined experience</span></div>
<div className="fact"><b>Free</b><span>Initial consultation</span></div>
<div className="fact"><b>Contingency</b><span>On injury cases</span></div>
<div className="fact"><b>Two generations</b><span>Father and son</span></div>
</div>
</div>


<section className="f24" id="first24" aria-labelledby="f24-title">
<div className="f24-head" data-r>
<p className="eyebrow">If someone was arrested tonight</p>
<h2 className="sec-h" id="f24-title">The First 24 Hours</h2>
<p className="sec-sub">What to do right now, in plain words. Written for Central Louisiana families by the lawyers who take these calls.</p>
</div>
<div className="wrap"><div className="f24-card" data-r="d1">
<div className="f24-grid">
<ol className="f24-steps">
<li className="f24-step"><span className="f24-num" aria-hidden="true">1</span><div>
<h3>Say one sentence, out loud</h3>
<p>The right to remain silent only protects you once you claim it. Say: <strong>&ldquo;I am not answering questions. I want a lawyer.&rdquo;</strong> Then stop talking. Stay polite. Repeat it as many times as you need to.</p>
</div></li>
<li className="f24-step"><span className="f24-num" aria-hidden="true">2</span><div>
<h3>Do not sign, consent, or explain</h3>
<p>No written statements. No waivers. No consent to search a car, a phone, or a home. Saying no is not an admission of anything. It is the law working the way it is supposed to.</p>
</div></li>
<li className="f24-step"><span className="f24-num" aria-hidden="true">3</span><div>
<h3>Treat every jail phone as a recorded line</h3>
<p>Because it is. Talk about family, money for the account, and staying steady. Never discuss the case, the charges, or that night on a jail phone.</p>
</div></li>
<li className="f24-step"><span className="f24-num" aria-hidden="true">4</span><div>
<h3>Write everything down tonight</h3>
<p>The time and place of the arrest. The names you heard. Who was there. What was taken. Memory fades in a day. Paper does not.</p>
</div></li>
<li className="f24-step"><span className="f24-num" aria-hidden="true">5</span><div>
<h3>Call before anyone decides anything</h3>
<p>Before anyone answers questions. Before anyone takes a deal. One conversation first: <a href="tel:+13184734250">318.473.4250</a>.</p>
<p className="office-line f24-office" data-office="f24" data-state="closed" role="status"><span className="lamp" aria-hidden="true"></span><span className="office-copy">Office hours: Monday to Friday, 8:00 to 4:30.</span></p>
</div></li>
</ol>
<aside className="f24-say" aria-labelledby="f24-say-title">
<h3 id="f24-say-title">What to say. What not to say.</h3>
<div className="f24-col f24-col--say">
<h4>Say</h4>
<ul>
<li>&ldquo;I am not answering questions.&rdquo;</li>
<li>&ldquo;I want a lawyer.&rdquo;</li>
<li>&ldquo;I do not consent to a search.&rdquo;</li>
<li>At the jail, ask: &ldquo;What is the charge, and where is he being held?&rdquo;</li>
</ul>
</div>
<div className="f24-col f24-col--never">
<h4>Never say</h4>
<ul>
<li>&ldquo;Let me explain what happened.&rdquo;</li>
<li>&ldquo;I only had a couple.&rdquo;</li>
<li>Apologies, guesses, or theories.</li>
<li>Anything about the case on a jail phone.</li>
</ul>
</div>
<p className="f24-say-foot">Silence protects you only after you claim it. Claim it, then keep it.</p>
</aside>
</div>
<div className="f24-actions">
<a className="btn btn-brass" href="tel:+13184734250">Call 318.473.4250</a>
<button className="btn btn-quiet" id="f24-print" type="button">Print this guide</button>
<button className="btn btn-quiet" id="f24-share" type="button">Send it to someone</button>
</div>
<p className="f24-legal">General information, not legal advice. Reading this page does not make us your lawyers. Every case is different. When in doubt, call.</p>
</div></div>
</section>


<section className="gen" id="generations" aria-labelledby="gen-title">
<span className="ghost" aria-hidden="true">54</span>
<div className="gen-head" data-r>
<p className="eyebrow">Two generations <span className="dia" aria-hidden="true"></span> One name on the door</p>
<h2 className="sec-h" id="gen-title">One firm, handed<br />father to son.</h2>
<p className="gen-lede">Higgins Law is a father and a son. George Lewis Higgins III has tried cases for over forty years. His son Alex practices beside him and manages the firm. The office is on Melrose Street in Pineville. When you call, you reach the people who will actually handle your case. You will never be just a file here.</p>
</div>
<div className="wall">
<span className="spine" aria-hidden="true"></span>
<article className="gene gene--g" data-r>
<figure className="plate"><span className="off" aria-hidden="true"></span><img src="/assets/george-hd.jpeg" alt="Studio portrait of George Lewis Higgins III in a navy suit and gold tie" width="1916" height="2240" loading="lazy" decoding="async" /></figure>
<p className="gene-era">The first generation</p>
<h3 className="gene-name">George Lewis Higgins III</h3>
<p className="gene-role">Founding Attorney</p>
<p className="gene-body">George Lewis Higgins III has practiced law for over forty years. He built the firm on preparation and a steady presence in the courtroom, and he built its reputation the slow way: one client, one case at a time.</p>
</article>
<article className="gene gene--a" data-r="d1">
<figure className="plate"><span className="off" aria-hidden="true"></span><img src="/assets/alex-hd.jpeg" alt="Studio portrait of G. Alexander Higgins in a navy suit, orange tie, and glasses" width="1916" height="2240" loading="lazy" decoding="async" /></figure>
<p className="gene-era">The second generation</p>
<h3 className="gene-name">G. Alexander Higgins</h3>
<p className="gene-role">Attorney &amp; Managing Partner</p>
<p className="gene-body">G. Alexander Higgins is the second generation of the firm and its managing partner. He grew up around this work, and he holds his cases to the standard his father set. Clients stay informed at every step, because that is how he was taught to practice.</p>
</article>
<div className="ledger" data-r role="group" aria-label="Over 54 years of combined experience">
<div className="led-row"><span>George Lewis Higgins III</span><span className="led-dots"></span><span className="led-fig">40+ yrs</span></div>
<div className="led-row"><span>G. Alexander Higgins</span><span className="led-dots"></span><span className="led-fig led-fig--cf">carried forward</span></div>
<div className="led-rule" aria-hidden="true"></div>
<div className="led-total"><span className="led-big" id="led-big">54+</span><span className="led-cap">Years of experience, combined</span></div>
</div>
</div>
</section>




<figure className="creed" data-r>
<div className="creed-media"><img src="/assets/george-and-alex-meeting.webp" alt="" width="1359" height="906" loading="lazy" decoding="async" /></div>
<div className="creed-grade" aria-hidden="true"></div>
<div className="creed-in">
<blockquote className="creed-q">We build successful <em>Relationships</em>; treat people with <em>Respect</em>; and achieve exceptional <em>Results</em>.</blockquote>
<figcaption className="creed-cap">The creed of the firm</figcaption>
</div>
</figure>


<section className="prac" id="practice" aria-labelledby="pr-title">
<div className="prac-head" data-r>
<p className="eyebrow">Areas of practice</p>
<h2 className="sec-h" id="pr-title">What we handle.</h2>
<p className="sec-sub">Criminal defense, estate planning, personal injury, and juvenile law. One firm for the whole of it, handled by the two attorneys whose name is on the door. Open a row to see the work.</p>
</div>
<div className="dex" data-r="d1">

<div className="pr">
<button className="pr-btn" aria-expanded="false" aria-controls="pa-1" id="pa-1-btn">
<span className="pr-bg" aria-hidden="true"><img src="/assets/alexhigginswithclient.webp" alt="" loading="lazy" decoding="async" /></span>
<span className="pr-in">
<span className="pr-num" aria-hidden="true">I</span>
<span className="pr-t"><span className="pr-name" role="heading" aria-level="3">Criminal Defense</span><span className="pr-line">A charge is not a conviction. We stand with the person behind the accusation.</span></span>
<span className="pr-x" aria-hidden="true"></span>
</span>
</button>
<div className="pr-panel" id="pa-1" role="region" aria-labelledby="pa-1-btn"><div className="pr-panel-in">
<div className="pr-body">
<div className="pst"><h4>You Will Know Where You Stand</h4><p>You will understand the process, know your options, and never be left in the dark.</p></div>
<div className="pst"><h4>The State Has the Burden</h4><p>We examine the evidence, hold the State to its burden, and tell your side of the story.</p></div>
<div className="pst"><h4>Ready for the Courtroom</h4><p>Decades of courtroom advocacy, prepared for the moment a case needs to be tried.</p></div>
<div className="pst"><h4>Expungements</h4><p>Clearing a record is something we handle regularly. Ask about your eligibility.</p></div>
<p className="pr-call">Someone was arrested? Read <a href="#first24">The First 24 Hours</a>, then call <a href="tel:+13184734250">318.473.4250</a>.</p>
</div>
</div></div>
</div>

<div className="pr">
<button className="pr-btn" aria-expanded="false" aria-controls="pa-4" id="pa-4-btn">
<span className="pr-bg" aria-hidden="true"><img src="/assets/higginslawheropic.webp" alt="" loading="lazy" decoding="async" /></span>
<span className="pr-in">
<span className="pr-num" aria-hidden="true">II</span>
<span className="pr-t"><span className="pr-name" role="heading" aria-level="3">Estate Planning &amp; Successions</span><span className="pr-line">A will, a power of attorney, a plan. Plain documents at a plain price, so your family is never left guessing.</span></span>
<span className="pr-x" aria-hidden="true"></span>
</span>
</button>
<div className="pr-panel" id="pa-4" role="region" aria-labelledby="pa-4-btn"><div className="pr-panel-in">
<div className="pr-body">
<div className="pst"><h4>Wills &amp; Trusts</h4><p>From simple wills to comprehensive trusts: safeguard assets, reduce conflict, and protect your family.</p></div>
<div className="pst"><h4>Powers of Attorney &amp; Health Directives</h4><p>Clear documents, so your medical, financial, and legal decisions rest with the people you trust most.</p></div>
<div className="pst"><h4>Successions &amp; Probate</h4><p>When a loved one passes, we guide families through the process with clarity and compassion.</p></div>
<div className="tool" id="drawer">
<p className="tool-eb"><span className="mark">&sect;</span> A five minute check</p>
<h4 className="tool-h">Five papers your family hopes you have.</h4>
<p>If something happened to you tonight, could your family open one drawer and find what they need? Check what you already have. Nothing you check here is saved or sent.</p>
<fieldset style={{border:'none'}}>
<legend style={{position:'absolute',left:'-9999px'}}>Estate readiness checklist</legend>
<ul className="drawer-list" id="drawer-list">
<li><label><input type="checkbox" /><span className="dbox" aria-hidden="true"></span>A will that reflects your life today.</label></li>
<li><label><input type="checkbox" /><span className="dbox" aria-hidden="true"></span>A power of attorney for your finances.</label></li>
<li><label><input type="checkbox" /><span className="dbox" aria-hidden="true"></span>A healthcare power of attorney or living will.</label></li>
<li><label><input type="checkbox" /><span className="dbox" aria-hidden="true"></span>Beneficiaries named and current on policies and accounts.</label></li>
<li><label><input type="checkbox" /><span className="dbox" aria-hidden="true"></span>One person who knows where all of it is.</label></li>
</ul>
</fieldset>
<p className="drawer-result" id="drawer-result" aria-live="polite">Most families start at zero. One conversation puts the first three in motion.</p>
<div className="tool-acts"><a href="tel:+13184734250">Start your estate plan: 318.473.4250</a><a href="#call">Ask about a free consultation</a></div>
</div>
<p className="pr-call">One appointment, not a season of paperwork. Start with <a href="tel:+13184734250">318.473.4250</a>.</p>
</div>
</div></div>
</div>

<div className="pr">
<button className="pr-btn" aria-expanded="false" aria-controls="pa-3" id="pa-3-btn">
<span className="pr-bg" aria-hidden="true"><img src="/assets/hero.webp" alt="" loading="lazy" decoding="async" /></span>
<span className="pr-in">
<span className="pr-num" aria-hidden="true">III</span>
<span className="pr-t"><span className="pr-name" role="heading" aria-level="3">Personal Injury</span><span className="pr-line">Hurt because someone else was careless? Louisiana gives you less time than you think.</span></span>
<span className="pr-x" aria-hidden="true"></span>
</span>
</button>
<div className="pr-panel" id="pa-3" role="region" aria-labelledby="pa-3-btn"><div className="pr-panel-in">
<div className="pr-body">
<div className="pst"><h4>Your Story, Heard First</h4><p>Our advocacy reflects the full reality of what the injury took from your days.</p></div>
<div className="pst"><h4>Built Like a Trial Case</h4><p>Medical records, expert testimony, deliberate preparation. Ready for a courtroom from day one.</p></div>
<div className="pst"><h4>Negotiating from Strength</h4><p>A trial reputation is leverage at the settlement table.</p></div>
<div className="pst"><h4>The Full Cost, Counted</h4><p>Medical bills, lost wages, and what the injury took from your life. We account for all of it. Injury cases are handled on contingency.</p></div>
<div className="tool" id="prescription">
<p className="tool-eb"><span className="mark">&sect;</span> How long do you have</p>
<h4 className="tool-h">The clock started the day you were hurt.</h4>
<p>Louisiana's filing deadlines are shorter than most people expect. For some claims it is as little as one year from the date of the injury. The exact deadline depends on the facts of your case. Do not guess.</p>

<div className="rx-row">
<div className="rx-field"><label htmlFor="rx-date">The date of the injury</label><input type="date" id="rx-date" /></div>
</div>
<p className="rx-result" id="rx-result" aria-live="polite"></p>
<p className="tool-legal">Deadlines, called prescription in Louisiana, vary by claim and by facts. This shows elapsed time only. It does not calculate your deadline and it is not legal advice.</p>
</div>
<p className="pr-call">Insurance already calling? Talk to us before you sign anything: <a href="tel:+13184734250">318.473.4250</a>.</p>
</div>
</div></div>
</div>

<div className="pr">
<button className="pr-btn" aria-expanded="false" aria-controls="pa-2" id="pa-2-btn">
<span className="pr-bg" aria-hidden="true"><img src="/assets/george-higgins-meeting.webp" alt="" loading="lazy" decoding="async" /></span>
<span className="pr-in">
<span className="pr-num" aria-hidden="true">IV</span>
<span className="pr-t"><span className="pr-name" role="heading" aria-level="3">Juvenile Law</span><span className="pr-line">The family is the fundamental unit of society. When yours is under strain, we stand with all of it.</span></span>
<span className="pr-x" aria-hidden="true"></span>
</span>
</button>
<div className="pr-panel" id="pa-2" role="region" aria-labelledby="pa-2-btn"><div className="pr-panel-in">
<div className="pr-body">
<div className="pst"><h4>The Family Comes First</h4><p>Families are the fabric a community is woven from. Our job, in every juvenile matter, is to help hold yours together.</p></div>
<div className="pst"><h4>Delinquency Defense</h4><p>Protecting minors with the emphasis on rehabilitation, not punishment. A mistake at fifteen should not define a life.</p></div>
<div className="pst"><h4>Custody &amp; DCFS</h4><p>Standing with parents when DCFS threatens parental rights. These cases move on strict timelines.</p></div>
<div className="pst"><h4>Keeping Kids in Juvenile Court</h4><p>Fighting to keep juveniles in the juvenile system, where the focus is their future.</p></div>
<div className="pst"><h4>What Comes After</h4><p>Court is not the end of it. We help families find their footing, and we stay reachable when questions come.</p></div>
<p className="pr-call">Your child in trouble, or DCFS at the door? Do not wait for the next hearing. Call <a href="tel:+13184734250">318.473.4250</a>.</p>
</div>
</div></div>
</div>

</div>
<p className="prac-foot">Free initial consultation. Injury cases handled on contingency.</p>
</section>


<section className="testi" id="testimonials" aria-labelledby="ts-title">
<div className="testi-in">
<div data-r>
<p className="eyebrow">In their words</p>
<h2 className="sec-h" id="ts-title">What clients say when it is over.</h2>
</div>
<figure className="pull" data-r="d1">
<blockquote>
<p className="pull-big"><span className="pq">&ldquo;</span>I called and he answered.<span className="pq">&rdquo;</span></p>
<p className="pull-rest">Mr. Alex Higgins did the job right. I called and he answered. I didn&rsquo;t have to look for him or run him down looking for answers related to my son&rsquo;s case because he kept us informed. I will definitely recommend him to anyone looking to get your case done with haste. Mr. Higgins is a great lawyer and a great person.</p>
</blockquote>
<figcaption className="pull-attr">Donald F.</figcaption>
</figure>
<div className="q-grid" data-r="d2">
<figure className="q-cell">
<blockquote>I have had the pleasure of working with one of the finest lawyers in the field in Alex Higgins. He exhibits remarkable commitment to his work. Despite the emotional toll and complexities of my case, their strategic thinking and bold advocacy led to a successful outcome. The service and results were truly exceptional.</blockquote>
<figcaption className="q-attr">Andrew H.</figcaption>
</figure>
<figure className="q-cell">
<blockquote>Mr. Alex Higgins is a young and extremely talented general practice attorney with the insight and experience found only in veteran attorneys. Once you become his client, he and his staff treat you like family with dignity and respect during the proceedings and after to ensure your satisfaction. I would highly recommend him.</blockquote>
<figcaption className="q-attr">Christopher C.</figcaption>
</figure>
<figure className="q-cell">
<blockquote>I could not have had a better attorney than Alex Higgins. He followed in his father&rsquo;s footsteps and became a trusted attorney in Alexandria, Louisiana. He did an amazing job in my case.</blockquote>
<figcaption className="q-attr">Aaron D.</figcaption>
</figure>
</div>
<p className="q-sober" data-r>Every case is different. Prior results do not guarantee a similar outcome.</p>
</div>
</section>


<section className="faq" id="faq" aria-labelledby="faq-title">
<div className="faq-in">
<div className="faq-side" data-r>
<p className="eyebrow">Before you call</p>
<h2 className="sec-h" id="faq-title">Questions we hear at the first meeting.</h2>
<p className="sec-sub">Plain answers, the same ones we give across the table.</p>
<p className="faq-side-call">Something we did not cover? <a href="tel:+13184734250">Call 318.473.4250</a>. The first conversation is free.</p>
</div>
<div className="fqgs" data-r="d1">

<div className="fqg"><h3 className="fqgl">General</h3>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-g1">Do you charge for an initial consultation?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-g1"><div className="fa-in"><div className="fai">No. The first consultation is free. It helps you understand your options and decide how to move forward, without any financial obligation.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-g2">What should I bring to my first appointment?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-g2"><div className="fa-in"><div className="fai">Bring what you have: police reports, medical records, court notices. A list of questions helps too. We will guide you on the rest.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-g3">Do you offer virtual meetings?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-g3"><div className="fa-in"><div className="fai">Yes. Our office is in Pineville and we serve clients throughout the region. We also meet by video over secure platforms.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-g4">Who will handle my case?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-g4"><div className="fa-in"><div className="fai">An experienced attorney, supported by knowledgeable staff. You will always know who to contact for updates.</div></div></div></div>
</div>

<div className="fqg"><h3 className="fqgl">Criminal Defense</h3>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-c1">What should I do if I&rsquo;m arrested?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-c1"><div className="fa-in"><div className="fai">Stay calm and stay respectful. Ask for a lawyer immediately, then stop answering questions and sign nothing. The full guide is above: <a href="#first24">The First 24 Hours</a>. Then call us as soon as you can.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-c2">Do I need a lawyer if I plan to plead guilty?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-c2"><div className="fa-in"><div className="fai">Yes. An experienced lawyer can review the facts, advocate on your behalf, and often secure a better resolution than you would reach alone.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-c3">Can you get charges reduced or dismissed?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-c3"><div className="fa-in"><div className="fai">No honest lawyer promises an outcome. What we can promise is the work: a close review of the evidence and a defense built on its weaknesses.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-c4">Can you help clear my criminal record?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-c4"><div className="fa-in"><div className="fai">Expungement is something we handle regularly. Contact us to discuss your eligibility.</div></div></div></div>
</div>

<div className="fqg"><h3 className="fqgl">Estate Planning &amp; Successions</h3>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-e1">What is estate planning?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-e1"><div className="fa-in"><div className="fai">Estate planning makes sure your wishes are carried out when you are gone or unable to decide. It is for anyone who wants to protect their family and control where their assets go.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-e2">Do I need an estate plan if I don&rsquo;t have much?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-e2"><div className="fa-in"><div className="fai">Yes. A will and a power of attorney prevent unnecessary court battles and family stress, whatever the size of the estate.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-e3">What happens if I die without a will in Louisiana?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-e3"><div className="fa-in"><div className="fai">Louisiana law, not you, decides who receives your assets. Your spouse does not automatically inherit everything, and that can mean costly delays and disputes for the people you love.</div></div></div></div>
</div>

<div className="fqg"><h3 className="fqgl">Personal Injury</h3>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-p1">What should I do after an accident?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-p1"><div className="fa-in"><div className="fai">Get medical attention first. Photograph the scene. Get witness names. And do not discuss a settlement with any insurance company before you talk to a lawyer.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-p2">The insurance company offered money. Should I take it?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-p2"><div className="fa-in"><div className="fai">Be careful. Early offers rarely cover the full cost of an injury, and once you accept, the matter is closed, even if you get worse. Talk to a lawyer before you sign anything.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-p3">How much does a personal injury lawyer cost?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-p3"><div className="fa-in"><div className="fai">We handle injury cases on contingency: no attorney&rsquo;s fee up front, and a fee is collected only if we recover money for you. We explain how fees, costs, and expenses work in plain terms at the first meeting.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-p4">How long do I have to file an injury claim?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-p4"><div className="fa-in"><div className="fai">Often as little as one year from the date of the accident. Deadlines vary by case, so call early. The date of your accident controls.</div></div></div></div>
</div>

<div className="fqg"><h3 className="fqgl">Juvenile Law</h3>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-j1">What if my child is accused of a crime?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-j1"><div className="fa-in"><div className="fai">Stay calm. Do not let your child talk to police without a lawyer. Call us immediately so their rights are protected from the first conversation.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-j2">Can my child be charged as an adult?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-j2"><div className="fa-in"><div className="fai">For certain serious charges, yes. We fight to keep young people in the juvenile system, where rehabilitation is the focus.</div></div></div></div>
<div className="fi"><button className="fq" aria-expanded="false" aria-controls="fa-j3">What if DCFS removed my children?<span className="fqi" aria-hidden="true"></span></button><div className="fa" id="fa-j3"><div className="fa-in"><div className="fai">Call us immediately. DCFS cases move fast, on strict timelines, and every decision now affects your ability to bring your children home.</div></div></div></div>
</div>

</div>
</div>
</section>


<section className="call" id="call" aria-labelledby="call-title">
<span className="call-ghost" aria-hidden="true">&sect;</span>
<div className="call-in">
<div data-r>
<p className="eyebrow">Get in touch</p>
<h2 className="call-h" id="call-title">Start with<br />a conversation.</h2>
<p className="call-lede">Every case here begins the same way: you tell us what is going on, and we listen. The consultation is free, in person or by video.</p>
<a className="call-tel" href="tel:+13184734250">318.473.4250</a>
<div className="call-facts">
<div className="cf"><span className="cf-k">Office</span><span className="cf-v"><a href="https://www.google.com/maps?q=1603+Melrose+St,+Pineville,+LA+71360" target="_blank" rel="noopener">1603 Melrose St, Pineville, LA 71360</a></span></div>
<div className="cf"><span className="cf-k">Hours</span><span className="cf-v">Monday to Friday, 8:00 AM to 4:30 PM<span className="office-line office-line--compact" data-office="contact" data-state="closed" style={{display:'flex'}}><span className="lamp" aria-hidden="true"></span><span className="office-copy">Mon to Fri · 8:00 to 4:30</span></span></span></div>
</div>
<noscript><p style={{marginTop:'.8rem',fontStyle:'italic',color:'var(--mut)'}}>Office hours: Monday to Friday, 8:00 AM to 4:30 PM.</p></noscript>
<div className="steps">
<h3>What happens when you call</h3>
<p className="steps-sub">Three steps. No mystery.</p>
<div className="step-row"><span className="step-n" aria-hidden="true">01</span><div><h4>You Call</h4><p>Call, or send the form. We listen, answer your questions, and explain your options. The consultation is free, with no obligation.</p></div></div>
<div className="step-row"><span className="step-n" aria-hidden="true">02</span><div><h4>We Prepare</h4><p>We build the strategy, gather the evidence, and bring in experts when the case needs them.</p></div></div>
<div className="step-row"><span className="step-n" aria-hidden="true">03</span><div><h4>You Decide</h4><p>Settle or go to trial: we lay out the choices plainly and prepare for both. The decision is yours, made with full information.</p></div></div>
</div>
</div>
<div className="cfb" data-r="d1">
<h3>Request a Free Consultation</h3>
<p className="cfs">No fee. No obligation. Just answers.</p>

<form id="cf" noValidate={true}>
<div className="fr">
<div className="fg"><label htmlFor="f-name">Name</label><input type="text" id="f-name" name="name" autoComplete="name" required /></div>
<div className="fg"><label htmlFor="f-tel">Phone</label><input type="tel" id="f-tel" name="tel" autoComplete="tel" required /></div>
</div>
<div className="fg"><label htmlFor="f-email">Email <em>(optional)</em></label><input type="email" id="f-email" name="email" autoComplete="email" /></div>
<div className="fg"><label htmlFor="f-msg">What is going on? <em>(optional)</em></label><textarea id="f-msg" name="message" rows="4"></textarea></div>
<p className="form-legal">Sending a message does not create an attorney-client relationship. Please do not include confidential details. If your matter is urgent, call <a href="tel:+13184734250">318.473.4250</a>.</p>
<button type="submit" className="btn btn-brass fsb">Send the Message</button>
</form>
<div id="fm" role="status" aria-live="polite" tabIndex={-1}></div>
</div>
</div>
</section>
</main>


<footer className="foot"><div className="foot-in">
<div className="foot-top">
<div>
<p className="foot-brand">Higgins <span>Law</span></p>
<p className="foot-creed">We build successful Relationships; treat people with Respect; and achieve exceptional Results.</p>
</div>
<div className="foot-col">
<h4>The Firm</h4>
<a href="#first24">The First 24 Hours</a>
<a href="#generations">Two Generations</a>
<a href="#testimonials">In Their Words</a>
<a href="#faq">Questions</a>
<a href="/updates">News &amp; Updates</a>
</div>
<div className="foot-col">
<h4>Practice</h4>
<a href="#practice">Criminal Defense</a>
<a href="#practice">Juvenile Law</a>
<a href="#practice">Personal Injury</a>
<a href="#practice">Estate Planning</a>
</div>
<div className="foot-col">
<h4>Office</h4>
<a href="tel:+13184734250">318.473.4250</a>
<span className="fc-line">1603 Melrose St<br />Pineville, LA 71360</span>
<span className="fc-line">Mon to Fri · 8:00 AM to 4:30 PM</span>
<a href="https://www.google.com/maps?q=1603+Melrose+St,+Pineville,+LA+71360" target="_blank" rel="noopener">Directions &rarr;</a>
</div>
</div>
<p className="foot-disc">Attorney Advertising. The information on this website is general in nature and is not legal advice. Viewing this site or contacting Higgins Law does not create an attorney-client relationship. Past results do not guarantee or predict a similar outcome in future matters.</p>
<p className="foot-sig"><span className="mark">&sect;</span> Higgins Law, 1603 Melrose St, Pineville, Louisiana 71360. &copy; 2026. All rights reserved.</p>
</div></footer>


<div className="mob"><a href="tel:+13184734250">Call 318.473.4250</a></div>
    </div>
  );
}
