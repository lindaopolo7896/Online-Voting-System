import React from "react";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import About from "../components/LandingPage/About";
import How from "../components/LandingPage/How";

function LandingPage() {
  return (
    <div className="w-full bg-[#0B0C10]">
      <Hero />
      <Features />
      <About />
      <How />
    </div>
  );
}

export default LandingPage;
