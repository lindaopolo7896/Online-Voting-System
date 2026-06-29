import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    label: "Register",
    title: "Get Added to an Election",
    description:
      "Your organisation administrator enrolls you as a participant. You receive a secure, unique voting link — no password required.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
  },
  {
    number: "02",
    label: "Authenticate",
    title: "Verify Your Identity",
    description:
      "Click your unique link and complete OTP verification. The system confirms you are the intended voter before granting ballot access.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    number: "03",
    label: "Cast Vote",
    title: "Select Your Candidates",
    description:
      "Browse candidates per position, read their profiles, and cast your ballot. Your vote is encrypted and submitted in seconds.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
        />
      </svg>
    ),
  },
  {
    number: "04",
    label: "Verify",
    title: "Your Vote on the Blockchain",
    description:
      "Every submitted vote is anchored immutably on-chain. Results are verifiable, auditable, and tamper-proof — permanently.",
    icon: (
      <svg
        className="w-7 h-7"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    ),
  },
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

function Features() {
  return (
    <section id="journey" className="bg-[#F0F4FF] py-20 px-6 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="mb-14"
        >
          <div className="flex items-center gap-3 text-[#144DEF] text-xs font-bold tracking-[0.2em] uppercase mb-5">
            <div className="h-px w-8 bg-[#144DEF]" />
            Voter Journey
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug max-w-sm">
              From registration to{" "}
              <span className="text-[#144DEF]">verified vote</span>
            </h2>
            <p className="text-gray-500 text-base max-w-sm leading-relaxed">
              Four steps. Full transparency. Cryptographic proof at every stage
              of the process.
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden border border-gray-200 shadow-sm"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={item}
              className="bg-white p-8 flex flex-col gap-5 group hover:bg-[#F0F4FF] transition-colors duration-300 cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#144DEF]/10 border border-[#144DEF]/15 flex items-center justify-center text-[#144DEF]">
                  {step.icon}
                </div>
                <span className="text-5xl font-extrabold text-gray-100 group-hover:text-[#144DEF]/12 transition-colors duration-300 select-none">
                  {step.number}
                </span>
              </div>

              <span className="inline-flex w-fit text-[#144DEF] text-xs font-bold tracking-widest uppercase bg-[#144DEF]/10 px-3 py-1 rounded-full">
                {step.label}
              </span>

              <div className="flex flex-col gap-2">
                <h3 className="text-gray-900 font-bold text-lg leading-snug">
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default Features;
