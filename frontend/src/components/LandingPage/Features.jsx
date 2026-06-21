import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import SecureIcon from "../../assets/icons/SecureIcon.png";
import VoteIcon from "../../assets/icons/VoteIcon.png";
import TrackingIcon from "../../assets/icons/TrackingIcon.png";
import ResultIcon from "../../assets/icons/ResultIcon.png";

const features = [
  {
    id: 1,
    icon: SecureIcon,
    name: "Secure Authentication",
    description:
      "Only authorized voters can access the system using unique links and OTP verification.",
  },
  {
    id: 2,
    icon: VoteIcon,
    name: "One Person, One Vote",
    description:
      "Each voter can cast a single vote, enforced through secure token validation.",
  },
  {
    id: 3,
    icon: TrackingIcon,
    name: "Real-Time Monitoring",
    description:
      "Track voter participation and election progress as it happens across the entire election.",
  },
  {
    id: 4,
    icon: ResultIcon,
    name: "Verifiable Results",
    description:
      "Votes are securely recorded and can be audited for transparency and accuracy.",
  },
];

const SLIDE_MS = 500;
const n = features.length;
const cloned = [...features, ...features, ...features];

const ease = [0.22, 1, 0.36, 1];

function Features() {
  const [idx, setIdx] = useState(n);
  const [animated, setAnimated] = useState(true);
  const [paused, setPaused] = useState(false);
  const [cardW, setCardW] = useState(0);
  const wrapRef = useRef(null);

  const measure = useCallback(() => {
    if (!wrapRef.current) return;
    const w = window.innerWidth;
    const cols = w < 640 ? 1 : w < 1024 ? 2 : 3;
    setCardW(wrapRef.current.offsetWidth / cols);
  }, []);

  useLayoutEffect(() => { measure(); }, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (idx >= n * 2) {
      const t = setTimeout(() => {
        setAnimated(false);
        setIdx((i) => i - n);
      }, SLIDE_MS);
      return () => clearTimeout(t);
    }
    if (idx < n) {
      const t = setTimeout(() => {
        setAnimated(false);
        setIdx((i) => i + n);
      }, SLIDE_MS);
      return () => clearTimeout(t);
    }
  }, [idx]);

  useEffect(() => {
    if (!animated) {
      const t = setTimeout(() => setAnimated(true), 50);
      return () => clearTimeout(t);
    }
  }, [animated]);

  const next = () => { setAnimated(true); setIdx((i) => i + 1); };
  const prev = () => { setAnimated(true); setIdx((i) => i - 1); };

  useEffect(() => {
    if (paused || !cardW) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [paused, cardW]);

  const dotIdx = ((idx - n) % n + n) % n;

  return (
    <section id="features" className="bg-[#F0F4FF] py-16">
      {/* Heading — scroll reveal */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease }}
        className="text-center mb-12 px-6"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Why Choose <span className="text-[#144DEF]">Votex</span>?
        </h2>
        <p className="text-gray-500 mt-3 text-base md:text-lg max-w-xl mx-auto">
          Built for organizations that demand trust, security, and simplicity in every election.
        </p>
      </motion.div>

      {/* Carousel — CSS transitions kept intact; only the container fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
        className="relative px-6 md:px-16 lg:px-32"
      >
        <div
          ref={wrapRef}
          className="overflow-hidden mx-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="flex"
            style={{
              transform: cardW ? `translateX(${-idx * cardW}px)` : "none",
              transition: animated ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : "none",
            }}
          >
            {cloned.map((f, i) => (
              <div key={i} style={{ width: cardW, flexShrink: 0 }} className="px-3">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center gap-4 shadow-sm h-full">
                  <img src={f.icon} alt={f.name} className="w-16 h-16 object-contain" />
                  <h3 className="text-[#144DEF] text-lg font-bold text-center">{f.name}</h3>
                  <p className="text-center text-gray-500 text-sm leading-relaxed">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev arrow */}
        <motion.button
          onClick={prev}
          aria-label="Previous"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          transition={{ duration: 0.15 }}
          className="absolute left-6 md:left-16 lg:left-32 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:text-[#144DEF] hover:border-[#144DEF] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>

        {/* Next arrow */}
        <motion.button
          onClick={next}
          aria-label="Next"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.93 }}
          transition={{ duration: 0.15 }}
          className="absolute right-6 md:right-16 lg:right-32 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow-sm text-gray-600 hover:text-[#144DEF] hover:border-[#144DEF] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </motion.button>
      </motion.div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-8">
        {features.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => { setAnimated(true); setIdx(n + i); }}
            aria-label={`Go to slide ${i + 1}`}
            whileHover={{ scale: 1.3 }}
            transition={{ duration: 0.15 }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === dotIdx ? "bg-[#144DEF] w-6" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;
