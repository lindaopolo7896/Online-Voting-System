import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create Your Election",
    description:
      "Register your organization and set up your election in minutes. Define positions, add candidates, and configure the voting window.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Invite Your Voters",
    description:
      "Upload your voter list and the system sends each voter a unique, secure voting link — no passwords required.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Voters Cast Their Votes",
    description:
      "Voters access the ballot through their unique link, verify their identity with an OTP, and securely cast their vote in seconds.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "View Real-Time Results",
    description:
      "Monitor live vote counts and participation rates on your dashboard. Results are available the moment the election closes.",
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
];

const ease = [0.22, 1, 0.36, 1];

// Stagger container — triggers children one after another
const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

function How() {
  return (
    <section id="how" className="bg-white py-20 px-6 md:px-16 lg:px-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-2 text-[#144DEF] text-sm font-bold tracking-widest uppercase mb-4">
            How It Works
            <div className="h-0.5 w-10 bg-[#144DEF]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Run Your Election in{" "}
            <span className="text-[#144DEF]">4 Simple Steps</span>
          </h2>
          <p className="text-gray-500 mt-4 text-base md:text-lg max-w-xl mx-auto">
            From setup to results, the entire election process is seamless and secure.
          </p>
        </motion.div>

        {/* Cards — stagger on scroll reveal */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step) => (
            <motion.div
              key={step.number}
              variants={cardVariant}
              whileHover={{ y: -6, boxShadow: "0 12px 28px rgba(20, 77, 239, 0.10)" }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-4 shadow-sm cursor-default"
            >
              <div className="flex items-center justify-between">
                <div className="text-[#144DEF] bg-[#144DEF]/10 rounded-xl p-3">
                  {step.icon}
                </div>
                <span className="text-4xl font-extrabold text-gray-100">{step.number}</span>
              </div>
              <h3 className="text-gray-900 font-bold text-lg">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default How;
