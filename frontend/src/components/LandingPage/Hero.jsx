import React from "react";
import BG from "../../assets/bg-landing.png";
import { Link } from "react-router-dom";
import VoteIllustration from "../../assets/vote.png";

function Hero() {
  return (
    <div
      className="w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${BG})` }}
    >
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="backdrop-blur-xl bg-white/10 border border-white/30 rounded-2xl shadow-xl p-8 mx-2 lg:mx-0 lg:w-5/6 h-7/8 text-white">
          <div className="flex items-center justify-between">
            <h1>LOGO</h1>
            <nav className="bg-[#FAFBF5] text-[#111827] px-4 py-4 hidden  md:flex items-center justify-center gap-6 lg:gap-12 font-bold text-lg lg:w-1/2 rounded-full">
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
                About
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
          <div className="flex">
            <div className="py-10 md:py-20 flex flex-col items-start justify-start gap-8 lg:gap-10 md:w-2/3 ">
              <p className="text-3xl md:text-4xl lg:text-6xl font-bold w-full leading-tight">
                Run Secure and{" "}
                <span className="text-[#144DEF]">Transparent</span> Elections
                Online
              </p>
              <p className="md:text-lg md:w-7/8 lg:w-1/2  text-white/95">
                Effortlessly create, manage, and monitor elections with a secure
                and transparent digital voting system built for reliability.
                From voter registration to final results, every step is
                verifiable, accurate, and designed to inspire trust.
              </p>
              <Link to="/sign-up" className="w-full">
                <button className="bg-[#144DEF] text-white py-3 md:py-6 w-full md:w-1/2 lg:w-1/3 text-xl font-bold rounded-full cursor-pointer hover:bg-white  hover:text-[#144DEF] transition-all duration-300 ease-in-out">
                  Create an Election
                </button>
              </Link>
            </div>
            <div className="w-1/4 py-10 flex items-center justify-center">
              <img
                src={VoteIllustration}
                alt=""
                className="w-full hidden md:flex"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
