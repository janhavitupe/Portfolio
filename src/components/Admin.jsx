import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ArsenalIcon from "./ArsenalIcon";
import { ICONS } from "./arsenalIcons";

// Owner-only editor. It is only included while running `npm run dev` (see App.jsx),
// and saves through the dev server (see vite.config.js) into src/content.json.
// Visitors to the deployed site never get this page.

const PLANETS = ["jupiter", "neptune", "mars"];
const EMPTY_PROJECT = { title: "", description: "", tags: [], link: "", planet: "neptune", image: "" };
const EMPTY_ARSENAL_CARD = { icon: "sparkles", title: "", color: "#7dafff", items: [] };

// Text box + button that adds one item to a list (Enter also adds)
const AddItem = ({ onAdd, placeholder }) => {
  const [value, setValue] = useState("");
  const add = () => {
    const v = value.trim();
    if (!v) return;
    onAdd(v);
    setValue("");
  };
  return (
    <div className="admin-row">
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add();
          }
        }}
      />
      <button type="button" onClick={add}>+ Add</button>
    </div>
  );
};

const Field = ({ label, value, onChange, textarea = false, rows = 4, ...rest }) => (
  <label className="admin-field">
    <span>{label}</span>
    {textarea ? (
      <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} {...rest} />
    )}
  </label>
);

// Reads a picked image file and uploads it to public/uploads/, returning its URL
async function uploadImage(file) {
  const data = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const res = await fetch("/__admin/upload", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: file.name, data }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body.error);
  return body.url;
}

