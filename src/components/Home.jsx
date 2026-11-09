import React from "react";
import { Link } from "react-router-dom";
import { CARDS } from "../cards";
import { CardIcon, CardTitle } from "./CardBits";
import content from "../content.json";

// Hero text lives in src/content.json (edit it from /admin in `npm run dev`)
const HERO = content.hero;

const Home = () => {
  return (
    <section id="home" className="hero">
      {/* Left: picture, name and tagline, sitting straight on the galaxy */}
      <div className="hero-left">
        <div className="profile-orbit">
          <div className="profile-ring" />
          <div className="profile-image">
            <img src="/profile.png" alt={HERO.name} />
          </div>
        </div>

        <h1 className="intro-title">
          <span className="highlight">{HERO.name}</span>
        </h1>

        <div className="glass-card hero-text">
          <p className="intro-subtitle">{HERO.subtitle}</p>
        </div>
      </div>

      {/* Right: translucent black panel with the info box and cards */}
      <div className="hero-right">
        <div className="glass-card hero-info">
          {/* Sticker peeking over the top edge of the card */}
          <img src="/sakumanga.png" alt="" className="hero-sticker" />
          <p className="section-label">Mission Briefing</p>
          <h2 className="hero-info-title">{HERO.briefingTitle}</h2>
          <p>{HERO.briefingText}</p>
          <div className="intro-buttons">
            <a href="#about" className="btn-primary">
              Know Me
            </a>
            <a href="#contact" className="btn-outline">
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-cards">
          {CARDS.map((card) => (
            <Link key={card.path} to={card.path} className="glass-card hero-card">
              <CardIcon card={card} />
              <span>
                <span className="hero-card-title">
                  <CardTitle card={card} />
                </span>
                <span className="hero-card-text">{card.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
