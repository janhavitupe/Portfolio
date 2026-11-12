import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import content from "../content.json";

// The Mission Log page (/mission-log). Left: Diana dancing, fixed in place.
// Right: every project as a card you scroll through, with its screenshots
// scattered like photos on a desk. Projects live in src/content.json
// (edit them, their links and screenshots from /admin in `npm run dev`).
const PROJECTS = content.projects;

// Space kept clear between the screenshots and the edges of their box
const PAD = 10;

// Small seeded random generator, so each screenshot gets the same "random"
// position and tilt on every visit instead of jumping around
function seededRandom(text) {
  let h = 1779033703;
  for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 3432918353);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const clamp01 = (v) => Math.min(Math.max(v, 0), 1);

// Lays out each screenshot once, tilted and overlapping, so that every tile,
// tilt included, sits fully inside the box with PAD pixels to spare.
// `ratios` holds each image's real width/height, so tiles are never cropped.
function layoutPile(title, shots, ratios, W, H) {
  const rand = seededRandom(title || "project");
  const n = shots.length;
  const iw = W - PAD * 2;
  const ih = H - PAD * 2;
  // Fewer screenshots -> bigger tiles
  const size = n === 1 ? 0.8 : n === 2 ? 0.66 : n <= 4 ? 0.56 : 0.5;
  // Spread tiles from edge to edge: the first and last slots sit right at the
  // 10px padding, the rest evenly between, shuffled so the pile looks random
  const slots = () => shots.map((_, i) => (n === 1 ? 0.5 : i / (n - 1))).sort(() => rand() - 0.5);
  const xs = slots();
  const ys = slots();

  return shots.map((src, i) => {
    const ratio = ratios[src] || 16 / 10;
    let w = iw * size * (ratio < 1 ? 0.55 : 1); // tall phone shots a bit narrower
    let h = w / ratio;
    const angle = (rand() - 0.5) * 24;
    const rad = (Math.abs(angle) * Math.PI) / 180;
    const boundW = () => w * Math.cos(rad) + h * Math.sin(rad);
    const boundH = () => w * Math.sin(rad) + h * Math.cos(rad);
    // Shrink if the tilted tile wouldn't fit the box at all
    const fit = Math.min(1, iw / boundW(), ih / boundH());
    w *= fit;
    h *= fit;
    // Centre range that keeps the whole tilted tile inside the padding
    const minX = PAD + boundW() / 2;
    const maxX = W - PAD - boundW() / 2;
    const minY = PAD + boundH() / 2;
    const maxY = H - PAD - boundH() / 2;
    const x = minX + (maxX - minX) * clamp01(xs[i] + (rand() - 0.5) * 0.1);
    const y = minY + (maxY - minY) * clamp01(ys[i] + (rand() - 0.5) * 0.1);
    return {
      src,
      x,
      y,
      w,
      h,
      angle,
      // On hover: slide to the centre and grow to fill the box (inside the padding)
      dx: W / 2 - x,
      dy: H / 2 - y,
      grow: Math.min(iw / w, ih / h),
    };
  });
}

// One project's pile of screenshots. Measures its box so the layout always fits.
const ShotPile = ({ project, onOpen }) => {
  const boxRef = useRef(null);
  const [box, setBox] = useState(null);
  const [ratios, setRatios] = useState({});

  useEffect(() => {
    const el = boxRef.current;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox((prev) =>
        prev && Math.abs(prev.w - width) < 1 && Math.abs(prev.h - height) < 1 ? prev : { w: width, h: height }
      );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const shots = project.screenshots;
  const tiles = box ? layoutPile(project.title, shots, ratios, box.w, box.h) : [];

  // Learn each image's real shape once it loads, then re-lay out
  const remember = (src) => (e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight && !ratios[src]) {
      setRatios((prev) => ({ ...prev, [src]: naturalWidth / naturalHeight }));
    }
  };

  return (
    <div ref={boxRef} className="project-shots">
      {shots.length === 0 ? (
        <div className={`project-planet project-shots-planet planet-${project.planet}`} />
      ) : (
        tiles.map((t, j) => (
          <button
            key={t.src + j}
            type="button"
            className="project-shot"
            style={{
              left: t.x,
              top: t.y,
              width: t.w,
              height: t.h,
              "--r": `${t.angle}deg`,
              "--dx": `${t.dx}px`,
              "--dy": `${t.dy}px`,
              "--grow": t.grow,
            }}
            onClick={() => onOpen(t.src)}
            aria-label={`Open screenshot ${j + 1} of ${project.title}`}
          >
            <img src={t.src} alt="" onLoad={remember(t.src)} />
          </button>
        ))
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const [zoomed, setZoomed] = useState(null);

  // Esc closes the enlarged screenshot
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e) => e.key === "Escape" && setZoomed(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  return (
    <div className="projects-page">
      {/* Left column: fixed in place while the projects scroll */}
      <aside className="projects-side">
        <img src="/diana-cutout.webp" alt="" className="projects-dancer" />
      </aside>

      <main className="projects-main">
        <Link to="/" className="projects-back">← Back to Home</Link>
        <p className="section-label">Mission Log</p>
        <h1 className="section-title projects-heading">My Projects</h1>

        {PROJECTS.map((project, i) => (
          <article key={i} className="glass-card project-row">
            <div className="project-info">
              <h2 className="project-row-title">{project.title}</h2>
              <p className="project-row-text">{project.description}</p>
              {project.tags.length > 0 && (
                <ul className="project-tags">
                  {project.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
              )}
              {project.links.length > 0 && (
                <div className="project-row-links">
                  {project.links.map((link, j) => (
                    <a key={j} href={link.url} target="_blank" rel="noreferrer" className="btn-outline">
                      {link.label || "Link"} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>

            <ShotPile project={project} onOpen={setZoomed} />
          </article>
        ))}
      </main>

      {zoomed && (
        <div className="shot-lightbox" onClick={() => setZoomed(null)} role="dialog" aria-label="Screenshot">
          <img src={zoomed} alt="" />
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
