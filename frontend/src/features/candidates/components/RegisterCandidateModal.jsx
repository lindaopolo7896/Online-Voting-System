import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, UserCheck } from "lucide-react";
import { convertToCandidate } from "@/api/organisationApi";

function participantDisplayName(p) {
  const u = p.membership?.user ?? p.user ?? {};
  return (
    `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
    u.email ||
    `Participant #${p.id}`
  );
}

function RegisterCandidateModal({
  electionId,
  participants = [],
  positions = [],
  registeredCandidates = [],
  onClose,
}) {
  const queryClient = useQueryClient();
  const [participantId, setParticipantId] = useState("");
  const [positionId, setPositionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Membership ids already registered as candidates (for any position).
  const registeredMembershipIds = useMemo(
    () =>
      new Set(
        registeredCandidates
          .map((c) => c.membership?.id)
          .filter((id) => id != null),
      ),
    [registeredCandidates],
  );

  const eligible = useMemo(() => {
    const available = participants.filter(
      (p) => !registeredMembershipIds.has(p.membership?.id),
    );
    const taggedCandidates = available.filter(
      (p) => p.membership?.role === "candidate",
    );
    return taggedCandidates.length > 0 ? taggedCandidates : available;
  }, [participants, registeredMembershipIds]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!participantId || !positionId) {
      toast.error("Please select both a participant and a position.");
      return;
    }
    setSubmitting(true);
    try {
      await convertToCandidate(electionId, participantId, {
        position_id: parseInt(positionId, 10),
      });
      queryClient.invalidateQueries({ queryKey: ["candidates", electionId] });
      toast.success("Candidate registered successfully.");
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to register candidate.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-muted hover:text-text transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCheck size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text">Register Candidate</h2>
            <p className="text-xs text-muted">
              Assign a participant to a position
            </p>
          </div>
        </div>

        {eligible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border py-10 text-center">
            <p className="font-medium text-text">No participants available</p>
            <p className="mt-1 text-sm text-muted">
              Add participants to this election first, or every participant is
              already registered as a candidate.
            </p>
            <button
              onClick={onClose}
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Participant */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">
                Participant
              </label>
              <select
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
              >
                <option value="">Select participant</option>
                {eligible.map((p) => {
                  const name = participantDisplayName(p);
                  const email =
                    p.membership?.user?.email ?? p.user?.email ?? "";
                  return (
                    <option key={p.id} value={p.id}>
                      {name}
                      {email ? ` — ${email}` : ""}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Position */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Position</label>
              {positions.length === 0 ? (
                <p className="text-xs text-muted">
                  No positions found for this election.
                </p>
              ) : (
                <select
                  value={positionId}
                  onChange={(e) => setPositionId(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
                >
                  <option value="">Select position</option>
                  {positions.map((pos) => (
                    <option key={pos.id} value={pos.id}>
                      {pos.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Footer */}
            <div className="mt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-background transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !participantId || !positionId}
                className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? "Registering…" : "Register Candidate"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RegisterCandidateModal;
