import { useState, useMemo } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoDotFill } from "react-icons/go";

import CandidateSection from "@/features/voting/components/CandidateSection";
import { castVote } from "@/api/organisationApi";
import {
  getVotingSession,
  clearVotingSession,
  groupBallotByPosition,
} from "@/features/voting/session";

function VotePage() {
  const navigate = useNavigate();
  const [votes, setVotes] = useState({}); // { [positionId]: candidate }
  const [submitting, setSubmitting] = useState(false);

  // The verified voting session (ballot + token) built at the OTP step.
  const session = useMemo(() => getVotingSession(), []);

  const electionId = session?.election_id ?? null;
  const votingToken = session?.voting_token ?? null;

  // Build positions/candidates straight from the verified ballot — no API calls.
  const positions = useMemo(
    () => groupBallotByPosition(session?.ballot ?? []),
    [session],
  );

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
      let lastResult = null;
      for (const pos of positions) {
        const selected = votes[pos.id];
        if (!selected) continue;
        lastResult = await castVote({
          election_id: electionId,
          position_id: pos.id,
          voted_for_id: selected.id,
          voting_token: votingToken,
        });
      }

      // Voting is done — drop the session and the transient JWT so the voter is not
      // left in any logged-in state. Viewing results is a separate login.
      clearVotingSession();
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      navigate("/vote-confirmation", {
        replace: true,
        state: { txHash: lastResult?.vote_cast_tx_hash ?? null },
      });
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

  // Guard: no verified voting session — bounce back to sign-in.
  if (!session) {
    return <Navigate to="/sign-in" replace />;
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
              CAST YOUR VOTE
            </h1>
          </div>
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
                        <div className="w-14 h-14 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                          <span className="text-primary text-xl font-bold">
                            {candidate.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
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
