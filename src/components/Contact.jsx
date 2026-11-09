import React from "react";
import content from "../content.json";

// Contact details live in src/content.json (edit them from /admin in `npm run dev`)
const CONTACT = content.contact;

const Contact = () => {
  return (
    <section id="contact" className="section">
      <p className="section-label">04 · Open Channel</p>
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
        <p className="contact-text">{CONTACT.text}</p>

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
