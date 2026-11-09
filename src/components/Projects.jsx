import React from "react";
import content from "../content.json";

// Projects live in src/content.json. Edit them from /admin while running `npm run dev`.
// The button uses the project's first link (none = no button); set `image` to show a
// picture instead of a planet. The full list, with screenshots, is on /mission-log.
const PROJECTS = content.projects;

const Projects = () => {
  return (
    <section id="projects" className="section">
      <p className="section-label">03 · Mission Log</p>
      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {PROJECTS.map((project, i) => (
          <article key={i} className="glass-card project-card">
            {project.image ? (
              <img src={project.image} alt="" className="project-image" />
            ) : (
              <div className={`project-planet planet-${project.planet}`} />
            )}
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <ul className="project-tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            {project.links[0] && (
              <a
                href={project.links[0].url}
                target="_blank"
                rel="noreferrer"
                className="btn-outline project-link"
              >
                {project.links[0].label || "View Project"}
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
