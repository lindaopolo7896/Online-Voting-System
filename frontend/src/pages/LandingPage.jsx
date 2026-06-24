import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/* ── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-[#06070E]/90 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="text-white text-xl font-extrabold tracking-wide select-none">
          Vote<span className="text-[#144DEF]">x</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
          <a href="#features" className="hover:text-white transition-colors duration-150">Features</a>
          <a href="#journey"  className="hover:text-white transition-colors duration-150">How It Works</a>
          <a href="#getstarted" className="hover:text-white transition-colors duration-150">Get Started</a>
          <a href="#contact"  className="hover:text-white transition-colors duration-150">Contact</a>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/sign-in"
            className="text-sm font-semibold text-white/55 hover:text-white transition-colors px-3 py-2"
          >
            Sign In
          </Link>
          <Link to="/sign-up">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="inline-block text-sm font-bold bg-[#144DEF] text-white px-5 py-2 rounded-full cursor-pointer hover:opacity-90 transition-opacity shadow-[0_0_18px_rgba(20,77,239,0.35)]"
            >
              Create Election
            </motion.span>
          </Link>
        </div>

        <button
          className="md:hidden text-white/60"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#06070E] border-t border-white/[0.06] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-5 gap-4 text-white/55 text-sm font-medium">
              <a href="#features"   onClick={() => setOpen(false)} className="hover:text-white transition-colors">Features</a>
              <a href="#journey"    onClick={() => setOpen(false)} className="hover:text-white transition-colors">How It Works</a>
              <a href="#getstarted" onClick={() => setOpen(false)} className="hover:text-white transition-colors">Get Started</a>
              <a href="#contact"    onClick={() => setOpen(false)} className="hover:text-white transition-colors">Contact</a>
              <div className="pt-3 border-t border-white/10 flex flex-col gap-3">
                <Link to="/sign-in" onClick={() => setOpen(false)} className="hover:text-white transition-colors">Sign In</Link>
                <Link
                  to="/sign-up"
                  onClick={() => setOpen(false)}
                  className="bg-[#144DEF] text-white rounded-full px-5 py-2.5 font-bold text-center"
                >
                  Create Election
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ── Hero ───────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="min-h-screen bg-[#06070E] relative flex flex-col overflow-hidden">
      {/* Dot-grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      {/* Blue radial glow */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#144DEF]/10 blur-[140px] pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#06070E] to-transparent pointer-events-none" />

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-16 max-w-4xl mx-auto w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          className="inline-flex items-center gap-2 border border-[#144DEF]/30 bg-[#144DEF]/10 rounded-full px-4 py-1.5 mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#144DEF] animate-pulse" />
          <span className="text-[#144DEF] text-xs font-bold tracking-[0.18em] uppercase">
            Blockchain-Secured Voting
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.02] tracking-tight mb-7"
        >
          Elections That<br />
          <span className="text-[#144DEF]">Can't Be</span><br />
          Tampered With.
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.38, ease: EASE }}
          className="text-white/50 text-base md:text-lg leading-relaxed max-w-md mb-10"
        >
          One participant. One vote. Every ballot anchored immutably on the
          blockchain — verifiable by anyone, falsifiable by no one.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.52, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-4 mb-16"
        >
          <Link to="/sign-in">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="bg-[#144DEF] text-white px-9 py-4 rounded-full font-bold text-base hover:bg-white hover:text-[#144DEF] transition-colors duration-300 w-full sm:w-auto shadow-[0_0_32px_rgba(20,77,239,0.4)]"
            >
              Sign In to Vote →
            </motion.button>
          </Link>
          <Link to="/sign-up">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="border border-white/20 text-white/80 px-9 py-4 rounded-full font-bold text-base hover:border-white hover:text-white hover:bg-white/5 transition-all duration-300 w-full sm:w-auto"
            >
              Create an Election
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="border-t border-white/10 pt-8 flex justify-center gap-10"
        >
          {[
            { value: "1:1", label: "Vote Ratio" },
            { value: "100%", label: "On-Chain" },
            { value: "0",   label: "Tampering" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-white leading-none">{s.value}</p>
              <p className="text-[10px] text-white/35 tracking-[0.18em] uppercase mt-1.5">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.5 }}
        className="relative z-10 flex justify-center pb-8"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="text-white/25"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Features ───────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    title: "Blockchain Anchored",
    desc: "Every vote is permanently recorded on-chain. No entry can be altered, deleted, or forged — ever.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: "One Vote, Enforced",
    desc: "Cryptographic token validation ensures each participant casts exactly one vote — no exceptions.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: "OTP Identity Check",
    desc: "Voters verify their identity with one-time password authentication before accessing any ballot.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    title: "Real-Time Dashboard",
    desc: "Admins monitor live participation rates, vote counts, and turnout as the election unfolds.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: "Secure Voting Links",
    desc: "Each voter receives a unique, signed link that grants single-use ballot access and expires after use.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: "Immutable Results",
    desc: "Outcomes are computed transparently and published on-chain. No central authority can change them.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
];

