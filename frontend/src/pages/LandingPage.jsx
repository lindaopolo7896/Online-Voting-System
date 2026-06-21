import React from "react";
import { motion } from "framer-motion";
import Hero from "../components/LandingPage/Hero";
import Features from "../components/LandingPage/Features";
import About from "../components/LandingPage/About";
import How from "../components/LandingPage/How";
import Footer from "../components/LandingPage/Footer";

function LandingPage() {
  return (
    <motion.div
      className="w-full bg-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <Hero />
      <Features />
      <About />
      <How />
      <Footer />
    </motion.div>
  );
}

export default LandingPage;
