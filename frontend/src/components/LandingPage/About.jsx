import React from "react";
import { Link } from "react-router-dom";

function About() {
  return (
    <div>
      <div className="flex flex-col gap-3">
        <div>
          <h1>ABOUT</h1>
          <div></div>
        </div>
        <h1>Secure Voting Starts with Transparency</h1>
        <p>
          Our platform empowers organizations to conduct elections with
          confidence by combining secure authentication, controlled voter
          access, and verifiable results. Every stage of the voting process is
          designed to ensure integrity, prevent manipulation, and provide full
          transparency from start to finish.
        </p>
        <button>
          <Link to="sign-up">Get Started</Link>
        </button>
      </div>
    </div>
  );
}

export default About;
