import React from "react";

// A card's icon: either a picture or an emoji
export const CardIcon = ({ card, className = "" }) => (
  <span className={`hero-card-icon ${className}`} aria-hidden="true">
    {card.image ? <img src={card.image} alt="" className="hero-card-image" /> : card.icon}
  </span>
);

// A card's title, with its optional picture-emoji and closing text
export const CardTitle = ({ card }) => (
  <>
    {card.title}
    {card.titleEmoji && <img src={card.titleEmoji} alt="" className="title-emoji" />}
    {card.titleEnd}
  </>
);
