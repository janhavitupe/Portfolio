import React from "react";

// The four quick-link cards in the right-hand panel
const CARDS = [
  { icon: "🪐", title: "Mission Log", text: "Projects I've launched", href: "#projects" },
  { icon: "✦", title: "Skills in Orbit", text: "Tools I build with", href: "#about" },
  { icon: "🔭", title: "Exploring", text: "Where AI meets astrophysics", href: "#about" },
  { icon: "📡", title: "Open Channel", text: "Send me a signal", href: "#contact" },
];

const Home = () => {
  return (
    <section id="home" className="hero">
      {/* Left: picture, name and tagline, sitting straight on the galaxy */}
      <div className="hero-left">
        <div className="profile-orbit">
          <div className="profile-ring" />
          <div className="profile-image">
            <img src="/profile.png" alt="Janhavi Tupe" />
          </div>
        </div>

        <h1 className="intro-title">
          <span className="highlight">Janhavi Tupe</span>
        </h1>

        <div className="glass-card hero-text">
          <p className="intro-subtitle">
            AIML | Full-Stack | Software | Explorer of the Cosmos
          </p>
        </div>
      </div>

      {/* Right: translucent black panel with the info box and cards */}
      <div className="hero-right">
        <div className="glass-card hero-info">
          {/* Sticker peeking over the top edge of the card */}
          <img src="/sakumanga.png" alt="" className="hero-sticker" />
          <p className="section-label">Mission Briefing</p>
          <h2 className="hero-info-title">Hi, I'm Janhavi 👋</h2>
          <p>
            I'm a frontend developer who spends as much time looking up at the
            night sky as at a code editor. I build interfaces that feel alive,
            and I'm especially drawn to the place where artificial intelligence
            meets the study of the universe.
          </p>
          <div className="intro-buttons">
            <a href="#projects" className="btn-primary">
              View Projects
            </a>
            <a href="#contact" className="btn-outline">
              Contact Me
            </a>
          </div>
        </div>

        <div className="hero-cards">
          {CARDS.map((card) => (
            <a key={card.title} href={card.href} className="glass-card hero-card">
              <span className="hero-card-icon" aria-hidden="true">
                {card.icon}
              </span>
              <span>
                <span className="hero-card-title">{card.title}</span>
                <span className="hero-card-text">{card.text}</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
