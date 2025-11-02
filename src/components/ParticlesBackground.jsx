import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  const options = {
    background: {
      color: { value: "#000" },
    },
    fpsLimit: 60,
    detectRetina: true,

    particles: {
      number: {
        value: 200,
        density: { enable: true, area: 1000 },
      },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.3, max: 1 },
        animation: { enable: true, speed: 1, sync: false },
      },
      size: { value: { min: 0.5, max: 2.5 } },
      move: {
        enable: true,
        speed: { min: 0.05, max: 0.3 },
        random: true,
        straight: false,
        outModes: "out",
      },
      twinkle: { particles: { enable: true, frequency: 0.05, opacity: 1 } },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.1,
        width: 0.5,
      },
    },

    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push: { quantity: 4 },
      },
    },

    emitters: [
      {
        rate: { delay: 5, quantity: 1 },
        size: { width: 0, height: 0 },
        position: {
          x: Math.random() * 100,
          y: 0,
        },
        particles: {
          move: {
            direction: "bottom-right",
            angle: { offset: 0, value: { min: 20, max: 60 } },
            speed: { min: 15, max: 25 },
            straight: true,
            outModes: "destroy",
            trail: {
              enable: true,
              length: 50,
              fillColor: "#000000",
            },
          },
          size: { value: { min: 5, max: 8 } },
          color: {
            value: ["#ffffff", "#aaf0ff", "#99ccff", "#80d0ff"],
          },
          opacity: {
            value: 1,
            animation: {
              enable: true,
              speed: 3,
              decay: 0.05,
              startValue: "max",
            },
          },
          life: {
            duration: { value: 3 },
            count: 1,
          },
          rotate: {
            value: { min: 0, max: 360 },
            animation: { enable: true, speed: 5, sync: false },
          },
          zIndex: 20,
          shadow: {
            enable: true,
            color: "#ffffff",
            blur: 20,
          },
          glow: {
            enable: true,
            intensity: 1.5,
          },
        },
      },
    ],
  };

  return <>{init && <Particles id="tsparticles" options={options} />}</>;
};

export default ParticlesBackground;
