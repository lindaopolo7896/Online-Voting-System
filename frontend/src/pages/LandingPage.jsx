import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1];
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const ACCENT = "#144DEF";

/* ── Top bar ────────────────────────────────────────────────────────────── */
function TopBar() {
  return (
    <div className="hidden md:block border-b border-white/[0.05] bg-[#05060C]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-10 flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Blockchain network online
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            support@votex.online
          </span>
          <span className="flex items-center gap-2">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Mon–Fri, 9am–5pm
          </span>
        </div>
        <div className="flex items-center gap-4 text-white/40">
          {[
            "M22 12a10 10 0 10-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6v1.9H17l-.4 2.9h-2.1v7A10 10 0 0022 12z",
            "M23 5a8.5 8.5 0 01-2.4.7A4.2 4.2 0 0022.4 3a8.4 8.4 0 01-2.7 1A4.2 4.2 0 0012.5 7.8 11.9 11.9 0 014 3.4a4.2 4.2 0 001.3 5.6 4.2 4.2 0 01-1.9-.5v.1a4.2 4.2 0 003.4 4.1 4.2 4.2 0 01-1.9.1 4.2 4.2 0 003.9 2.9A8.4 8.4 0 012 17.5a11.9 11.9 0 006.4 1.9c7.7 0 11.9-6.4 11.9-11.9v-.5A8.5 8.5 0 0023 5z",
            "M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-6a6 6 0 016-6zM2 9h4v12H2zM4 6a2 2 0 100-4 2 2 0 000 4z",
          ].map((d, i) => (
            <a key={i} href="#" className="hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d={d} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#process" },
    { label: "Why Votex", href: "#ready" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#06070E]/90 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="text-white text-2xl font-extrabold tracking-wide select-none"
        >
          VOTE<span style={{ color: ACCENT }}>X</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9 text-sm font-semibold tracking-wide text-white/50 uppercase">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-white transition-colors duration-150"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
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
              className="inline-block text-sm font-bold text-white px-5 py-2.5 rounded-sm cursor-pointer transition-opacity"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 0 18px rgba(20,77,239,0.35)",
              }}
            >
              GET STARTED
            </motion.span>
          </Link>
        </div>

        <button
          className="lg:hidden text-white/60"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
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
            className="lg:hidden bg-[#06070E] border-t border-white/[0.06] overflow-hidden"
          >
            <div className="flex flex-col px-6 py-5 gap-4 text-white/55 text-sm font-semibold uppercase tracking-wide">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <div className="pt-3 border-t border-white/10 flex flex-col gap-3 normal-case">
                <Link
                  to="/sign-in"
                  onClick={() => setOpen(false)}
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setOpen(false)}
                  className="text-white rounded-sm px-5 py-2.5 font-bold text-center"
                  style={{ backgroundColor: ACCENT }}
                >
                  Get Started
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
    <section id="home" className="relative bg-[#06070E] overflow-hidden">
      {/* Background image + overlays */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1541872705-1f73c6400ec9?auto=format&fit=crop&w=2000&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[#06070E]/85" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />
      <div
        className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ backgroundColor: "rgba(20,77,239,0.18)" }}
      />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#06070E] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center min-h-[calc(100vh-6.5rem)] justify-center py-24">
        {/* Play button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="relative mb-10 group"
          aria-label="Watch how it works"
        >
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: "rgba(20,77,239,0.25)" }}
          />
          <span
            className="relative flex w-16 h-16 items-center justify-center rounded-full text-white"
            style={{
              backgroundColor: ACCENT,
              boxShadow: "0 0 30px rgba(20,77,239,0.5)",
            }}
          >
            <svg
              className="w-6 h-6 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: EASE }}
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-7"
          style={{
            borderColor: "rgba(20,77,239,0.3)",
            backgroundColor: "rgba(20,77,239,0.1)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: ACCENT }}
          />
          <span
            className="text-xs font-bold tracking-[0.18em] uppercase"
            style={{ color: ACCENT }}
          >
            Blockchain-Secured Voting
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18, ease: EASE }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight uppercase mb-6"
        >
          Run Elections
          <br />
          <span style={{ color: ACCENT }}>Nobody Can</span> Rig
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36, ease: EASE }}
          className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl mb-10"
        >
          One participant, one vote — every ballot anchored immutably on the
          blockchain. Verifiable by anyone, falsifiable by no one.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link to="/sign-up">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="text-white px-9 py-4 rounded-sm font-bold text-sm uppercase tracking-wide w-full sm:w-auto transition-colors"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 0 32px rgba(20,77,239,0.4)",
              }}
            >
              Create an Election
            </motion.button>
          </Link>
          <Link to="/sign-in">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="border border-white/25 text-white/85 px-9 py-4 rounded-sm font-bold text-sm uppercase tracking-wide hover:border-white hover:bg-white/5 transition-all duration-300 w-full sm:w-auto"
            >
              Sign In to Vote
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Features (numbered service cards) ──────────────────────────────────── */
const FEATURES = [
  {
    title: "Blockchain Anchored",
    desc: "Every vote is permanently recorded on-chain — no entry can be altered, deleted, or forged.",
  },
  {
    title: "One Vote, Enforced",
    desc: "Cryptographic token validation ensures each participant casts exactly one vote.",
  },
  {
    title: "OTP Identity Check",
    desc: "Voters verify their identity with one-time password authentication before any ballot.",
  },
  {
    title: "Real-Time Dashboard",
    desc: "Admins monitor live participation, vote counts, and turnout as the election unfolds.",
  },
  {
    title: "Secure Voting Links",
    desc: "Each voter gets a unique, signed, single-use link that expires once the ballot is cast.",
  },
  {
    title: "Immutable Results",
    desc: "Outcomes are computed transparently and published on-chain — unchangeable by anyone.",
  },
];

const FEATURE_ICONS = [
  "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1",
  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z",
  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
  "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
  "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01",
];

function Features() {
  return (
    <section
      id="features"
      className="bg-[#06070E] py-24 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left intro */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="lg:sticky lg:top-28 self-start"
          >
            <p
              className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
              style={{ color: ACCENT }}
            >
              ◆◆◆ Why Votex
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-5">
              Explore Our
              <br />
              Best Features
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              Every feature exists to remove trust assumptions from the process
              — replacing them with cryptographic guarantees that anyone can
              verify.
            </p>
            <Link to="/sign-up">
              <span
                className="inline-block text-white px-6 py-3 rounded-sm font-bold text-xs uppercase tracking-wide"
                style={{ backgroundColor: ACCENT }}
              >
                More Features
              </span>
            </Link>
          </motion.div>

          {/* Right card grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-lg p-7 flex flex-col gap-4 hover:border-white/20 transition-colors duration-200 overflow-hidden"
              >
                <span className="absolute top-5 right-6 text-4xl font-extrabold text-white/[0.06] group-hover:text-white/10 transition-colors select-none">
                  0{i + 1}
                </span>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(20,77,239,0.12)",
                    color: ACCENT,
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d={FEATURE_ICONS[i]}
                    />
                  </svg>
                </div>
                <h3 className="text-white font-bold text-base">{f.title}</h3>
                <p className="text-white/45 text-sm leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── Ready section (split + stat badge) ─────────────────────────────────── */
function Ready() {
  const points = [
    "Enrol thousands of voters in a single bulk upload.",
    "Build multi-position ballots in minutes, no code required.",
    "Watch turnout climb live, then publish results on-chain.",
  ];

  return (
    <section
      id="ready"
      className="bg-[#080A12] py-24 px-6 md:px-12 lg:px-20 border-y border-white/[0.05]"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        {/* Visual collage */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-40 rounded-xl bg-gradient-to-br from-[#144DEF]/30 to-[#144DEF]/5 border border-white/10" />
              <div className="h-28 rounded-xl bg-white/[0.04] border border-white/10" />
            </div>
            <div className="space-y-4 pt-8">
              <div className="h-28 rounded-xl bg-white/[0.04] border border-white/10" />
              <div className="h-40 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/10" />
            </div>
          </div>
          {/* Stat badge */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-36 rounded-2xl flex flex-col items-center justify-center text-center shadow-2xl"
            style={{
              backgroundColor: ACCENT,
              boxShadow: "0 20px 40px rgba(20,77,239,0.35)",
            }}
          >
            <span className="text-4xl font-extrabold text-white leading-none">
              1:1
            </span>
            <span className="text-[10px] text-white/80 tracking-[0.15em] uppercase mt-2 px-3">
              Vote Integrity Guaranteed
            </span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <p
            className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            ◆◆◆ Ready When You Are
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-5">
            Are You Ready To
            <br />
            Run Your <span style={{ color: ACCENT }}>Election?</span>
          </h2>
          <p className="text-white/45 text-sm leading-relaxed mb-8">
            From a campus student council to a national association, Votex
            scales with you — pairing an effortless admin experience with
            uncompromising cryptographic security.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {[
              {
                title: "For Voters",
                desc: "Verify, review, and cast in under 60 seconds.",
              },
              {
                title: "For Admins",
                desc: "One dashboard to build, monitor, and publish.",
              },
            ].map((c) => (
              <div key={c.title} className="flex gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: "rgba(20,77,239,0.12)",
                    color: ACCENT,
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{c.title}</h4>
                  <p className="text-white/40 text-xs mt-1 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <ul className="space-y-3 mb-9">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 text-white/55 text-sm"
              >
                <span
                  className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: ACCENT }}
                />
                {p}
              </li>
            ))}
          </ul>

          <Link to="/sign-up">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="text-white px-8 py-3.5 rounded-sm font-bold text-xs uppercase tracking-wide"
              style={{
                backgroundColor: ACCENT,
                boxShadow: "0 0 24px rgba(20,77,239,0.3)",
              }}
            >
              Get Started Free
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Trusted by (logo grid) ─────────────────────────────────────────────── */
const ORGS = [
  "Student Council",
  "Co-operative",
  "Trade Union",
  "Alumni Board",
  "Sports Club",
  "Shareholders",
];

function Trusted() {
  return (
    <section className="bg-[#06070E] py-24 px-6 md:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <p
            className="text-xs font-bold tracking-[0.22em] uppercase mb-4"
            style={{ color: ACCENT }}
          >
            ◆◆◆ Trusted Everywhere
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-5">
            Organisations
            <br />
            Trust Our Platform
          </h2>
          <p className="text-white/45 text-sm leading-relaxed">
            From small committees to large membership bodies, teams choose Votex
            when the outcome has to be beyond dispute.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden"
        >
          {ORGS.map((org) => (
            <motion.div
              key={org}
              variants={fadeUp}
              className="bg-[#06070E] aspect-[4/3] flex flex-col items-center justify-center gap-2 px-4 text-center hover:bg-white/[0.03] transition-colors duration-200"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: "rgba(20,77,239,0.12)",
                  color: ACCENT,
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <span className="text-white/55 text-xs font-semibold tracking-wide uppercase">
                {org}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Process (filter-style steps) ───────────────────────────────────────── */
const STEPS = [
  {
    num: "01",
    label: "Register",
    title: "Get Enrolled",
    desc: "Your admin adds you as a participant and a secure, unique voting link is sent to your email.",
  },
  {
    num: "02",
    label: "Authenticate",
    title: "Verify Identity",
    desc: "Open your link and complete OTP verification — the system confirms you are the authorised voter.",
  },
  {
    num: "03",
    label: "Cast Vote",
    title: "Submit Ballot",
    desc: "Review candidates per position and cast your encrypted vote in under sixty seconds.",
  },
  {
    num: "04",
    label: "Verify",
    title: "On the Blockchain",
    desc: "Your vote hash is anchored on-chain and results are published transparently when polls close.",
  },
];

function Process() {
  return (
    <section
      id="process"
      className="bg-[#080A12] py-24 px-6 md:px-12 lg:px-20 border-t border-white/[0.05]"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center mb-4"
        >
          <p
            className="text-xs font-bold tracking-[0.22em] uppercase mb-3"
            style={{ color: ACCENT }}
          >
            ◆◆◆ How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white">
            Four Steps To A <span style={{ color: ACCENT }}>Verified Vote</span>
          </h2>
        </motion.div>

        {/* Filter-style tabs (decorative) */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 mt-8">
          {STEPS.map((s, i) => (
            <span
              key={s.label}
              className="text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-sm"
              style={
                i === 0
                  ? { backgroundColor: ACCENT, color: "#fff" }
                  : {
                      backgroundColor: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.5)",
                    }
              }
            >
              {s.label}
            </span>
          ))}
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] border border-white/[0.07] rounded-lg p-7 flex flex-col gap-4 hover:border-white/20 transition-colors duration-200"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full text-white text-xs font-extrabold flex items-center justify-center shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  {step.num}
                </div>
                <span
                  className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: ACCENT }}
                >
                  {step.label}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── CTA strip ──────────────────────────────────────────────────────────── */
function CtaStrip() {
  return (
    <section className="bg-[#06070E] px-6 md:px-12 lg:px-20 py-20">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="max-w-5xl mx-auto relative rounded-3xl overflow-hidden border border-white/10 p-12 md:p-16 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(20,77,239,0.18), rgba(20,77,239,0.03))",
        }}
      >
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ backgroundColor: "rgba(20,77,239,0.25)" }}
        />
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-5">
            Your Next Election
            <br />
            Deserves Real Trust
          </h2>
          <p className="text-white/55 text-sm md:text-base max-w-xl mx-auto mb-9">
            Set up your organisation, build a ballot, and run a tamper-proof
            election today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/sign-up">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="text-white px-9 py-4 rounded-sm font-bold text-sm uppercase tracking-wide"
                style={{
                  backgroundColor: ACCENT,
                  boxShadow: "0 0 32px rgba(20,77,239,0.4)",
                }}
              >
                Create an Election
              </motion.button>
            </Link>
            <Link to="/sign-in">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="border border-white/25 text-white px-9 py-4 rounded-sm font-bold text-sm uppercase tracking-wide hover:border-white hover:bg-white/5 transition-all duration-300"
              >
                Sign In to Vote
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ── Footer ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#05060C] border-t border-white/[0.06] py-14 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-10">
          <div className="max-w-xs">
            <p className="text-white text-2xl font-extrabold mb-3">
              VOTE<span style={{ color: ACCENT }}>X</span>
            </p>
            <p className="text-white/35 text-sm leading-relaxed mb-4">
              Blockchain-secured voting for organisations that demand absolute
              integrity and transparency in every election.
            </p>
            <div
              className="flex items-center gap-2 text-xs font-semibold"
              style={{ color: ACCENT }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Blockchain Anchored
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                Pages
              </p>
              <div className="flex flex-col gap-2 text-white/50 text-sm">
                <a
                  href="#features"
                  className="hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#process"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
                <a href="#ready" className="hover:text-white transition-colors">
                  Why Votex
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                Account
              </p>
              <div className="flex flex-col gap-2 text-white/50 text-sm">
                <Link
                  to="/sign-in"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/sign-up"
                  className="hover:text-white transition-colors"
                >
                  Create Election
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-white/30 text-xs font-bold uppercase tracking-widest">
                Contact
              </p>
              <div className="flex flex-col gap-2 text-white/50 text-sm">
                <a
                  href="mailto:support@votex.online"
                  className="hover:text-white transition-colors"
                >
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
      className="w-full bg-[#06070E]"
    >
      <TopBar />
      <Navbar />
      <Hero />
      <Features />
      <Ready />
      <Trusted />
      <Process />
      <CtaStrip />
      <Footer />
    </motion.div>
  );
}

export default LandingPage;
