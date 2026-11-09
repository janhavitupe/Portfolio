import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ParticlesBackground from "./components/ParticlesBackground";
import Home from "./components/Home";
import About from "./components/About";
import Arsenal from "./components/Arsenal";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import CardPage from "./components/CardPage";
import ProjectsPage from "./components/ProjectsPage";
import SaturnCursor from "./components/SaturnCursor";
import WarpTransition from "./components/WarpTransition";
import { CARDS } from "./cards";

// The owner-only editor at /admin. `import.meta.env.DEV` is false in `npm run build`,
// so the editor is stripped from the published site and visitors can only view.
const Admin = import.meta.env.DEV ? lazy(() => import("./components/Admin")) : null;

// Cards whose page is built; the rest show the "coming soon" CardPage
const CARD_PAGES = { "/mission-log": ProjectsPage };

function App() {
  return (
    // overflow-x-clip (not hidden) so position: sticky still works inside pages
    <div className="relative w-full min-h-screen overflow-x-clip text-white font-sans">
      {/* Background layers stay on screen across pages: galaxy glow, then the starfield */}
      <div className="galaxy" aria-hidden="true">
        <div className="galaxy-band" />
      </div>
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ParticlesBackground />
      </div>

      <SaturnCursor />
      <WarpTransition />

      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* One page per homepage card */}
        {CARDS.map((card) => {
          const Page = CARD_PAGES[card.path];
          return (
            <Route
              key={card.path}
              path={card.path}
              element={Page ? <Page /> : <CardPage card={card} />}
            />
          );
        })}
        {Admin && (
          <Route
            path="/admin"
            element={
              <Suspense fallback={null}>
                <Admin />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<HomePage />} />
      </Routes>

      <footer className="site-footer">
        © {new Date().getFullYear()} Janhavi Tupe · Made among the stars
      </footer>
    </div>
  );
}

// The homepage: the hero spans the full width; the other sections are centered
function HomePage() {
  return (
    <>
      <Home />
      <main className="flex flex-col items-center px-4 md:px-10 lg:px-20">
        <About />
        <Arsenal />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

export default App;
