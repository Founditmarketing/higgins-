import "./WhyUs.css";

export default function WhyUs() {
  return (
    <>
      <div className="div-f"></div>
      <section className="sec s-elev" id="why">
        <div className="wrap">
          <div className="sl" data-r>Why Higgins Law</div>
          <h2 className="sh" data-r="d1">Relationships. Respect.<br /><em>Results.</em></h2>
          <div className="wg">
            <div className="wc" data-r>
              <div className="wn">01</div>
              <h3>Stewardship</h3>
              <p>We view our practice not just as a profession, but as a calling. We are entrusted with your future, and we guard it with the highest standard of moral and legal integrity.</p>
            </div>
            <div className="wc" data-r="d1">
              <div className="wn">02</div>
              <h3>Respect</h3>
              <p>We treat every client with dignity. We listen closely and take your concerns seriously. We care about the people and the families behind the cases.</p>
            </div>
            <div className="wc" data-r="d2">
              <div className="wn">03</div>
              <h3>Results</h3>
              <p>No matter how complex the case, we prepare thoroughly, negotiate strategically, and fight for outcomes that make a real difference.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
