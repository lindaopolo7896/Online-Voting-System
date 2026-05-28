import React from "react";
import VoteIcon from "../../../assets/icons/vote.png";
import VoterIcon from "../../../assets/icons/voter.png";
import TickIcon from "../../../assets/icons/tick.png";

const data = [
  {
    id: 1,
    name: "Total Elections",
    count: 3,
    icon: VoteIcon,
  },
  {
    id: 2,
    name: "Live Elections",
    count: 1,
    icon: TickIcon,
  },
  {
    id: 3,
    name: "Participated Elections",
    count: 2,
    icon: VoterIcon,
  },
];

function ResultAnalysis() {
  return (
    <div className="flex justify-center gap-10  mt-25">
      {data.map((analysis) => (
        <div
          className="flex mt-8  gap-6 shadow-lg p-3 rounded-xl w-1/2 items-center font-medium
           bg-[#050B14] border border-white/10"
          key={analysis.id}
        >
          <img src={analysis.icon} alt="" className="w-20" />
          <div>
            <p className="text-[#B7C6F2]">{analysis.name.toUpperCase()}</p>
            <p className="text-[#144DEF]  text-3xl">{analysis.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ResultAnalysis;
