import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ease = [0.22, 1, 0.36, 1];

function Footer() {
  return (
    <motion.footer
      id="contact"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6, ease }}
      className="bg-[#F0F4FF] border-t border-gray-200 py-16 px-6 md:px-16 lg:px-32"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="text-gray-900 text-2xl font-extrabold">
              Vote<span className="text-[#144DEF]">x</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              A secure and transparent online voting platform built for
              organizations that value integrity and trust in every election.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest">
              Quick Links
            </h3>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <a href="#home" className="hover:text-[#144DEF] transition-colors">Home</a>
              <a href="#about" className="hover:text-[#144DEF] transition-colors">About</a>
              <a href="#how" className="hover:text-[#144DEF] transition-colors">How it Works</a>
            </div>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest">
              Account
            </h3>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <Link to="/sign-in" className="hover:text-[#144DEF] transition-colors">Sign In</Link>
              <Link to="/sign-up" className="hover:text-[#144DEF] transition-colors">Create Election</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-gray-900 font-bold text-sm uppercase tracking-widest">
              Contact
            </h3>
            <div className="flex flex-col gap-3 text-gray-500 text-sm">
              <a
                href="mailto:support@votex.online"
                className="hover:text-[#144DEF] transition-colors"
              >
                support@votex.online
              </a>
              <p>Available Mon – Fri, 9am – 5pm</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-gray-200 text-center text-gray-400 text-xs">
          © {new Date().getFullYear()} Votex Online. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
