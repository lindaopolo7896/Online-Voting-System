import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { updateElection } from "../../api/organisationApi";

function toDatetimeLocal(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function EditElectionModal({ election, onClose }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: election.name ?? "",
    description: election.description ?? "",
    startDate: toDatetimeLocal(election.date_time_occuring),
    endDate: toDatetimeLocal(election.date_time_ending),
  });
  const [saving, setSaving] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    if (!form.name.trim()) { toast.error("Election name is required."); return; }
    if (!form.startDate || !form.endDate) { toast.error("Start and end date are required."); return; }
    if (new Date(form.startDate) >= new Date(form.endDate)) {
      toast.error("End date must be after start date."); return;
    }
    setSaving(true);
    try {
      await updateElection(election.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        date_time_occuring: new Date(form.startDate).toISOString(),
        date_time_ending: new Date(form.endDate).toISOString(),
      });
      queryClient.invalidateQueries({ queryKey: ["elections"] });
      toast.success("Election updated.");
      onClose();
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to update election."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-surface shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-text">Edit Election</h2>
          <button onClick={onClose} className="text-muted hover:text-text transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Election Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none"
              placeholder="Enter election name"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-text">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:border-primary focus:outline-none resize-none"
              placeholder="Optional description"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">Start Date & Time</label>
              <input
                type="datetime-local"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text">End Date & Time</label>
              <input
                type="datetime-local"
                value={form.endDate}
                onChange={(e) => set("endDate", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <button
            onClick={onClose}
            disabled={saving}
            className="rounded-lg border border-border px-5 py-2 text-sm text-text hover:bg-background transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-primary px-5 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditElectionModal;
