import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { X, UserPlus } from "lucide-react";
import { createMembership } from "@/api/organisationApi";
import useAuth from "@/hooks/useAuth";

const ROLES = ["member", "official", "admin"];

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text">{label}</label>
      {children}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  );
}

function AddMemberModal({ onClose }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "member",
    phone: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.last_name.trim()) e.last_name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    if (!form.role) e.role = "Required";
    return e;
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => createMembership(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success("Member added successfully.");
      onClose();
    },
    onError: (err) => {
      const data = err?.response?.data;
      const msg =
        data?.detail ||
        data?.message ||
        (typeof data === "string" ? data : null) ||
        "Failed to add member.";
      toast.error(msg);
    },
  });

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const tempPassword = crypto.randomUUID().replace(/-/g, "") + "Aa1!";
    const payload = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim().toLowerCase(),
      password: tempPassword,
      role: form.role,
      organisation_id: user?.organisationId,
      ...(form.phone.trim() && { phone: form.phone.trim() }),
      ...(form.bio.trim() && { bio: form.bio.trim() }),
    };
    mutate(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-surface p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-text transition">
          <X size={20} />
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UserPlus size={20} />
          </div>
          <div>
            <h2 className="font-semibold text-text">Add Member</h2>
            <p className="text-xs text-muted">Create a new organisation member</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="First Name" error={errors.first_name}>
              <input
                value={form.first_name}
                onChange={(e) => set("first_name", e.target.value)}
                placeholder="John"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
              />
            </Field>
            <Field label="Last Name" error={errors.last_name}>
              <input
                value={form.last_name}
                onChange={(e) => set("last_name", e.target.value)}
                placeholder="Doe"
                className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
              />
            </Field>
          </div>

          <Field label="Email" error={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="john@example.com"
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
            />
          </Field>

          <Field label="Role" error={errors.role}>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text focus:outline-none focus:border-primary"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </Field>

          <Field label="Phone (optional)">
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="+1 234 567 890"
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
            />
          </Field>

          <Field label="Bio (optional)">
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => set("bio", e.target.value)}
              placeholder="Short bio..."
              className="rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary resize-none"
            />
          </Field>

          <div className="mt-2 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-background transition">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isPending ? "Adding…" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMemberModal;
