import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BG from "../../assets/images/bg-landing.png";
import VoteIllustration from "../../assets/images/vote.png";
import { Link } from "react-router-dom";

// Premium ease — fast start, soft settle
const ease = [0.22, 1, 0.36, 1];

function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      id="home"
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease }}
            className="text-white text-2xl font-extrabold tracking-wide"
          >
            Vote<span className="text-[#144DEF]">x</span>
          </motion.div>

          {/* Desktop Nav */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease }}
            className="hidden md:flex items-center gap-8 bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-full text-white font-semibold"
          >
            <a href="#home" className="hover:text-[#144DEF] transition-colors duration-200">Home</a>
            <a href="#about" className="hover:text-[#144DEF] transition-colors duration-200">About</a>
            <a href="#how" className="hover:text-[#144DEF] transition-colors duration-200">How it Works</a>
            <a href="#contact" className="hover:text-[#144DEF] transition-colors duration-200">Contact</a>
            <Link to="/sign-in">
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="inline-block bg-[#144DEF] text-white px-5 py-2 rounded-full font-bold hover:bg-white hover:text-[#144DEF] transition-colors duration-300 cursor-pointer"
              >
                Sign In
              </motion.span>
            </Link>
          </motion.div>

          {/* Mobile hamburger */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </nav>

        {/* Mobile Menu — animated open/close */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden bg-black/85 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-6 py-8 text-white font-semibold text-lg"
            >
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">Home</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">About</a>
              <a href="#how" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">How it Works</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">Contact</a>
              <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <span className="bg-[#144DEF] text-white px-8 py-3 rounded-full font-bold inline-block">
                  Sign In
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero Content */}
        <div className="flex-1 flex items-center px-6 md:px-12 py-12">
          <div className="flex items-center w-full gap-8">
            {/* Text block */}
            <div className="flex flex-col gap-6 md:gap-8 text-white w-full md:w-3/5">
              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              >
                Run Secure and{" "}
                <span className="text-[#144DEF]">Transparent</span> Elections
                Online
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.32, ease }}
                className="text-base md:text-lg text-white/90 max-w-lg leading-relaxed"
              >
                Effortlessly create, manage, and monitor elections with a secure
                and transparent digital voting system built for reliability.
                Every step is verifiable, accurate, and designed to inspire trust.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.48, ease }}
              >
                <Link to="/sign-up">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="bg-[#144DEF] text-white py-4 px-10 text-lg font-bold rounded-full cursor-pointer hover:bg-white hover:text-[#144DEF] transition-colors duration-300 ease-in-out w-full sm:w-auto"
                  >
                    Create an Election
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Illustration — entry + continuous float */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
              className="hidden md:flex md:w-2/5 items-center justify-center"
            >
              <motion.img
                src={VoteIllustration}
                alt="Voting illustration"
                className="w-full max-w-sm"
                animate={{ y: [0, -14, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
