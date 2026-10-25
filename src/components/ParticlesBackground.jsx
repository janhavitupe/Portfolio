import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

// Layer 1: dense field of tiny, fast-twinkling coloured stars (no lines)
const sparkleOptions = {
  background: { color: { value: "transparent" } },
  fullScreen: { enable: false },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 380,
      density: { enable: true, width: 1920, height: 1080 },
    },
    color: { value: ["#ffffff", "#ffffff", "#ffd6f5", "#cfe8ff", "#e4ccff", "#b8fff4"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.1, max: 1 },
      animation: { enable: true, speed: 1.5, sync: false },
    },
    size: { value: { min: 0.3, max: 1.6 } },
    move: {
      enable: true,
      speed: 0.05,
      random: true,
      outModes: "out",
    },
    twinkle: {
      particles: { enable: true, frequency: 0.08, opacity: 1, color: { value: "#ffffff" } },
    },
  },
};

// Layer 2: bigger glowing stars joined by thick constellation lines
const constellationOptions = {
  background: { color: { value: "transparent" } },
  fullScreen: { enable: false },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 70,
      density: { enable: true, width: 1920, height: 1080 },
    },
    color: { value: ["#ffffff", "#dbe7ff", "#ffe0f7"] },
    shape: { type: "circle" },
    opacity: {
      value: { min: 0.6, max: 1 },
      animation: { enable: true, speed: 0.8, sync: false },
    },
    size: { value: { min: 1.5, max: 3.2 } },
    shadow: { enable: true, color: "#bcd4ff", blur: 8 },
    move: {
      enable: true,
      speed: { min: 0.1, max: 0.35 },
      random: true,
      outModes: "out",
    },
    links: {
      enable: true,
      distance: 170,
      color: "#cfdcff",
      opacity: 0.45,
      width: 1.6,
    },
  },

  interactivity: {
    // Listen on the window, since the content sits on top of the canvas
    detectsOn: "window",
    events: {
      onHover: { enable: true, mode: "grab" },
      onClick: { enable: true, mode: "push" },
      resize: { enable: true },
    },
    modes: {
      grab: { distance: 200, links: { opacity: 0.8, color: "#f0c6ff" } },
      push: { quantity: 3 },
    },
  },

  // Shooting stars launched from random points along the top edge
  emitters: [
    {
      rate: { delay: 5, quantity: 1 },
      size: { width: 100, height: 0 },
      position: { x: 50, y: 0 },
      particles: {
        move: {
          direction: "bottom-right",
          angle: { offset: 0, value: { min: 20, max: 60 } },
          speed: { min: 15, max: 25 },
          straight: true,
          outModes: "destroy",
        },
        size: { value: { min: 2, max: 4 } },
        color: { value: ["#ffffff", "#aaf0ff", "#ffd6f5"] },
        opacity: { value: 1 },
        life: { duration: { value: 3 }, count: 1 },
        links: { enable: false },
        shadow: { enable: true, color: "#ffffff", blur: 20 },
      },
    },
  ],
};

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <>
      <Particles id="tsparticles-sparkle" className="particles-layer" options={sparkleOptions} />
      <Particles id="tsparticles" className="particles-layer" options={constellationOptions} />
    </>
  );
};

export default ParticlesBackground;