function Features() {
  return (
    <section id="features" className="bg-white py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-[#144DEF] text-xs font-bold tracking-[0.2em] uppercase mb-3">Why Votex</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug max-w-xs">
              Built for integrity,<br />not convenience.
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Every feature exists to remove trust assumptions from the process —
            replacing them with cryptographic guarantees.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-100 border border-gray-100 rounded-2xl overflow-hidden"
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              className="bg-white p-8 flex flex-col gap-4 hover:bg-gray-50 transition-colors duration-200 group"
            >
              <div className="w-11 h-11 rounded-xl bg-[#144DEF]/10 border border-[#144DEF]/10 flex items-center justify-center text-[#144DEF]">
                {f.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-bold text-base mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
              <span className="text-2xl font-extrabold text-gray-100 group-hover:text-gray-200 transition-colors select-none">
                0{i + 1}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Voter Journey ──────────────────────────────────────────────────────── */
const JOURNEY = [
  {
    num: "01",
    label: "Register",
    title: "Get Enrolled",
    desc: "Your organisation admin adds you as a participant and a secure, unique voting link is sent to your email.",
  },
  {
    num: "02",
    label: "Authenticate",
    title: "Verify Identity",
    desc: "Open your link and complete OTP verification. The system confirms you are the correct, authorised voter.",
  },
  {
    num: "03",
    label: "Cast Vote",
    title: "Submit Your Ballot",
    desc: "Review candidate profiles per position and cast your encrypted vote. The entire process takes under 60 seconds.",
  },
  {
    num: "04",
    label: "Verify",
    title: "On the Blockchain",
    desc: "Your vote hash is anchored on-chain. When the election closes, results are published transparently and permanently.",
  },
];

function Journey() {
  return (
    <section id="journey" className="bg-[#F4F6FF] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <p className="text-[#144DEF] text-xs font-bold tracking-[0.2em] uppercase mb-3">Voter Journey</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug max-w-xs">
              Four steps to a verified vote
            </h2>
          </div>
          <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
            Designed for simplicity — no technical knowledge required.
            Every safeguard runs silently in the background.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {JOURNEY.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#144DEF] text-white text-xs font-extrabold flex items-center justify-center shrink-0">
                  {step.num}
                </div>
                <span className="text-[#144DEF] text-xs font-bold tracking-widest uppercase">{step.label}</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Dual Audience CTA ──────────────────────────────────────────────────── */
function GetStarted() {
  return (
    <section id="getstarted" className="bg-[#06070E] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-12"
        >
          <p className="text-[#144DEF] text-xs font-bold tracking-[0.2em] uppercase mb-3">Get Started</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Who are you here for?</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, delay: 0.1, ease: EASE }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {/* Voter */}
          <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02] flex flex-col gap-6 hover:border-[#144DEF]/40 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-[#144DEF]/15 border border-[#144DEF]/20 flex items-center justify-center text-[#144DEF]">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-3">I'm a Voter</h3>
              <p className="text-white/45 text-sm leading-relaxed">
                Your organisation admin enrolled you. Sign in to verify your identity,
                access your ballot, and cast your vote — securely and in under a minute.
              </p>
            </div>
            <Link to="/sign-in">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="w-full bg-[#144DEF] text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-[0_0_22px_rgba(20,77,239,0.3)]"
              >
                Sign In to Vote
              </motion.button>
            </Link>
          </div>

          {/* Admin */}
          <div className="border border-white/10 rounded-3xl p-10 bg-white/[0.02] flex flex-col gap-6 hover:border-white/25 transition-colors duration-300">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white/60">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-2xl mb-3">I'm an Administrator</h3>
              <p className="text-white/45 text-sm leading-relaxed">
                Register your organisation, build your election, enrol voters in bulk,
                and monitor live results from one secure, intuitive dashboard.
              </p>
            </div>
            <Link to="/sign-up">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="w-full border border-white/20 text-white py-3.5 rounded-xl font-bold text-sm hover:border-white hover:bg-white/5 transition-all duration-300"
              >
                Create Your Election
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer id="contact" className="bg-[#06070E] border-t border-white/[0.06] py-14 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <p className="text-white text-xl font-extrabold mb-3">
              Vote<span className="text-[#144DEF]">x</span>
            </p>
            <p className="text-white/35 text-sm leading-relaxed mb-4">
              Blockchain-secured voting for organisations that demand
              absolute integrity and transparency in every election.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#144DEF] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Blockchain Anchored
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Pages</p>
              <div className="flex flex-col gap-2 text-white/50 text-sm">
                <a href="#features"   className="hover:text-white transition-colors">Features</a>
                <a href="#journey"    className="hover:text-white transition-colors">How It Works</a>
                <a href="#getstarted" className="hover:text-white transition-colors">Get Started</a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Account</p>
              <div className="flex flex-col gap-2 text-white/50 text-sm">
                <Link to="/sign-in" className="hover:text-white transition-colors">Sign In</Link>
                <Link to="/sign-up" className="hover:text-white transition-colors">Create Election</Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Contact</p>
              <div className="flex flex-col gap-2 text-white/50 text-sm">
                <a href="mailto:support@votex.online" className="hover:text-white transition-colors">
                  support@votex.online
                </a>
                <p>Mon–Fri, 9am–5pm</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] text-white/20 text-xs text-center">
          © {new Date().getFullYear()} Votex Online. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */
function LandingPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full"
    >
      <Navbar />
      <Hero />
      <Features />
      <Journey />
      <GetStarted />
      <Footer />
    </motion.div>
  );
}

export default LandingPage;
