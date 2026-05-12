import React from "react";

function VotingProcess({ registeredVoters, votesCast }) {
  const turnoutRate = ((votesCast / registeredVoters) * 100).toFixed(0);
  return (
    <div className="flex flex-col gap-4 font-bold w-full">
      <h1>VOTING PROCESS</h1>
      <div className="w-full p-3 rounded-xl bg-[#111827] flex flex-col gap-2">
        <p className="text-[#144DEF] text-2xl ">{registeredVoters}</p>
        <h1 className="text-white">REGISTERED VOTERS</h1>
      </div>
      <div className="flex  justify-between items-center">
        <div className="flex flex-col gap-2 shadow-lg p-3 rounded-xl">
          <p className="text-[#111827] text-2xl w-30">{votesCast}</p>
          <h1 className="text-black/47">VOTES CAST</h1>
        </div>
        <div className="flex flex-col gap-2 shadow-lg p-3 rounded-xl w-40">
          <p className="text-[#111827] text-2xl">{turnoutRate}%</p>
          <h1 className="text-black/47">TURNOUT RATE</h1>
        </div>
      </div>
      <div className="rounded-xl  shadow-[0px_4px_10px_0px_rgba(0,0,0,0.25)]  outline outline-offset-[-1px] outline-indigo-50/40  p-3 flex flex-col gap-2">
        <div className=" flex justify-between  ">
          <h1>VOTER TURNOUT</h1>
          <p className="text-black/47 font-medium text-sm">
            {votesCast}/{registeredVoters}
          </p>
        </div>
        <div className="w-full h-4 rounded-full bg-[#E9EAE1]">
          <div
            className="h-4 bg-[#111827] rounded-full transition-all duration-500"
            style={{ width: `${turnoutRate}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <p className="text-black/47">0%</p>
          <p>{turnoutRate}% voted</p>
          <p className="text-black/47">100%</p>
        </div>
      </div>
    </div>
  );
}

export default VotingProcess;
