import React, { useEffect, useRef, useState } from "react";

const SaturnCursor = () => {
  const cursorRef = useRef(null);
  // Only replace the cursor on devices with a real mouse (not touch screens)
  const [enabled] = useState(
    () => window.matchMedia("(pointer: fine)").matches
  );

  useEffect(() => {
    if (!enabled) return;
    const cursor = cursorRef.current;
    document.body.classList.add("has-saturn-cursor");

    const onMove = (e) => {
      // Update the DOM directly so moving the mouse doesn't trigger re-renders
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      cursor.classList.add("visible");
      cursor.classList.toggle(
        "hovering",
        Boolean(e.target.closest("a, button, [role='button']"))
      );
    };
    const onLeave = (e) => {
      if (!e.relatedTarget) cursor.classList.remove("visible");
    };
    const onDown = () => cursor.classList.add("pressed");
    const onUp = () => cursor.classList.remove("pressed");

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseout", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      document.body.classList.remove("has-saturn-cursor");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={cursorRef} className="saturn-cursor" aria-hidden="true">
      <div className="saturn-cursor-inner">
        <svg viewBox="0 0 64 64" width="48" height="48">
          <defs>
            {/* Latitude bands, running parallel to the equator */}
            <linearGradient id="saturn-bands" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c9a26a" />
              <stop offset="22%" stopColor="#f3dcaa" />
              <stop offset="38%" stopColor="#d9ad6c" />
              <stop offset="50%" stopColor="#f6e2b6" />
              <stop offset="64%" stopColor="#cf9a58" />
              <stop offset="80%" stopColor="#ecd09a" />
              <stop offset="100%" stopColor="#a8773f" />
            </linearGradient>
            {/* Darkens the edges so the planet looks round */}
            <radialGradient id="saturn-shade" cx="42%" cy="38%" r="62%">
              <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.35" />
              <stop offset="55%" stopColor="#000" stopOpacity="0" />
              <stop offset="100%" stopColor="#2a1606" stopOpacity="0.65" />
            </radialGradient>
            <linearGradient id="saturn-ring" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#c9b28a" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#f8e8c4" />
              <stop offset="100%" stopColor="#c9b28a" stopOpacity="0.45" />
            </linearGradient>
            <clipPath id="saturn-clip">
              <circle cx="32" cy="32" r="13" />
            </clipPath>
          </defs>

          {/* Everything is drawn in a frame tilted on Saturn's axis */}
          <g transform="rotate(-22 32 32)">
            {/* Back half of the rings, drawn behind the planet */}
            <path d="M4 32 A28 8 0 0 1 60 32" fill="none" stroke="url(#saturn-ring)" strokeWidth="3" />
            <path d="M9.5 32 A22.5 6.4 0 0 1 54.5 32" fill="none" stroke="#e9d3a6" strokeOpacity="0.7" strokeWidth="2.4" />

            {/* The planet: banded base, a moving surface, then shading */}
            <g clipPath="url(#saturn-clip)">
              <rect x="19" y="19" width="26" height="26" fill="url(#saturn-bands)" />
              <g className="saturn-surface">
                <g id="saturn-surface-tile">
                  <path d="M19 30 Q25.5 28.6 32 30 T45 30" stroke="#a8702f" strokeWidth="1.4" fill="none" opacity="0.55" />
                  <path d="M19 37.5 Q25.5 38.9 32 37.5 T45 37.5" stroke="#b9823f" strokeWidth="1.2" fill="none" opacity="0.5" />
                  <ellipse cx="25" cy="27" rx="3" ry="1.1" fill="#9a6430" opacity="0.6" />
                  <ellipse cx="37" cy="34" rx="3.8" ry="1.3" fill="#fff3d2" opacity="0.55" />
                  <ellipse cx="42" cy="40.5" rx="1.8" ry="0.8" fill="#8f5a27" opacity="0.5" />
                </g>
                <use href="#saturn-surface-tile" x="26" />
              </g>
              <circle cx="32" cy="32" r="13" fill="url(#saturn-shade)" />
            </g>

            {/* Front half of the rings, drawn over the planet */}
            <path d="M9.5 32 A22.5 6.4 0 0 0 54.5 32" fill="none" stroke="#e9d3a6" strokeOpacity="0.8" strokeWidth="2.4" />
            <path d="M4 32 A28 8 0 0 0 60 32" fill="none" stroke="url(#saturn-ring)" strokeWidth="3" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SaturnCursor;
