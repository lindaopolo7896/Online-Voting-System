import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BG from "../../assets/images/bg-landing.png";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div
      id="home"
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="absolute inset-0 bg-black/72" />

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
            <a href="#journey" className="hover:text-[#144DEF] transition-colors duration-200">How It Works</a>
            <a href="#trust" className="hover:text-[#144DEF] transition-colors duration-200">Security</a>
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="md:hidden bg-black/90 backdrop-blur-md border-t border-white/10 flex flex-col items-center gap-6 py-8 text-white font-semibold text-lg"
            >
              <a href="#home" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">Home</a>
              <a href="#journey" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">How It Works</a>
              <a href="#trust" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">Security</a>
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#144DEF] transition-colors">Contact</a>
              <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                <span className="bg-[#144DEF] text-white px-8 py-3 rounded-full font-bold inline-block">
                  Sign In
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero content */}
        <div className="flex-1 flex items-center px-6 md:px-12 py-12">
          <div className="max-w-3xl">
            {/* Eyebrow label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease }}
              className="flex items-center gap-3 mb-7"
            >
              <div className="h-px w-10 bg-[#144DEF]" />
              <span className="text-[#144DEF] text-xs font-bold tracking-[0.2em] uppercase">
                Blockchain-Secured Voting
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 44 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.3, ease }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] text-white mb-7"
            >
              Democracy,<br />
              <span className="text-[#144DEF]">Anchored</span><br />
              on the Chain.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.48, ease }}
              className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mb-10"
            >
              One participant. One vote. Zero compromise. Votex delivers
              institutional-grade elections with cryptographic proof of integrity
              — every ballot immutably recorded on the blockchain.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6, ease }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link to="/sign-in">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="bg-[#144DEF] text-white py-4 px-9 text-base font-bold rounded-full hover:bg-white hover:text-[#144DEF] transition-colors duration-300 w-full sm:w-auto shadow-[0_0_30px_rgba(20,77,239,0.4)]"
                >
                  Sign In to Vote →
                </motion.button>
              </Link>
              <Link to="/sign-up">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="border border-white/40 text-white py-4 px-9 text-base font-bold rounded-full hover:border-white hover:bg-white/10 transition-all duration-300 w-full sm:w-auto"
                >
                  Create an Election
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.85, ease }}
          className="border-t border-white/10 px-6 md:px-12 py-5"
        >
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-white/45 text-xs font-semibold tracking-[0.15em] uppercase">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
              100% Tamper-Proof
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#144DEF] inline-block" />
              One Vote Per Participant
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-300 inline-block" />
              Blockchain Anchored
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Hero;
