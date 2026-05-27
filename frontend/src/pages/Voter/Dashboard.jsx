import { useMemo, useState } from "react";

import ElectionCard from "../../components/voter/ElectionCard";
import LiveResults from "../../components/voter/LiveResults";
import TopBar from "../../components/voter/TopBar";
import VotingProcess from "../../components/voter/VotingProcess";

import { elections } from "../../mock/data";

function Dashboard() {
  // SORT ELECTIONS

  const sortedElections = useMemo(() => {
    return [...elections].sort((a, b) => {
      // upcoming last
      if (a.status === "upcoming" && b.status !== "upcoming") {
        return 1;
      }

      if (a.status !== "upcoming" && b.status === "upcoming") {
        return -1;
      }

      // newest first
      return new Date(b.date) - new Date(a.date);
    });
  }, []);

  // SELECTED ELECTION

  const [selectedElection, setSelectedElection] = useState(sortedElections[0]);

  return (
    <div className="w-full">
      <TopBar page="Dashboard" />

      <div
        className="
        flex flex-col
        md:flex-row
        mt-20
        lg:mx-10
        gap-6
        "
      >
        {/* LEFT SIDE */}

        <div
          className="
          p-6
          md:w-[70%]
          flex flex-col gap-10
          "
        >
          <ElectionCard
            elections={sortedElections}
            selectedElection={selectedElection}
            setSelectedElection={setSelectedElection}
          />

          <LiveResults election={selectedElection} />
        </div>

        {/* RIGHT SIDE */}

        <div
          className="
          lg:w-1/3
          py-8 px-4
          min-h-screen
          "
        >
          <VotingProcess election={selectedElection} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
