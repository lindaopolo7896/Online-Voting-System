import { useMemo, useEffect, useState } from "react";

function ElectionDropdown({ elections, onElectionChange }) {
  const sortedElections = useMemo(() => {
    return [...elections].sort((a, b) => {
      if (a.status === "upcoming" && b.status !== "upcoming") return 1;

      if (a.status !== "upcoming" && b.status === "upcoming") return -1;

      return new Date(b.date) - new Date(a.date);
    });
  }, [elections]);

  const [selectedElection, setSelectedElection] = useState(sortedElections[0]);

  useEffect(() => {
    onElectionChange(selectedElection);
  }, []);

  const handleChange = (e) => {
    const election = sortedElections.find(
      (item) => item.id === Number(e.target.value),
    );

    setSelectedElection(election);
    onElectionChange(election);
  };

  return (
    <select
      value={selectedElection?.id}
      onChange={handleChange}
      className="
      bg-[#0F1117]
      border border-white/10
      text-white
      rounded-lg
      px-4
      py-2
      outline-none
      cursor-pointer
      focus:border-[#144DEF]
      "
    >
      {sortedElections.map((election) => (
        <option key={election.id} value={election.id} className="bg-[#0F1117]">
          {election.title}

          {" • "}

          {election.status === "live"
            ? "🔵 Live"
            : election.status === "completed"
              ? "✓ Completed"
              : "⏳ Upcoming"}
        </option>
      ))}
    </select>
  );
}

export default ElectionDropdown;
