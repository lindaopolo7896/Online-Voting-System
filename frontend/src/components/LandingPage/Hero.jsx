import React from "react";
import BG from "../../assets/bg-landing.jpg";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl shadow-xl p-8 w-5/6 h-7/8 text-white">
          <div className="flex items-center justify-between">
            <h1>LOGO</h1>
            <nav className="bg-[#FAFBF5] text-[#111827] py-4  flex items-center justify-center gap-12 font-bold text-lg w-1/2 rounded-full">
              <a
                href="#home"
                className="hover:text-[#144DEF] transition-all duration-300 ease-in-out"
              >
                Home
              </a>
              <a
                href="#features"
                className="hover:text-[#144DEF] transition-all duration-300 ease-in-out"
              >
                Features
              </a>
              <a
                href="#how"
                className="hover:text-[#144DEF] transition-all duration-300 ease-in-out"
              >
                How it Works
              </a>
              <a
                href="#contact"
                className="hover:text-[#144DEF] transition-all duration-300 ease-in-out"
              >
                Contact
              </a>

              <button className="bg-[#144DEF] text-white p-2 w-1/4 rounded-full cursor-pointer hover:bg-transparent hover:border-2 hover:border-[#144DEF] hover:text-[#144DEF] transition-all duration-300 ease-in-out">
                <Link to="/sign-in">Sign In</Link>
              </button>
            </nav>
          </div>
          <div className="py-20 flex flex-col items-start justify-start gap-10">
            <p className=" text-6xl font-bold w-3/4 leading-tight">
              Run Secure and <span className="text-[#144DEF]">Transparent</span>{" "}
              Elections Online
            </p>
            <p className="text-lg w-1/2  text-white/95">
              Effortlessly create, manage, and monitor elections with a secure
              and transparent digital voting system built for reliability. From
              voter registration to final results, every step is verifiable,
              accurate, and designed to inspire trust.
            </p>
            <button className="bg-[#144DEF] text-white py-6 w-1/3 text-xl font-bold rounded-full cursor-pointer hover:bg-white  hover:text-[#144DEF] transition-all duration-300 ease-in-out">
              <Link to="/sign-up">Create an Election</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
