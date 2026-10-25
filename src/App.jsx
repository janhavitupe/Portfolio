import React from "react";
import { Route, Routes } from "react-router-dom";
import ParticlesBackground from "./components/ParticlesBackground";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import CardPage from "./components/CardPage";
import SaturnCursor from "./components/SaturnCursor";
import WarpTransition from "./components/WarpTransition";
import { CARDS } from "./cards";

function App() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white font-sans">
      {/* Background layers stay on screen across pages: galaxy glow, then the starfield */}
      <div className="galaxy" aria-hidden="true">
        <div className="galaxy-band" />
      </div>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ParticlesBackground />
      </div>

      <SaturnCursor />
      <WarpTransition />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* One page per homepage card */}
        {CARDS.map((card) => (
          <Route key={card.path} path={card.path} element={<CardPage card={card} />} />
        ))}
        <Route path="*" element={<HomePage />} />
      </Routes>

      <footer className="site-footer">
        © {new Date().getFullYear()} Janhavi Tupe · Made among the stars
      </footer>
    </div>
  );
}

// The homepage: the hero spans the full width; the other sections are centered
function HomePage() {
  return (
    <>
      <Home />
      <main className="flex flex-col items-center px-4 md:px-10 lg:px-20">
        <About />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
