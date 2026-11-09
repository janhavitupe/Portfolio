import React from "react";
import content from "../content.json";

// The About text lives in src/content.json (edit it from /admin in `npm run dev`).
// Leave a blank line between paragraphs in the editor to start a new one.
const PARAGRAPHS = content.about.paragraphs;

const About = () => {
  return (
    <section id="about" className="section">
      <p className="section-label">01 · Origin Story</p>
      <h2 className="section-title">About Me</h2>

      <div className="glass-card about-card about-card-plain">
        {/* Sasuke sitting on the card's top edge */}
        <img src="/download_wipe_bg%20(1).png" alt="" className="about-sticker" />
        {PARAGRAPHS.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    </section>
  );
};

export default About;
