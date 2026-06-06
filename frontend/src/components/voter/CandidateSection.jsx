import CandidateCard from "./CandidateCard";

function CandidateSection({
  title,
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <h1 className="text-3xl font-bold text-center text-white">{title}</h1>

      <div className="flex  justify-center flex-wrap gap-10">
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
