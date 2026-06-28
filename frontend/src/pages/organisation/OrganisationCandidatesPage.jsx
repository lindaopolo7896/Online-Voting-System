import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CandidatesTable from "@/features/candidates/components/CandidatesTable";
import CandidateStats from "@/features/candidates/components/CandidateStats";
import RegisterCandidateModal from "@/features/candidates/components/RegisterCandidateModal";
import useDashboard from "@/hooks/useDashboard";
import {
  getElections,
  getElectionCandidates,
  getElectionParticipants,
  getPositions,
  getElectionStatus,
} from "@/api/organisationApi";

function OrganisationCandidatesPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Candidates");
    setSubtitle("Manage candidates across all elections");
  }, [setPageTitle, setSubtitle]);

  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: elections = [] } = useQuery({
    queryKey: ["elections"],
    queryFn: getElections,
  });

  const defaultElection =
    elections.find((e) => getElectionStatus(e) === "live") ??
    elections.find((e) => getElectionStatus(e) === "upcoming") ??
    elections[0];

  const activeId = selectedElectionId ?? defaultElection?.id ?? null;

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates", activeId],
    queryFn: () => getElectionCandidates(activeId),
    enabled: !!activeId,
  });

  // Fetched so the modal can show who can still be registered
  const { data: participants = [] } = useQuery({
    queryKey: ["election-participants", activeId],
    queryFn: () => getElectionParticipants(activeId),
    enabled: !!activeId,
  });

  const { data: positions = [] } = useQuery({
    queryKey: ["positions", activeId],
    queryFn: () => getPositions(activeId),
    enabled: !!activeId,
  });

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-5">
      <CandidateStats candidates={candidates} />

      <CandidatesTable
        candidates={candidates}
        isLoading={isLoading}
        elections={elections}
        selectedElectionId={activeId}
        onElectionChange={setSelectedElectionId}
        onRegisterClick={activeId ? () => setIsModalOpen(true) : undefined}
      />

      {isModalOpen && (
        <RegisterCandidateModal
          electionId={activeId}
          participants={participants}
          positions={positions}
          registeredCandidates={candidates}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default OrganisationCandidatesPage;
