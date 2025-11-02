import React from "react";
import ParticlesBackground from "./components/ParticlesBackground";
import Navbar from "./components/navbar";
import Home from "./components/home";

function App() {
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden bg-black text-white font-sans">
      {/* Background should stay behind */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <ParticlesBackground />
      </div>

      {/* Content */}
      <Navbar />
      <main className="flex flex-col items-center justify-center px-4 md:px-10 lg:px-20 pt-24">
        <Home />
      </main>
    </div>
  );
}

export default App;
