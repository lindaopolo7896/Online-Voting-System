import { useState } from "react";
import CandidateCard from "@/features/voting/components/CandidateCard";
import CandidateProfileModal from "@/features/voting/components/CandidateProfileModal";

function CandidateSection({
  title,
  candidates,
  selectedCandidate,
  setSelectedCandidate,
}) {
  const [selectedProfile, setSelectedProfile] = useState(null);

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <h1 className="text-3xl font-bold text-center text-white">{title}</h1>

        <div className="flex justify-center flex-wrap gap-10">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              selectedCandidate={selectedCandidate}
              setSelectedCandidate={setSelectedCandidate}
              onViewInfo={() => setSelectedProfile(candidate)}
            />
          ))}
        </div>
      </div>

      {selectedProfile && (
        <CandidateProfileModal
          candidate={selectedProfile}
          onClose={() => setSelectedProfile(null)}
          onSelect={(candidate) => {
            setSelectedCandidate(candidate);
            setSelectedProfile(null);
          }}
        />
      )}
    </>
  );
}

export default CandidateSection;
