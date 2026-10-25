import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// How long the jump to hyperspace lasts, and the fade into the new page
const WARP_MS = 4000;
const FADE_MS = 400;

const STAR_COUNT = 900;
const STAR_COLORS = ["#ffffff", "#ffffff", "#cfe8ff", "#e4ccff", "#ffd6f5"];

const smoothstep = (x) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};

// Draws the hyperspace jump on a canvas: stars streak outward from the
// centre, speeding up, then the screen flashes white. Drawn live at the
// screen's full resolution, so it stays sharp on any display.
function runWarp(canvas, durationMs) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = (canvas.width = Math.round(window.innerWidth * dpr));
  const h = (canvas.height = Math.round(window.innerHeight * dpr));
  const cx = w / 2;
  const cy = h / 2;
  const focal = Math.max(w, h) * 0.5;

  // Stars start in a narrow tunnel ahead of us, so they begin near the centre
  // and only reach the screen edges as they fly past
  const newStar = (z) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.03 + Math.random() * 0.4;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      z,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    };
  };
  const stars = Array.from({ length: STAR_COUNT }, () => newStar(0.15 + Math.random() * 0.85));
  const margin = 40 * dpr;
  const offScreen = (x, y) => x < -margin || x > w + margin || y < -margin || y > h + margin;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);

  const start = performance.now();
  let last = start;
  let frame;

  const draw = (now) => {
    const t = (now - start) / durationMs; // 0 -> 1 over the whole jump
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Speed ramps up over the first ~40% of the jump, then holds at full warp
    const speed = 0.08 + 1.6 * smoothstep(t / 0.4);
    // Longer streaks the faster we go
    const streak = 0.02 + 0.18 * smoothstep(t / 0.4);

    // Partly clear the last frame for a motion-blur trail
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, w, h);

    ctx.lineCap = "round";
    for (const s of stars) {
      s.z -= speed * dt;
      const x1 = cx + (s.x / Math.max(s.z, 0.01)) * focal;
      const y1 = cy + (s.y / Math.max(s.z, 0.01)) * focal;
      // Recycle stars that have flown past, back into the distance
      if (s.z <= 0.01 || offScreen(x1, y1)) {
        Object.assign(s, newStar(0.8 + Math.random() * 0.2));
        continue;
      }
      const tailZ = s.z + streak;
      const x0 = cx + (s.x / tailZ) * focal;
      const y0 = cy + (s.y / tailZ) * focal;

      const near = 1 - s.z; // 0 far away -> 1 right in front of us
      ctx.globalAlpha = Math.min(1, 0.15 + near * 1.1);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = (0.4 + near * near * 3) * dpr;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Soft blue glow at the vanishing point, growing as we speed up
    const glowR = Math.max(w, h) * (0.08 + 0.25 * smoothstep(t / 0.8));
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowR);
    glow.addColorStop(0, `rgba(190, 215, 255, ${0.15 + 0.35 * smoothstep(t / 0.8)})`);
    glow.addColorStop(1, "rgba(120, 150, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);

    // White flash in the last 15% as we "arrive"
    const flash = smoothstep((t - 0.85) / 0.15);
    if (flash > 0) {
      ctx.fillStyle = `rgba(235, 242, 255, ${flash * 0.9})`;
      ctx.fillRect(0, 0, w, h);
    }

    if (t < 1) frame = requestAnimationFrame(draw);
  };

  frame = requestAnimationFrame(draw);
  return () => cancelAnimationFrame(frame);
}

// Plays the hyperspace jump full-screen whenever the page changes,
// including with the browser's back and forward buttons.
const WarpTransition = () => {
  const { pathname } = useLocation();
  const canvasRef = useRef(null);
  const lastPath = useRef(pathname);
  const [phase, setPhase] = useState("hidden"); // "hidden" | "playing" | "fading"

  // useLayoutEffect runs before the browser paints, so the warp covers
  // the screen before the new page can flash into view
  useLayoutEffect(() => {
    // Only warp when the page actually changed. (This also skips the first
    // load, even though React runs effects twice on startup in development.)
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.scrollTo(0, 0);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setPhase("playing");
  }, [pathname]);

  // Run the animation while playing; restart it if the page changes again mid-warp
  useEffect(() => {
    if (phase !== "playing") return;
    return runWarp(canvasRef.current, WARP_MS);
  }, [phase, pathname]);

  // Fade out once the jump has finished, then hide
  useEffect(() => {
    if (phase === "hidden") return;
    const timer = setTimeout(
      () => setPhase(phase === "playing" ? "fading" : "hidden"),
      phase === "playing" ? WARP_MS : FADE_MS
    );
    return () => clearTimeout(timer);
  }, [phase, pathname]);

  return (
    <div
      className={`warp-overlay ${phase}`}
      style={{ "--warp-fade": `${FADE_MS}ms` }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default WarpTransition;
