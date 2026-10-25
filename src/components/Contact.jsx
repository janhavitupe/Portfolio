import React from "react";

const CONTACT = {
  email: "janhavitupe2005@gmail.com",
  github: "https://github.com/janhavitupe",
  linkedin: "https://www.linkedin.com/in/janhavi-tupe-148663328/",
};

const Contact = () => {
  return (
    <section id="contact" className="section">
      <p className="section-label">03 · Open Channel</p>
      <h2 className="section-title">Contact</h2>

      <div className="glass-card contact-card">
        <div className="signal-row">
          <img src="/sasukesticker.png" alt="" className="contact-sticker" />
          <div className="signal-dish" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
        </div>
        <p className="contact-text">
          Have an idea, an opportunity, or just want to talk about black holes?
          Send a signal and I'll get back to you at light speed.
        </p>

        <a href={`mailto:${CONTACT.email}`} className="btn-primary">
          Send a Signal
        </a>

        <div className="contact-links">
          <a href={CONTACT.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <span aria-hidden="true">✦</span>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <span aria-hidden="true">✦</span>
          <a href={`mailto:${CONTACT.email}`}>Gmail</a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
