import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CandidatesTable from "../../features/candidates/CandidatesTable";
import CandidateStats from "../../features/candidates/CandidateStats";
import {
  getElections,
  getElectionCandidates,
  getElectionStatus,
} from "../../api/organisationApi";

function OrganisationCandidatesPage() {
  const { data: elections = [] } = useQuery({
    queryKey: ["elections"],
    queryFn: getElections,
  });

  const defaultElection =
    elections.find((e) => getElectionStatus(e) === "live") ??
    elections.find((e) => getElectionStatus(e) === "upcoming") ??
    elections[0];

  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const activeId = selectedElectionId ?? defaultElection?.id ?? null;

  const { data: candidates = [], isLoading } = useQuery({
    queryKey: ["candidates", activeId],
    queryFn: () => getElectionCandidates(activeId),
    enabled: !!activeId,
  });

  return (
    <div className="p-4 sm:p-5 flex-col gap-5 flex">
      <CandidateStats candidates={candidates} />
      <CandidatesTable
        candidates={candidates}
        isLoading={isLoading}
        elections={elections}
        selectedElectionId={activeId}
        onElectionChange={setSelectedElectionId}
      />
    </div>
  );
}

export default OrganisationCandidatesPage;
