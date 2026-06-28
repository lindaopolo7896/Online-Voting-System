import React, { useEffect, useMemo, useState } from "react";
import Card from "@/components/ui/Card";

function VotingProcess({ election }) {
  // TURNOUT %

  const turnoutRate =
    election.totalVoters > 0
      ? ((election.votesCast / election.totalVoters) * 100).toFixed(0)
      : "0";

  // GET LEADING CANDIDATES

  const leaders = useMemo(() => {
    if (!election.categories) return [];

    return election.categories.map((category) => {
      const leader = [...category.results].sort(
        (a, b) => b.percentage - a.percentage,
      )[0];

      return {
        ...leader,
        position: category.position,
      };
    });
  }, [election]);

  // SLIDESHOW STATE

  const [currentLeader, setCurrentLeader] = useState(0);

  // AUTO SLIDE EVERY 5s

  useEffect(() => {
    if (leaders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentLeader((prev) => (prev === leaders.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [leaders]);

  const leader = leaders[currentLeader];

  return (
    <div className="flex flex-col gap-4  w-full">
      {/* TITLE */}

      <h1 className="text-text font-bold">VOTING PROCESS</h1>

      {/* REGISTERED VOTERS */}

      <Card
        className="
        w-full
        p-3
        rounded-xl
        bg-[#050B14]
        border border-white/10
        flex flex-col gap-2
        font-medium
        "
      >
        <p className="text-primary text-2xl">{election.totalVoters}</p>

        <h1 className="text-text">REGISTERED VOTERS</h1>
      </Card>

      {/* STATS */}

      <div className="flex justify-evenly gap-5 items-center w-full">
        {/* VOTES CAST */}

        <Card
          className="
          flex flex-col gap-2
          border border-white/10
          w-1/2
          p-3
          rounded-xl
          font-medium
          "
        >
          <p className="text-primary text-2xl">{election.votesCast}</p>

          <h1 className="text-text">VOTES CAST</h1>
        </Card>

        {/* TURNOUT RATE */}

        <Card
          className="
          flex flex-col gap-2
          border border-white/10
          w-1/2
          p-3
          rounded-xl
          font-medium
          "
        >
          <p className="text-primary text-2xl">{turnoutRate}%</p>

          <h1 className="text-text">TURNOUT RATE</h1>
        </Card>
      </div>

      {/* TURNOUT BAR */}

      <Card
        className="
        rounded-xl
        p-3
        flex flex-col gap-2
        border-none
        "
      >
        <div className="flex justify-between">
          <h1 className="text-text font-medium">VOTER TURNOUT</h1>

          <p className="text-muted font-medium text-sm">
            {election.votesCast}/{election.totalVoters}
          </p>
        </div>

        <div className="w-full h-4 rounded-full bg-[#E9EAE1]">
          <div
            className="
            h-4
            bg-primary
            rounded-full
            transition-all
            duration-500
            "
            style={{
              width: `${turnoutRate}%`,
            }}
          ></div>
        </div>

        <div className="flex justify-between text-sm font-medium">
          <p className="text-muted">0%</p>

          <p className="text-text">{turnoutRate}% voted</p>

          <p className="text-muted">100%</p>
        </div>
      </Card>

      {/* LEADING CANDIDATE */}

      {leader && (
        <div
          className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#050B14] bg-cover bg-center min-h-[280px] transition-all duration-700"
          style={leader.image ? { backgroundImage: `url(${leader.image})` } : {}}
        >
          <div className="absolute inset-0 bg-[#050B14]/82 backdrop-blur-[2px]" />

          <div className="relative z-10 p-4 flex flex-col gap-5 h-full">
            <div className="flex items-center justify-between">
              <h1 className="text-white">LEADING CANDIDATE</h1>
              <p className="text-[#144DEF] text-sm bg-[#144DEF]/10 border border-[#144DEF]/20 px-3 py-1 rounded-full">
                {leader.position}
              </p>
            </div>

            <div className="flex items-center gap-4 mt-8">
              {leader.image ? (
                <img
                  src={leader.image}
                  alt={leader.candidate}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/10 shadow-lg shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                  <span className="text-primary text-xl font-bold">
                    {leader.candidate.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <div className="flex flex-col min-w-0">
                <h1 className="text-white text-xl font-bold truncate">
                  {leader.candidate}
                </h1>
                <div className="flex gap-3 text-sm mt-1">
                  <p className="text-white/70">{leader.votes} votes</p>
                  <p className="text-[#144DEF] font-semibold">
                    {leader.percentage}%
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto flex flex-col gap-2">
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#144DEF] rounded-full transition-all duration-700"
                  style={{ width: `${leader.percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/50">
                <p>Current Lead</p>
                <p>{leader.percentage}%</p>
              </div>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              {leaders.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentLeader === index ? "w-6 bg-[#144DEF]" : "w-2 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VotingProcess;
