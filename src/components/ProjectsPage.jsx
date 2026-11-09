import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import content from "../content.json";

// The Mission Log page (/mission-log). Left: Diana dancing, pinned in place.
// Right: every project as a card you scroll through, with its screenshots
// scattered like photos on a desk. Projects live in src/content.json
// (edit them, their links and screenshots from /admin in `npm run dev`).
const PROJECTS = content.projects;

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

// How many tiles each pile shows. Projects with fewer screenshots reuse them,
// each repeat cropped to a different part of the image so it looks like a new shot.
const PILE_SIZE = 8;

// A cluttered pile: tiles spread over a loose 3×3 grid, then nudged, resized,
// tilted, and mixed between wide and tall shapes
function scatter(project) {
  const shots = project.screenshots;
  if (shots.length === 0) return [];
  const rand = seededRandom(project.title || "project");
  const cells = [0, 1, 2, 3, 4, 5, 6, 7, 8].sort(() => rand() - 0.5).slice(0, PILE_SIZE);
  return cells.map((cell, i) => {
    const repeat = Math.floor(i / shots.length);
    const tall = rand() < 0.3;
    return {
      src: shots[i % shots.length],
      x: `${(0.2 + (cell % 3) * 0.3 + (rand() - 0.5) * 0.14) * 100}%`,
      y: `${(0.2 + Math.floor(cell / 3) * 0.3 + (rand() - 0.5) * 0.14) * 100}%`,
      r: `${(rand() - 0.5) * 30}deg`,
      w: `${(tall ? 22 : 34) + rand() * 12}%`,
      ratio: tall ? "3 / 4" : "16 / 10",
      // first copy shows the top of the screenshot; repeats show other parts of it
      pos: repeat === 0 ? "50% 0%" : `${Math.round(rand() * 100)}% ${Math.round(30 + rand() * 70)}%`,
    };
  });
}

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
      {/* Left column: stays put while the projects scroll */}
      <aside className="projects-side">
        <img src="/diana-cutout.webp" alt="" className="projects-dancer" />
      </aside>

      <main className="projects-main">
        <Link to="/" className="projects-back">← Back to Home</Link>
        <p className="section-label">Mission Log</p>
        <h1 className="section-title projects-heading">My Projects</h1>

        {PROJECTS.map((project, i) => {
          const shots = scatter(project);
          return (
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

              <div className="project-shots">
                {shots.length === 0 ? (
                  <div className={`project-planet project-shots-planet planet-${project.planet}`} />
                ) : (
                  shots.map((shot, j) => (
                    <button
                      key={j}
                      type="button"
                      className="project-shot"
                      style={{ "--x": shot.x, "--y": shot.y, "--r": shot.r, "--w": shot.w, "--ratio": shot.ratio }}
                      onClick={() => setZoomed(shot.src)}
                      aria-label={`Open screenshot ${j + 1} of ${project.title}`}
                    >
                      <img src={shot.src} alt="" style={{ objectPosition: shot.pos }} loading="lazy" />
                    </button>
                  ))
                )}
              </div>
            </article>
          );
        })}
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
