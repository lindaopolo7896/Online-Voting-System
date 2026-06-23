import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AlertTriangle, X } from "lucide-react";
import { deleteElection } from "../../api/organisationApi";

function DeleteElectionModal({ election, onClose }) {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteElection(election.id);
      queryClient.invalidateQueries({ queryKey: ["elections"] });
      toast.success("Election deleted.");
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to delete election."
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">Delete Election</h2>
          <button onClick={onClose} disabled={deleting} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-50">
              <AlertTriangle size={22} className="text-red-500" />
            </div>
            <div>
              <p className="font-medium text-text">
                Are you sure you want to delete{" "}
                <span className="text-red-500">&ldquo;{election.name}&rdquo;</span>?
              </p>
              <p className="mt-1.5 text-sm text-muted">
                This action cannot be undone. All positions, participants, and related data for this election will be permanently removed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-lg border border-border px-5 py-2 text-sm text-text hover:bg-background transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-500 px-5 py-2 text-sm text-white hover:bg-red-600 transition disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete Election"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteElectionModal;
