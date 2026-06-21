import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AboutImg from "../../assets/images/about.png";

const ease = [0.22, 1, 0.36, 1];

function About() {
  return (
    <section id="about" className="bg-white py-20 px-6 md:px-16 lg:px-32">
      <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto">
        {/* Image — slides in from the left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease }}
          className="w-full md:w-1/2 flex justify-center"
        >
          <img src={AboutImg} alt="About Votex" className="w-full max-w-md" />
        </motion.div>

        {/* Text — slides in from the right */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease, delay: 0.15 }}
          className="w-full md:w-1/2 flex flex-col gap-6"
        >
          <div className="flex items-center gap-2 text-[#144DEF] text-sm font-extrabold tracking-widest uppercase">
            About
            <div className="h-0.5 w-10 bg-[#144DEF]" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-snug">
            Secure Voting Starts with Transparency
          </h2>

          <p className="text-gray-600 text-base md:text-lg leading-relaxed">
            Our platform empowers organizations to conduct elections with
            confidence by combining secure authentication, controlled voter
            access, and verifiable results. Every stage of the voting process is
            designed to ensure integrity, prevent manipulation, and provide full
            transparency from start to finish.
          </p>

          <Link to="/sign-up">
            <motion.button
              whileHover={{ scale: 1.04, backgroundColor: "#144DEF", color: "#ffffff" }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.18 }}
              className="border-2 border-[#144DEF] py-3 px-8 text-base font-bold rounded-full text-[#144DEF] cursor-pointer"
            >
              Get Started
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default About;
