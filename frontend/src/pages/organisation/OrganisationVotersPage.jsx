import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VotersTable from "../../features/voters/VotersTable";
import MemberStats from "../../features/voters/MemberStats";
import useDashboard from "../../hooks/useDashboard";
import {
  getElections,
  getElectionParticipants,
  getElectionStatus,
  getMemberships,
} from "../../api/organisationApi";

function OrganisationVotersPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Voters");
    setSubtitle("Manage voters enrolled in an election");
  }, [setPageTitle, setSubtitle]);

  const { data: elections = [] } = useQuery({
    queryKey: ["elections"],
    queryFn: getElections,
  });

  const defaultElection =
    elections.find((e) => getElectionStatus(e) === "live") ??
    elections.find((e) => getElectionStatus(e) === "upcoming") ??
    elections[0];

  // Optional ?election_id= preselects the election (e.g. from the Elections table menu).
  const [searchParams] = useSearchParams();
  const urlElectionId = Number(searchParams.get("election_id")) || null;

  const [selectedElectionId, setSelectedElectionId] = useState(null);
  const activeId =
    selectedElectionId ?? urlElectionId ?? defaultElection?.id ?? null;

  const { data: participants = [], isLoading } = useQuery({
    queryKey: ["participants", activeId],
    queryFn: () => getElectionParticipants(activeId),
    enabled: !!activeId,
  });

  const { data: members = [] } = useQuery({
    queryKey: ["memberships"],
    queryFn: getMemberships,
  });

  return (
    <div className="p-4 sm:p-5 flex flex-col gap-5">
      <MemberStats members={members} />
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
