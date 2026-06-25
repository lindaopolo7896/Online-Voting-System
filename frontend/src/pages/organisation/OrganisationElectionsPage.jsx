import { useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import useDashboard from "../../hooks/useDashboard";
import ElectionStats from "../../features/elections/ElectionStats";
import ElectionsTable from "../../features/elections/ElectionsTable";
import {
  getElections,
  getElectionParticipants,
  getElectionCandidates,
} from "../../api/organisationApi";

function OrganisationElectionsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Elections");
    setSubtitle("Manage and monitor all your elections");
  }, [setPageTitle, setSubtitle]);

  const {
    data: elections = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["elections"],
    queryFn: getElections,
  });

  const participantQueries = useQueries({
    queries: elections.map((e) => ({
      queryKey: ["participants", e.id],
      queryFn: () => getElectionParticipants(e.id),
    })),
  });

  const candidateQueries = useQueries({
    queries: elections.map((e) => ({
      queryKey: ["candidates", e.id],
      queryFn: () => getElectionCandidates(e.id),
    })),
  });

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">
      <ElectionStats elections={elections} isLoading={isLoading} />
      <ElectionsTable
        elections={elections}
        participantQueries={participantQueries}
        candidateQueries={candidateQueries}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  );
}

export default OrganisationElectionsPage;
