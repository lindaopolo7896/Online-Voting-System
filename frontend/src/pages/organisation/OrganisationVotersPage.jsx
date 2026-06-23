import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import VotersTable from "../../features/voters/VotersTable";
import VoterStats from "../../features/voters/VoterStats";
import {
  getElections,
  getElectionParticipants,
  getElectionStatus,
} from "../../api/organisationApi";

function OrganisationVotersPage() {
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

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ["participants", activeId],
    queryFn: () => getElectionParticipants(activeId),
    enabled: !!activeId,
  });

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-5">
      <VoterStats participants={participants} />
      <VotersTable
        participants={participants}
        isLoading={isLoading}
        elections={elections}
        selectedElectionId={activeId}
        onElectionChange={setSelectedElectionId}
      />
    </div>
  );
}

export default OrganisationVotersPage;
