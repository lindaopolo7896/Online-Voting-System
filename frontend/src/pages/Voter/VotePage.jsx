import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";

import CandidateSection from "../../components/voter/CandidateSection";
import CountDownCard from "../../components/common/CountDownCard";
import useCountdown from "../../hooks/useCountdown";
import {
  getElectionCandidates,
  getPositions,
  getElectionStatus,
  castVote,
} from "../../api/organisationApi";

// Normalize a real API candidate to the shape CandidateCard/ProfileModal expect
function normalizeCandidate(c) {
  const user = c.membership?.user ?? c.user ?? {};
  return {
    id: c.id,
    name: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Unknown",
    position: c.position?.name ?? "",
    positionId: c.position?.id,
    slogan: c.membership?.bio ?? user.bio ?? "",
    bio: c.membership?.bio ?? user.bio ?? "",
    image: user.profile_picture ?? user.avatar ?? "",
  };
}

function VotePage() {
  const navigate = useNavigate();
  const [votes, setVotes] = useState({});  // { [positionId]: normalizedCandidate }
  const [submitting, setSubmitting] = useState(false);

  // Recover active voting link stored by VotingAccess
  const activeLink = useMemo(() => {
    try {
      const raw = localStorage.getItem("activeVotingLink");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const electionId = activeLink?.election?.id ?? null;
  const participantId = activeLink?.participant?.id ?? null;
  const rawElection = activeLink?.election ?? null;

  const electionForCountdown = rawElection
    ? {
        status: getElectionStatus(rawElection),
        startTime: rawElection.date_time_occuring,
        endTime: rawElection.date_time_ending,
      }
    : null;

  const countdown = useCountdown(electionForCountdown);

  const { data: rawCandidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ["election-candidates-vote", electionId],
    queryFn: () => getElectionCandidates(electionId),
    enabled: !!electionId,
  });

  const { data: rawPositions = [], isLoading: positionsLoading } = useQuery({
    queryKey: ["positions-vote", electionId],
    queryFn: () => getPositions(electionId),
    enabled: !!electionId,
  });

  // Group normalized candidates by position
  const positions = useMemo(() => {
    const candidates = rawCandidates.map(normalizeCandidate);
    return rawPositions.map((pos) => ({
      id: pos.id,
      title: pos.name,
      candidates: candidates.filter((c) => c.positionId === pos.id),
    }));
  }, [rawCandidates, rawPositions]);

  const handleSubmitVote = async () => {
    const unvotedPositions = positions.filter((p) => !votes[p.id]);
    if (unvotedPositions.length > 0) {
      toast.warning(
        `Please select a candidate for: ${unvotedPositions.map((p) => p.title).join(", ")}`,
      );
      return;
    }

    setSubmitting(true);
    try {
      for (const pos of positions) {
        const selected = votes[pos.id];
        if (!selected) continue;
        await castVote({
          election_id: electionId,
          position_id: pos.id,
          voted_for_id: selected.id,
          participant_id: participantId,
        });
      }
      localStorage.removeItem("activeVotingLink");
      toast.success("Vote submitted successfully!");
      navigate("/voter/results");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.non_field_errors?.[0] ||
        "Failed to submit vote. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Guard: no voting link
  if (!activeLink) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-white font-semibold text-xl">No Voting Session</p>
          <p className="text-gray-400 mt-2">
            Please access the election through your voting link.
          </p>
        </div>
      </div>
    );
  }

  // Guard: already voted
  if (activeLink.is_used) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-white font-semibold text-xl">Already Voted</p>
          <p className="text-gray-400 mt-2">
            You have already cast your vote for this election.
          </p>
        </div>
      </div>
    );
  }

  const isLoading = candidatesLoading || positionsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <p className="text-gray-400">Loading election…</p>
      </div>
    );
  }

  const totalSelected = Object.keys(votes).length;
  const totalPositions = positions.length;

  return (
    <div className="min-h-screen bg-[#0B0C10] w-full px-2 md:px-10 py-4">
      <div className="p-2 md:p-8 flex flex-col gap-14 w-full">
        {/* Header */}
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-4">
            <div className="text-[#144DEF] font-bold border border-[#144DEF] flex py-1 px-4 rounded-full w-fit bg-white/10 backdrop-blur-sm">
              <p className="flex items-center justify-center gap-2 text-sm">
                <GoDotFill className="animate-pulse" />
                LIVE NOW
              </p>
            </div>
            <h1 className="text-[#144DEF] font-bold text-3xl md:text-4xl">
              {rawElection?.name?.toUpperCase() ?? "ELECTION"}
            </h1>
          </div>
          <CountDownCard countdown={countdown} />
        </div>

        {/* Candidate sections per position */}
        {positions.length === 0 ? (
          <p className="text-gray-400 text-center py-12">
            No positions or candidates found for this election.
          </p>
        ) : (
          positions.map((position) => (
            <CandidateSection
              key={position.id}
              title={position.title}
              candidates={position.candidates}
              selectedCandidate={votes[position.id] ?? null}
              setSelectedCandidate={(candidate) =>
                setVotes((prev) => ({ ...prev, [position.id]: candidate }))
              }
            />
          ))
        )}

        {/* Vote summary */}
        {positions.length > 0 && (
          <div className="border border-[#144DEF] shadow-xl shadow-[#144DEF]/20 rounded-3xl p-8 flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h1 className="text-3xl font-bold text-white">
                Selected Candidates
              </h1>
              <span className="text-sm text-gray-400">
                {totalSelected}/{totalPositions} positions selected
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {positions.map((position) => {
                const candidate = votes[position.id];
                return (
                  <div
                    key={position.id}
                    className="bg-[#0F1117]/70 border border-white/10 rounded-2xl p-4 shadow-md"
                  >
                    <p className="text-[#144DEF] font-semibold text-sm mb-3">
                      {position.title}
                    </p>
                    {candidate ? (
                      <div className="flex items-center gap-3">
                        {candidate.image ? (
                          <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-14 h-14 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                            <span className="text-primary text-xl font-bold">
                              {candidate.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-lg text-white font-medium truncate">
                            {candidate.name}
                          </p>
                          {candidate.slogan && (
                            <p className="text-sm text-gray-500 truncate">
                              {candidate.slogan}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-400">No candidate selected</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit */}
        {positions.length > 0 && (
          <div className="flex justify-center mt-4">
            <button
              onClick={handleSubmitVote}
              disabled={submitting}
              className="bg-[#144DEF] hover:bg-[#0F1117] disabled:opacity-60 disabled:cursor-not-allowed text-white px-16 py-4 rounded-full text-xl font-semibold transition-all duration-300"
            >
              {submitting ? "Submitting…" : "Submit Vote"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VotePage;
