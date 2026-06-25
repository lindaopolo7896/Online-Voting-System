import { X, Mail, Phone, User, Calendar, ShieldCheck } from "lucide-react";

const ROLE_BADGE = {
  admin:       "bg-purple-500/10 text-purple-600 border-purple-500/20",
  official:    "bg-blue-500/10   text-blue-600   border-blue-500/20",
  candidate:   "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  participant: "bg-green-500/10  text-green-600  border-green-500/20",
};

function Row({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <Icon size={15} className="text-muted mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-text">{value || "—"}</p>
      </div>
    </div>
  );
}

function ViewMemberModal({ member, onClose }) {
  const u = member.user ?? {};
  const name = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || `Member #${member.id}`;
  const joined = member.created_at
    ? new Date(member.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-muted hover:text-text transition">
          <X size={20} />
        </button>

        {/* Avatar + name */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="font-semibold text-text">{name}</h2>
            <span className={`inline-flex mt-1 rounded border px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_BADGE[member.role] ?? "bg-slate-50 border-slate-300 text-slate-600"}`}>
              {member.role ?? "participant"}
            </span>
          </div>
        </div>

        <div>
          <Row icon={Mail}      label="Email"   value={u.email} />
          <Row icon={Phone}     label="Phone"   value={u.phone} />
          <Row icon={User}      label="Bio"     value={u.bio} />
          <Row icon={Calendar}  label="Joined"  value={joined} />
          <Row icon={ShieldCheck} label="Status" value={member.is_active ? "Active" : "Inactive"} />
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2 text-sm text-text hover:bg-background transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewMemberModal;