const Admin = () => {
  const [content, setContent] = useState(null);
  const [status, setStatus] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/__admin/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setStatus("Couldn't load content. Is `npm run dev` running?"));
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const warn = (e) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  if (!content) {
    return (
      <main className="admin-page">
        <p>{status || "Loading…"}</p>
      </main>
    );
  }

  // Update one value deep in the content, e.g. set(["hero", "name"], "Janhavi")
  const set = (keys, value) => {
    setContent((prev) => {
      const next = structuredClone(prev);
      let target = next;
      keys.slice(0, -1).forEach((k) => (target = target[k]));
      target[keys.at(-1)] = value;
      return next;
    });
    setDirty(true);
    setStatus("");
  };

  const save = async () => {
    setStatus("Saving…");
    try {
      const res = await fetch("/__admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setDirty(false);
      setStatus("Saved ✓  Commit and push to publish it.");
    } catch (err) {
      setStatus(`Save failed: ${err.message}`);
    }
  };

  const { hero, about, arsenal, projects, contact } = content;

  const moveItem = (list, keys, i, dir) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    set(keys, next);
  };

  const pickProjectImage = async (i, file) => {
    if (!file) return;
    setStatus("Uploading image…");
    try {
      set(["projects", i, "image"], await uploadImage(file));
      setStatus("Image uploaded. Remember to save.");
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`);
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-header glass-card">
        <div>
          <p className="section-label">Owner only · local</p>
          <h1 className="admin-title">Edit Portfolio</h1>
        </div>
        <div className="admin-actions">
          <span className="admin-status" role="status">{status}</span>
          <Link to="/" className="btn-outline admin-btn">View site</Link>
          <button type="button" className="btn-primary admin-btn" onClick={save} disabled={!dirty}>
            {dirty ? "Save changes" : "Saved"}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="glass-card admin-section">
        <h2>Home / Hero</h2>
        <Field label="Name" value={hero.name} onChange={(v) => set(["hero", "name"], v)} />
        <Field label="Tagline" value={hero.subtitle} onChange={(v) => set(["hero", "subtitle"], v)} />
        <Field label="Briefing title" value={hero.briefingTitle} onChange={(v) => set(["hero", "briefingTitle"], v)} />
        <Field label="Briefing text" textarea rows={5} value={hero.briefingText} onChange={(v) => set(["hero", "briefingText"], v)} />
      </section>

      {/* About */}
      <section className="glass-card admin-section">
        <h2>About Me</h2>
        <Field
          label="Paragraphs (leave a blank line between paragraphs)"
          textarea
          rows={7}
          value={about.paragraphs.join("\n\n")}
          onChange={(v) => set(["about", "paragraphs"], v.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean))}
        />

        <h3>Skills</h3>
        <ul className="admin-list">
          {about.skills.map((skill, i) => (
            <li key={i} className="admin-row">
              <input
                type="color"
                value={skill.color}
                onChange={(e) => set(["about", "skills", i, "color"], e.target.value)}
                aria-label="Skill colour"
              />
              <input
                value={skill.name}
                placeholder="Skill name"
                onChange={(e) => set(["about", "skills", i, "name"], e.target.value)}
              />
              <button type="button" onClick={() => moveItem(about.skills, ["about", "skills"], i, -1)} aria-label="Move up">↑</button>
              <button type="button" onClick={() => moveItem(about.skills, ["about", "skills"], i, 1)} aria-label="Move down">↓</button>
              <button type="button" className="admin-danger" onClick={() => set(["about", "skills"], about.skills.filter((_, j) => j !== i))}>Remove</button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="admin-add"
          onClick={() => set(["about", "skills"], [...about.skills, { name: "", color: "#7dafff" }])}
        >
          + Add skill
        </button>
      </section>

      {/* Technical Arsenal */}
      <section className="glass-card admin-section">
        <h2>Technical Arsenal</h2>
        <Field label="Section title" value={arsenal.title} onChange={(v) => set(["arsenal", "title"], v)} />
        <Field label="Speech bubble text (leave empty to hide)" value={arsenal.quote} onChange={(v) => set(["arsenal", "quote"], v)} />
        <div className="admin-row">
          <label className="admin-field admin-inline">
            <span>Sticker on the panel edge (works best with a flat bottom edge)</span>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                setStatus("Uploading image…");
                try {
                  set(["arsenal", "image"], await uploadImage(file));
                  setStatus("Image uploaded. Remember to save.");
                } catch (err) {
                  setStatus(`Upload failed: ${err.message}`);
                }
              }}
            />
          </label>
          {arsenal.image && (
            <>
              <img src={arsenal.image} alt="" className="admin-thumb admin-thumb-contain" />
              <button type="button" className="admin-danger" onClick={() => set(["arsenal", "image"], "")}>Remove sticker</button>
            </>
          )}
        </div>

        {arsenal.cards.map((card, i) => (
          <div key={i} className="admin-project admin-arsenal-card" style={{ "--tint": card.color }}>
            <div className="admin-project-head">
              <strong className="admin-arsenal-name">
                <ArsenalIcon icon={card.icon} className="admin-arsenal-icon" />
                {card.title || `Card ${i + 1}`}
              </strong>
              <div className="admin-row-buttons">
                <button type="button" onClick={() => moveItem(arsenal.cards, ["arsenal", "cards"], i, -1)} aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveItem(arsenal.cards, ["arsenal", "cards"], i, 1)} aria-label="Move down">↓</button>
                <button
                  type="button"
                  className="admin-danger"
                  onClick={() => window.confirm(`Delete "${card.title || "this card"}"?`) && set(["arsenal", "cards"], arsenal.cards.filter((_, j) => j !== i))}
                >
                  Delete
                </button>
              </div>
            </div>

            <div className="admin-row">
              <input
                type="color"
                value={card.color}
                onChange={(e) => set(["arsenal", "cards", i, "color"], e.target.value)}
                aria-label="Card colour"
              />
              <input value={card.title} placeholder="Card title, e.g. Languages" onChange={(e) => set(["arsenal", "cards", i, "title"], e.target.value)} />
            </div>

            <div className="admin-field">
              <span>Icon (pick one, or type an emoji)</span>
              <div className="admin-icon-picker">
                {Object.keys(ICONS).map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    aria-label={name}
                    aria-pressed={card.icon === name}
                    className={card.icon === name ? "selected" : ""}
                    onClick={() => set(["arsenal", "cards", i, "icon"], name)}
                  >
                    <ArsenalIcon icon={name} className="admin-arsenal-icon" />
                  </button>
                ))}
                <input
                  className="admin-emoji-input"
                  value={ICONS[card.icon] ? "" : card.icon}
                  placeholder="🚀"
                  aria-label="Emoji icon"
                  onChange={(e) => set(["arsenal", "cards", i, "icon"], e.target.value)}
                />
              </div>
            </div>

            <div className="admin-field">
              <span>Items</span>
              <ul className="admin-chips">
                {card.items.map((item, j) => (
                  <li key={j}>
                    {item}
                    <button
                      type="button"
                      aria-label={`Remove ${item}`}
                      onClick={() => set(["arsenal", "cards", i, "items"], card.items.filter((_, k) => k !== j))}
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              <AddItem placeholder="Add an item, e.g. Python" onAdd={(v) => set(["arsenal", "cards", i, "items"], [...card.items, v])} />
            </div>
          </div>
        ))}
        <button type="button" className="admin-add" onClick={() => set(["arsenal", "cards"], [...arsenal.cards, { ...EMPTY_ARSENAL_CARD, items: [] }])}>
          + Add card
        </button>
      </section>

      {/* Projects */}
      <section className="glass-card admin-section">
        <h2>Projects</h2>
        {projects.map((project, i) => (
          <div key={i} className="admin-project">
            <div className="admin-project-head">
              <strong>{project.title || `Project ${i + 1}`}</strong>
              <div className="admin-row-buttons">
                <button type="button" onClick={() => moveItem(projects, ["projects"], i, -1)} aria-label="Move up">↑</button>
                <button type="button" onClick={() => moveItem(projects, ["projects"], i, 1)} aria-label="Move down">↓</button>
                <button
                  type="button"
                  className="admin-danger"
                  onClick={() => window.confirm(`Delete "${project.title || "this project"}"?`) && set(["projects"], projects.filter((_, j) => j !== i))}
                >
                  Delete
                </button>
              </div>
            </div>
            <Field label="Title" value={project.title} onChange={(v) => set(["projects", i, "title"], v)} />
            <Field label="Description" textarea value={project.description} onChange={(v) => set(["projects", i, "description"], v)} />
            <Field
              label="Tags (comma separated)"
              value={project.tags.join(", ")}
              onChange={(v) => set(["projects", i, "tags"], v.split(",").map((t) => t.trimStart()))}
              onBlur={() => set(["projects", i, "tags"], project.tags.map((t) => t.trim()).filter(Boolean))}
            />
            <Field label="Link (leave empty to hide the button)" value={project.link} placeholder="https://…" onChange={(v) => set(["projects", i, "link"], v)} />
            <div className="admin-row">
              <label className="admin-field admin-inline">
                <span>Planet</span>
                <select value={project.planet} onChange={(e) => set(["projects", i, "planet"], e.target.value)}>
                  {PLANETS.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </label>
              <label className="admin-field admin-inline">
                <span>Picture (replaces the planet)</span>
                <input type="file" accept="image/*" onChange={(e) => pickProjectImage(i, e.target.files[0])} />
              </label>
              {project.image && (
                <>
                  <img src={project.image} alt="" className="admin-thumb" />
                  <button type="button" className="admin-danger" onClick={() => set(["projects", i, "image"], "")}>Remove picture</button>
                </>
              )}
            </div>
          </div>
        ))}
        <button type="button" className="admin-add" onClick={() => set(["projects"], [...projects, { ...EMPTY_PROJECT }])}>
          + Add project
        </button>
      </section>

      {/* Contact */}
      <section className="glass-card admin-section">
        <h2>Contact</h2>
        <Field label="Message" textarea rows={3} value={contact.text} onChange={(v) => set(["contact", "text"], v)} />
        <Field label="Email" type="email" value={contact.email} onChange={(v) => set(["contact", "email"], v)} />
        <Field label="GitHub URL" value={contact.github} onChange={(v) => set(["contact", "github"], v)} />
        <Field label="LinkedIn URL" value={contact.linkedin} onChange={(v) => set(["contact", "linkedin"], v)} />
      </section>
    </main>
  );
};

export default Admin;
