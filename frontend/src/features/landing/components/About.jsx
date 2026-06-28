import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const stats = [
  {
    value: "1",
    unit: "Vote",
    label: "Per Participant",
    description:
      "Enforced through cryptographic token validation. No double-voting, no exceptions — ever.",
    borderColor: "border-blue-500/25",
  },
  {
    value: "100%",
    unit: "",
    label: "Blockchain Verified",
    description:
      "Every ballot is anchored immutably on-chain. Results can be independently audited at any time.",
    borderColor: "border-[#144DEF]/40",
  },
  {
    value: "∞",
    unit: "",
    label: "Permanent Audit Trail",
    description:
      "The complete vote record lives on the blockchain forever — transparent, verifiable, tamper-proof.",
    borderColor: "border-green-500/25",
  },
];

const tags = [
  "JWT Authentication",
  "OTP Verification",
  "Unique Voting Links",
  "Immutable Records",
  "Real-Time Results",
  "Role-Based Access",
];

const ease = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
};

function About() {
  return (
    <section id="trust" className="bg-[#040509] py-20 px-6 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <div className="flex items-center gap-3 text-[#144DEF] text-xs font-bold tracking-[0.2em] uppercase mb-5">
              <div className="h-px w-8 bg-[#144DEF]" />
              The Votex Guarantee
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug max-w-sm">
              Built on trust.<br />
              Anchored in cryptography.
            </h2>
          </div>
          <p className="text-white/45 text-sm max-w-sm leading-relaxed">
            Institutional confidence requires more than promises. Votex provides
            verifiable, mathematically guaranteed election integrity.
          </p>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={item}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className={`border ${stat.borderColor} rounded-2xl p-8 bg-white/3 flex flex-col gap-5`}
            >
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-extrabold text-white leading-none">{stat.value}</span>
                {stat.unit && (
                  <span className="text-2xl font-bold text-[#144DEF]">{stat.unit}</span>
                )}
              </div>
              <div>
                <p className="text-[#144DEF] font-bold text-xs tracking-[0.18em] uppercase mb-2">{stat.label}</p>
                <p className="text-white/45 text-sm leading-relaxed">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature tags */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, delay: 0.2, ease }}
          className="flex flex-wrap gap-3 mb-14"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-white/10 text-white/50 text-xs font-semibold px-4 py-2 rounded-full bg-white/4 tracking-wide"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3, ease }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-white/10 pt-10"
        >
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Ready to run an election with institutional-grade integrity?
          </p>
          <Link to="/sign-up">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="bg-[#144DEF] text-white px-8 py-3.5 rounded-full font-bold text-sm hover:bg-white hover:text-[#144DEF] transition-colors duration-300 shadow-[0_0_24px_rgba(20,77,239,0.35)]"
            >
              Create Your Election →
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
