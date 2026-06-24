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
      className="bg-[#040509] border-t border-white/10 py-16 px-6 md:px-16 lg:px-32"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="text-white text-2xl font-extrabold">
              Vote<span className="text-[#144DEF]">x</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Blockchain-secured online voting for organisations that demand
              integrity, transparency, and trust in every election.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#144DEF] font-semibold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Blockchain Anchored
            </div>
          </div>

          {/* Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white/40 font-bold text-xs uppercase tracking-widest">
              Navigation
            </h3>
            <div className="flex flex-col gap-3 text-white/50 text-sm">
              <a href="#home" className="hover:text-white transition-colors">Home</a>
              <a href="#journey" className="hover:text-white transition-colors">Voter Journey</a>
              <a href="#trust" className="hover:text-white transition-colors">Security</a>
              <a href="#how" className="hover:text-white transition-colors">For Admins</a>
            </div>
          </div>

          {/* Account */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white/40 font-bold text-xs uppercase tracking-widest">
              Account
            </h3>
            <div className="flex flex-col gap-3 text-white/50 text-sm">
              <Link to="/sign-in" className="hover:text-white transition-colors">Sign In to Vote</Link>
              <Link to="/sign-up" className="hover:text-white transition-colors">Create Election</Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-white/40 font-bold text-xs uppercase tracking-widest">
              Contact
            </h3>
            <div className="flex flex-col gap-3 text-white/50 text-sm">
              <a
                href="mailto:support@votex.online"
                className="hover:text-white transition-colors"
              >
                support@votex.online
              </a>
              <p>Mon – Fri, 9am – 5pm</p>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-white/10 text-center text-white/20 text-xs">
          © {new Date().getFullYear()} Votex Online. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
