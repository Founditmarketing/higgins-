import "./Team.css";

export default function Team() {
  return (
    <>
      <div className="div-f"></div>
      <section className="sec s-dark" id="team">
        <div className="wrap">
          <div className="sl" data-r>Meet the Team</div>
          <h2 className="sh" data-r="d1">Experience You Can <em>Trust.</em></h2>
          <p className="sd" data-r="d2">
            A tradition of integrity passed from father to son &mdash; blending the wisdom of four decades with the drive of a new generation.
          </p>
          <div className="tm-g">
            <div className="tc" data-r>
              <div className="tp">
                <img
                  className="plx"
                  data-plx="-.03"
                  src="/George Lewis Higgins III.jpeg"
                  alt="George Lewis Higgins III"
                  loading="lazy"
                />
                <div className="tp-o"></div>
              </div>
              <div className="tb">
                <h3>George Lewis Higgins III</h3>
                <div className="tr">Founding Attorney</div>
                <p>
                  With over forty years of courtroom experience, George Higgins has built a reputation as a formidable advocate and trusted counselor. Known for his integrity, preparation, and steady presence in high-stakes trials, he has defended the rights of individuals and families across Louisiana.
                </p>
              </div>
            </div>
            <div className="tc" data-r="d1">
              <div className="tp">
                <img
                  className="plx"
                  data-plx="-.03"
                  src="/G. Alexander Higgins.jpeg"
                  alt="G. Alexander Higgins"
                  loading="lazy"
                />
                <div className="tp-o"></div>
              </div>
              <div className="tb">
                <h3>G. Alexander Higgins</h3>
                <div className="tr">Attorney &amp; Managing Partner</div>
                <p>
                  Alex Higgins carries forward the tradition with a modern vision &mdash; combining relentless advocacy with a commitment to client dignity and trust. Dedicated to strategy and accessibility, Alex leads Higgins Law into its next chapter while staying rooted in the firm&apos;s core values.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
