import { Link } from "react-router-dom";
import AboutImg from "../../assets/about.png";

function About() {
  return (
    <div className="bg-white  flex items-center justify-center px-40 py-20">
      <div className="flex items-center   w-full">
        <div className="w-1/2 flex justify-center ">
          <img src={AboutImg} alt="" className="w-full max-w-md" />
        </div>

        <div className="w-1/2 flex flex-col gap-8">
          <h1 className="font-extrabold text-[#144DEF] text-2xl flex items-end gap-2">
            ABOUT
            <div className="py-0.5 w-12 bg-[#144DEF] mb-1.5"></div>
          </h1>

          <h1 className="text-4xl font-bold max-w-[420px]">
            Secure Voting Starts with Transparency
          </h1>

          <p className="text-lg text-black/62 w-full">
            Our platform empowers organizations to conduct elections with
            confidence by combining secure authentication, controlled voter
            access, and verifiable results. Every stage of the voting process is
            designed to ensure integrity, prevent manipulation, and provide full
            transparency from start to finish.
          </p>

          <Link to="sign-up" className="w-full">
            <button className="border-2 border-[#144DEF] py-2 px-8 text-lg font-bold rounded-full text-[#144DEF] hover:bg-[#144DEF] hover:text-white cursor-pointer transition-all duration-300 ease-in-out active:bg-[#144DEF]/90">
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default About;
