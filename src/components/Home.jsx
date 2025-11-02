import React from "react";

const Home = () => {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center items-center text-center min-h-screen w-full px-6"
    >
      {/* Intro Container */}
      <div className="intro-container">
        <div className="absolute inset-0 rounded-full animate-spin-slow bg-gradient-to-tr from-purple-500 via-pink-400 to-cyan-400 blur-md opacity-70"></div>
          <div className="profile-image">
          <img src="/janhavi.jpg" alt="Janhavi Tupe" className="w-40 h-40 rounded-full object-cover shadow-lg" />

        </div>
        <h1 className="intro-title">
          Hi, I'm <span className="highlight">Janhavi Tupe</span>
        </h1>
        <p className="intro-subtitle">
          Astrophysics & AI Enthusiast | Frontend Developer | Explorer of the Cosmos
        </p>

        <div className="intro-buttons">
          <a href="#projects" className="btn-primary">
            View Projects
          </a>
          <a href="#contact" className="btn-outline">
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
};

export default Home;
