import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getElections,
  getElectionParticipants,
  getElectionCandidates,
  getElectionStatus,
} from "@/api/organisationApi";

function buildCategories(candidates) {
  const posMap = {};
  for (const c of candidates) {
    const posId = c.position?.id ?? 0;
    if (!posMap[posId]) {
      posMap[posId] = {
        id: posId,
        position: c.position?.name ?? "Unknown Position",
        results: [],
      };
    }
    const user = c.membership?.user ?? c.user;
    posMap[posId].results.push({
      candidate:
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Unknown",
      // null = backend hasn't provided a tally yet; a number = real live count.
      votes: typeof c.vote_count === "number" ? c.vote_count : null,
      percentage: 0,
      image: user?.profile_picture ?? "",
    });
  }

  return Object.values(posMap).map((pos) => {
    const tallied = pos.results.some((r) => r.votes != null);
    const total = pos.results.reduce((s, r) => s + (r.votes ?? 0), 0);
    return {
      ...pos,
      tallied,
      results: pos.results
        .map((r) => ({
          ...r,
          percentage: total > 0 ? Math.round(((r.votes ?? 0) / total) * 100) : 0,
        }))
        .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)),
    };
  });
}

function normalizeElection(election, participants, candidates) {
  return {
    id: election.id,
    title: election.name,
    organization: election.organisation?.name ?? "",
    status: getElectionStatus(election),
    startTime: election.date_time_occuring,
    endTime: election.date_time_ending,
    totalVoters: participants.length,
    votesCast: participants.filter((p) => p.has_voted).length,
    categories: buildCategories(candidates),
  };
}

/**
 * Data + selection state for the voter dashboard. Fetches the voter's elections,
 * tracks the selected one, and returns a lightweight list (for the dropdown) plus
 * the fully-normalized selected election (with participants + candidates).
 */
export function useVoterDashboard() {
  const { data: rawElections = [], isLoading: electionsLoading } = useQuery({
    queryKey: ["elections"],
    queryFn: () => getElections(),
  });

  // Sort: live → completed → upcoming
  const sortedRaw = useMemo(() => {
    const order = { live: 0, completed: 1, upcoming: 2 };
    return [...rawElections].sort(
      (a, b) =>
        (order[getElectionStatus(a)] ?? 3) - (order[getElectionStatus(b)] ?? 3),
    );
  }, [rawElections]);

  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    if (sortedRaw.length > 0 && selectedId === null) {
      setSelectedId(sortedRaw[0].id);
    }
  }, [sortedRaw, selectedId]);

  const selectedRaw =
    sortedRaw.find((e) => e.id === selectedId) ?? sortedRaw[0] ?? null;

  const { data: participants = [] } = useQuery({
    queryKey: ["election-participants", selectedRaw?.id],
    queryFn: () => getElectionParticipants(selectedRaw.id),
    enabled: !!selectedRaw,
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ["election-candidates-voter", selectedRaw?.id],
    queryFn: () => getElectionCandidates(selectedRaw.id),
    enabled: !!selectedRaw,
  });

  // Minimal normalized list for the dropdown (no participant/candidate data needed)
  const electionList = useMemo(
    () =>
      sortedRaw.map((e) => ({
        id: e.id,
        title: e.name,
        organization: e.organisation?.name ?? "",
        status: getElectionStatus(e),
        startTime: e.date_time_occuring,
        endTime: e.date_time_ending,
        totalVoters: 0,
        votesCast: 0,
        categories: [],
      })),
    [sortedRaw],
  );

  // Fully normalized selected election (includes participants + candidates)
  const selectedElection = useMemo(() => {
    if (!selectedRaw) return null;
    return normalizeElection(selectedRaw, participants, candidates);
  }, [selectedRaw, participants, candidates]);

  return { electionList, selectedElection, electionsLoading, setSelectedId };
}
