import React from "react";

// Add a project by adding an object here. Leave `link` empty to hide the button.
const PROJECTS = [
  {
    title: "SIH26043 — Problem Routing AI",
    description:
      "Smart India Hackathon platform that crowdsources societal challenges and uses AI to classify, prioritise, de-duplicate and route them to the right universities and industry partners.",
    tags: ["Python", "FastAPI", "Streamlit", "Gemini"],
    link: "",
    planet: "jupiter",
  },
  {
    title: "Cosmic Portfolio",
    description:
      "This site! A space-themed portfolio with a live starfield, shooting stars, a drifting nebula and a spinning Saturn cursor.",
    tags: ["React", "Vite", "Tailwind", "tsParticles"],
    link: "",
    planet: "neptune",
  },
  {
    title: "Next Mission",
    description:
      "Something new is on the launch pad. Check back soon to see what's landed here.",
    tags: ["Coming soon"],
    link: "",
    planet: "mars",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="section">
      <p className="section-label">02 · Mission Log</p>
      <h2 className="section-title">Projects</h2>

      <div className="projects-grid">
        {PROJECTS.map((project) => (
          <article key={project.title} className="glass-card project-card">
            <div className={`project-planet planet-${project.planet}`} />
            <h3 className="project-title">{project.title}</h3>
            <p className="project-description">{project.description}</p>
            <ul className="project-tags">
              {project.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="btn-outline project-link"
              >
                View Project
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Projects;
