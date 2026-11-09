import React from "react";
import content from "../content.json";
import ArsenalIcon from "./ArsenalIcon";

// Cards live in src/content.json under "arsenal" (edit them from /admin in `npm run dev`).
// Each card: an icon, a title, a tint colour and a list of items.
const ARSENAL = content.arsenal;

const Arsenal = () => {
  return (
    <section id="arsenal" className="section">
      <p className="section-label">02 · Toolkit</p>
      <h2 className="section-title">{ARSENAL.title}</h2>
      {ARSENAL.subtitle && <p className="arsenal-subtitle">{ARSENAL.subtitle}</p>}

      <div className="arsenal-grid">
        {ARSENAL.cards.map((card, i) => (
          <article key={i} className="arsenal-card" style={{ "--tint": card.color }}>
            <ArsenalIcon icon={card.icon} className="arsenal-icon" />
            <h3 className="arsenal-title">{card.title}</h3>
            <p className="arsenal-items">{card.items.join(" · ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Arsenal;
