import React from "react";
import ParticlesBackground from "./components/ParticlesBackground";
import Home from "./components/Home";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import SaturnCursor from "./components/SaturnCursor";

function App() {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden text-white font-sans">
      {/* Background layers: galaxy glow, then the starfield on top of it */}
      <div className="galaxy" aria-hidden="true">
        <div className="galaxy-band" />
      </div>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ParticlesBackground />
      </div>

      <SaturnCursor />

      {/* Content */}
      {/* The hero spans the full width; the other sections are centered */}
      <Home />
      <main className="flex flex-col items-center px-4 md:px-10 lg:px-20">
        <About />
        <Projects />
        <Contact />
      </main>

      <footer className="site-footer">
        © {new Date().getFullYear()} Janhavi Tupe · Made among the stars
      </footer>
    </div>
  );
}

export default App;
