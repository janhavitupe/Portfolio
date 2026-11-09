import React, { useEffect, useRef, useState } from "react";
import content from "../content.json";

// Width / height of embrsed-sticker.png, so its width can be worked out from a height
const STICKER_RATIO = 568 / 594;

// Text and skills live in src/content.json (edit them from /admin in `npm run dev`).
// Each skill is shown as a small glowing "planet".
const { paragraphs: PARAGRAPHS, skills: SKILLS } = content.about;

const About = () => {
  const cardRef = useRef(null);
  const skillsRef = useRef(null);
  const [stickerWidth, setStickerWidth] = useState(null);

  // Size the corner sticker so it's as tall as the skills block plus the card's
  // bottom padding: more skills -> taller block -> bigger sticker. The width is
  // capped at 40% of the card so the skills always keep enough room.
  useEffect(() => {
    const card = cardRef.current;
    const skills = skillsRef.current;

    const update = () => {
      const paddingBottom = parseFloat(getComputedStyle(card).paddingBottom);
      const height = skills.offsetHeight + paddingBottom;
      const maxWidth = card.clientWidth * 0.4;
      const width = Math.round(Math.min(Math.max(height * STICKER_RATIO, 100), maxWidth));
      // Ignore 1px jitter so resizing settles instead of looping
      setStickerWidth((prev) => (prev && Math.abs(prev - width) <= 1 ? prev : width));
    };

    const observer = new ResizeObserver(update);
    observer.observe(skills);
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="section">
      <p className="section-label">01 · Origin Story</p>
      <h2 className="section-title">About Me</h2>

      <div
        ref={cardRef}
        className="glass-card about-card"
        style={stickerWidth ? { "--corner-sticker-width": `${stickerWidth}px` } : undefined}
      >
        {/* Character sitting on the card's top edge */}
        <img src="/download_wipe_bg%20(1).png" alt="" className="about-sticker" />
        {PARAGRAPHS.map((text, i) => (
          <p key={i}>{text}</p>
        ))}

        {/* Skills sit to the right of the sticker in the card's bottom-left corner */}
        <div ref={skillsRef} className="about-skills">
          <h3 className="skills-heading">Skills in my orbit</h3>
          <ul className="skills-list">
            {SKILLS.map((skill, i) => (
              <li key={i} className="skill-chip">
                <span
                  className="skill-planet"
                  style={{ "--planet-color": skill.color }}
                />
                {skill.name}
              </li>
            ))}
          </ul>
        </div>
        <img src="/embrsed-sticker.png" alt="" className="about-corner-sticker" />
      </div>
    </section>
  );
};

export default About;
