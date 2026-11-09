import React from "react";
import content from "../content.json";
import ArsenalIcon from "./ArsenalIcon";

// Everything here lives in src/content.json under "arsenal" (edit it from /admin in
// `npm run dev`): the sticker sitting on the panel's top edge, what she says in the
// speech bubble, the title beside her, and the cards inside the panel.
const ARSENAL = content.arsenal;

const Arsenal = () => {
  return (
    <section id="arsenal" className="section arsenal-section">
      {/* Above the panel: sticker on its edge, speech bubble and title to her right */}
      <div className="arsenal-header">
        {ARSENAL.image && <img src={ARSENAL.image} alt="" className="arsenal-sticker" />}
        <div className="arsenal-heading">
          {ARSENAL.quote && <p className="arsenal-bubble">{ARSENAL.quote}</p>}
          <p className="section-label">02 · Toolkit</p>
          <h2 className="section-title arsenal-title-main">{ARSENAL.title}</h2>
        </div>
      </div>

      <div className="glass-card arsenal-panel">
        <div className="arsenal-grid">
          {ARSENAL.cards.map((card, i) => (
            <article key={i} className="arsenal-card" style={{ "--tint": card.color }}>
              <ArsenalIcon icon={card.icon} className="arsenal-icon" />
              <h3 className="arsenal-title">{card.title}</h3>
              <p className="arsenal-items">{card.items.join(" · ")}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Arsenal;
