import React from "react";
import { Link } from "react-router-dom";
import { CardIcon, CardTitle } from "./CardBits";

// Placeholder page opened by one of the homepage cards. Replace the
// "coming soon" content with the real page when it's ready.
const CardPage = ({ card }) => {
  return (
    <main className="card-page">
      <div className="glass-card card-page-panel">
        <CardIcon card={card} className="card-page-icon" />
        <h1 className="section-title card-page-title">
          <CardTitle card={card} />
        </h1>
        <p className="card-page-text">{card.text}</p>
        <p className="card-page-soon">🚧 This page is still being built. Check back soon!</p>
        <Link to="/" className="btn-outline">
          ← Back to Home
        </Link>
      </div>
    </main>
  );
};

export default CardPage;
