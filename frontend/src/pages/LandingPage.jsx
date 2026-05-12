import React from "react";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import About from "../components/LandingPage/About";

function LandingPage() {
  return (
    <div className="bg-[#111827]">
      <Hero />
      <Features />
      <About />
    </div>
  );
}

export default LandingPage;
