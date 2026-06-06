import React from "react";
import { GoDotFill } from "react-icons/go";
import { RxCaretRight } from "react-icons/rx";
import { Link } from "react-router-dom";

function ElectionList({ elections }) {
  return (
    <div className="py-10">
      <div>
        <div className="mb-6">
          <h1 className="text-white font-bold text-2xl">Available Elections</h1>
          <p className="text-[#B7C6F2]">
            Select an election to view detailed results
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center md:justify-start flex-col gap-8">
        {elections.map((election) => (
          <Link
            to={`/voter/results/${election.id}`}
            key={election.id}
            className="flex items-center justify-center md:justify-between border bg-[#050B14] border-white/10 w-full rounded-xl p-4 gap-5 hover:shadow-xl hover:shadow-[#144DEF]/12 cursor-pointer hover:scale-102 transition-all duration-300 ease-in-out"
          >
            {/* left side */}
            <div className="flex flex-col md:flex-row gap-5 ">
              <div className="flex flex-col items-center justify-center gap-2 md:w-50">
                <img
                  src={`https://ui-avatars.com/api/?name=${election.organization}&background=144DEF&color=fff`}
                  alt={election.organization}
                  className="w-20 h-20 rounded-full"
                />
                <p className="text-white">{election.organization}</p>
              </div>
              <div className="hidden md:flex h-30 w-0.5 bg-white/10 mr-10"></div>

              <div className="flex flex-col gap-5">
                <h1 className="text-white text-center md:text-left font-bold">
                  {election.title}
                </h1>
                <div className="text-[#B7C6F2] flex items-center gap-4">
                  <p>{election.date}</p>
                  <GoDotFill />
                  <p>{election.totalVoters} voters</p>
                  <GoDotFill />
                  <p>{election.totalVoters} votes cast</p>
                </div>
                <div
                  className="
              text-[#144DEF]
              font-bold
              border border-[#144DEF]
              flex py-1 px-4
              rounded-full
              w-fit
              bg-white/10
              backdrop-blur-sm
              "
                >
                  <p className="flex items-center justify-center gap-2 text-sm">
                    {election.status === "live" && (
                      <GoDotFill className="animate-pulse" />
                    )}

                    {election.status === "live"
                      ? "LIVE NOW"
                      : election.status === "completed"
                        ? "COMPLETED"
                        : "UPCOMING"}
                  </p>
                </div>
              </div>
            </div>
            {/* right side  */}
            <div>
              <RxCaretRight className="hidden md:flex text-5xl mr-20 text-[#144DEF]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ElectionList;
