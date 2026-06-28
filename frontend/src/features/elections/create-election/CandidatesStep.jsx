import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { UserCheck, ChevronRight } from "lucide-react";
import Card from "../../../components/ui/Card";
import {
  getParticipants,
  getPositions,
  convertToCandidate,
} from "../../../api/organisationApi";

function CandidatesStep({ electionId, onNext }) {
  const [assignments, setAssignments] = useState({});
  const [assigning, setAssigning] = useState({});
  const [assigned, setAssigned] = useState({});

  const { data: participants = [], isLoading: loadingP } = useQuery({
    queryKey: ["participants", electionId],
    queryFn: () => getParticipants(electionId),
    enabled: !!electionId,
  });

  const { data: positions = [], isLoading: loadingPos } = useQuery({
    queryKey: ["positions", electionId],
    queryFn: () => getPositions(electionId),
    enabled: !!electionId,
  });

  // Any participant can be registered as a candidate — candidacy is not a role.
  const eligibleParticipants = participants;

  async function handleAssign(participantId) {
    const positionId = assignments[participantId];
    if (!positionId) {
      toast.error("Select a position first.");
      return;
    }
    setAssigning((prev) => ({ ...prev, [participantId]: true }));
    try {
      await convertToCandidate(electionId, participantId, {
        position_id: parseInt(positionId, 10),
      });
      setAssigned((prev) => ({ ...prev, [participantId]: true }));
      toast.success("Candidate registered for position.");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to register candidate.";
      toast.error(msg);
    } finally {
      setAssigning((prev) => ({ ...prev, [participantId]: false }));
    }
  }

  const isLoading = loadingP || loadingPos;
  const assignedCount = Object.values(assigned).filter(Boolean).length;

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">Register Candidates</h2>
        <p className="mt-1 text-sm text-muted">
          Assign uploaded candidates to their respective positions. You can also
          do this later from the Candidates page.
        </p>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted">
          Loading participants…
        </p>
      ) : eligibleParticipants.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-10 text-center">
          <UserCheck size={32} className="mx-auto mb-3 text-muted" />
          <p className="font-medium text-text">No participants found</p>
          <p className="mt-1 text-sm text-muted">
            Add participants in the previous step to register them as candidates
            here, or skip and assign from the Candidates page after creation.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {eligibleParticipants.map((p) => {
            const u = p.membership?.user ?? {};
            const name =
              `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
              u.email ||
              `Participant #${p.id}`;
            const isAssigned = !!assigned[p.id];
            const isBusy = !!assigning[p.id];

            return (
              <div
                key={p.id}
                className={`flex flex-wrap items-center gap-4 rounded-xl border p-4 transition-colors ${
                  isAssigned
                    ? "border-green-400/30 bg-green-500/5"
                    : "border-border"
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text">
                    {name}
                  </p>
                  <p className="truncate text-xs text-muted">{u.email}</p>
                </div>

                {isAssigned ? (
                  <span className="shrink-0 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600">
                    Assigned
                  </span>
                ) : (
                  <div className="flex shrink-0 items-center gap-2">
                    <select
                      value={assignments[p.id] ?? ""}
                      onChange={(e) =>
                        setAssignments((prev) => ({
                          ...prev,
                          [p.id]: e.target.value,
                        }))
                      }
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:border-primary"
                    >
                      <option value="">Select position</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.id}>
                          {pos.name}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleAssign(p.id)}
                      disabled={isBusy || !assignments[p.id]}
                      className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isBusy ? "…" : "Assign"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs text-muted">
          {assignedCount} of {eligibleParticipants.length} participant
          {eligibleParticipants.length !== 1 ? "s" : ""} registered as candidates
        </p>

        <button
          onClick={onNext}
          className="flex items-center gap-2 rounded-lg bg-primary px-6 py-2 text-sm text-white hover:bg-primary/90 transition"
        >
          Continue <ChevronRight size={16} />
        </button>
      </div>
    </Card>
  );
}

export default CandidatesStep;
