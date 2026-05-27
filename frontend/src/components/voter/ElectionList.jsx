import React from "react";
import { GoDotFill } from "react-icons/go";

function ElectionList({ elections }) {
  return (
    <div>
      <div>
        <div>
          <h1>Available Elections</h1>
          <p>Select an election to view detailed results</p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {elections.map((election) => (
          <div
            key={election.id}
            className="flex border border-white/10 w-full rounded-xl "
          >
            <div>
              <img
                src={`https://ui-avatars.com/api/?name=${election.organization}`}
                alt={election.organization}
                className="w-10 h-10 rounded-full"
              />
              <p>{election.organization}</p>
            </div>
            <div>
              <h1>{election.title}</h1>
              <div>
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
        ))}
      </div>
    </div>
  );
}

export default ElectionList;
