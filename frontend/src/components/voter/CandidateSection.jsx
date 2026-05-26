import CandidateCard from "./CandidateCard";

function CandidateSection({
  title,
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center text-[#0F1117]">{title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 justify-center sm:gap-10 lg:gap-110">
        {candidates.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            selectedCandidate={selectedCandidate}
            setSelectedCandidate={setSelectedCandidate}
          />
        ))}
      </div>
    </div>
  );
}

export default CandidateSection;
