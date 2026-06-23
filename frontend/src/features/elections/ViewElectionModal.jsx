import { X } from "lucide-react";
import { formatElectionDate, getElectionStatus } from "../../api/organisationApi";

const STATUS_STYLES = {
  live: "bg-blue-50 text-blue-600 border-blue-500",
  upcoming: "bg-orange-50 text-orange-600 border-orange-500",
  completed: "bg-green-50 text-green-600 border-green-500",
};

function Row({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <span className="text-sm text-text">{value || "—"}</span>
    </div>
  );
}

function ViewElectionModal({ election, onClose }) {
  const status = getElectionStatus(election);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">Election Details</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <Row label="Election Name" value={election.name} />
          {election.description && (
            <Row label="Description" value={election.description} />
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Row label="Start Date" value={formatElectionDate(election.date_time_occuring)} />
            <Row label="End Date" value={formatElectionDate(election.date_time_ending)} />
          </div>
          <div>
            <span className="text-xs uppercase tracking-wide text-muted">Status</span>
            <div className="mt-1">
              <span
                className={`inline-flex rounded-md border px-3 py-1 text-xs font-semibold uppercase ${
                  STATUS_STYLES[status] ?? ""
                }`}
              >
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-5 py-2 text-sm text-text hover:bg-background transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewElectionModal;
