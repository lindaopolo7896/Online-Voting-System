import { useQuery, useQueries } from "@tanstack/react-query";
import {
  getElections,
  getElectionParticipants,
  getElectionStatus,
  formatElectionDate,
} from "@/api/organisationApi";

/**
 * Loads all of the voter's elections and, per election, their participants, then
 * normalizes them into the shape the results UI expects (with voter/vote counts).
 */
export function useElectionResults() {
  const { data: rawElections = [], isLoading } = useQuery({
    queryKey: ["elections"],
    queryFn: () => getElections(),
  });

  // Fetch participants per election to show voter counts
  const participantQueries = useQueries({
    queries: rawElections.map((e) => ({
      queryKey: ["election-participants", e.id],
      queryFn: () => getElectionParticipants(e.id),
    })),
  });

  const elections = rawElections.map((e, i) => {
    const parts = participantQueries[i]?.data ?? [];
    return {
      id: e.id,
      title: e.name,
      organization: e.organisation?.name ?? "",
      date: formatElectionDate(e.date_time_occuring),
      totalVoters: parts.length,
      votesCast: parts.filter((p) => p.has_voted).length,
      status: getElectionStatus(e),
    };
  });

  return { elections, isLoading };
}
