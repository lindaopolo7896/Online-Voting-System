import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, UserCog } from "lucide-react";
import { updateMembership } from "@/api/organisationApi";

const ROLES = ["member", "official", "admin"];

function EditMemberModal({ member, onClose }) {
  const queryClient = useQueryClient();
  const u = member.user ?? {};
  const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || `Member #${member.id}`;

  const [role, setRole] = useState(member.role ?? "member");
  const [isActive, setIsActive] = useState(member.is_active ?? true);

  const { mutate, isPending } = useMutation({
    mutationFn: () => updateMembership(member.id, { role, is_active: isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success("Member updated.");
      onClose();
    },
    onError: (err) => {
      const data = err?.response?.data;
      const msg = data?.detail || data?.message || "Failed to update member.";
      toast.error(msg);
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-text transition">
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserCog size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text">Edit Member</h2>
            <p className="text-xs text-muted">{name}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-background px-4 py-3">
            <div>
              <p className="text-sm font-medium text-text">Active</p>
              <p className="text-xs text-muted">Allow this member to access the organisation</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`relative h-6 w-11 rounded-full transition-colors ${isActive ? "bg-primary" : "bg-border"}`}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-background transition">
            Cancel
          </button>
          <button
            onClick={() => mutate()}
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditMemberModal;
