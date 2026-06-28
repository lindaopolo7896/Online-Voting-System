import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Check, Building2, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { getMyMemberships, switchMembership } from "@/api/organisationApi";
import useAuth from "@/hooks/useAuth";

function OrgSwitcher() {
  const { user, login } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const { data: memberships = [], isLoading } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: getMyMemberships,
    staleTime: 60_000,
  });

  const { mutate: doSwitch, isPending } = useMutation({
    mutationFn: (id) => switchMembership(id),
    onSuccess: (membership) => {
      // Update auth context so the rest of the app reflects the new org
      login({
        ...user,
        membershipId: membership.id,
        organisationId: membership.organisation?.id,
        role: membership.role,
      });
      queryClient.invalidateQueries();
      setOpen(false);
      toast.success(`Switched to ${membership.organisation?.name}`);
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Failed to switch organisation.";
      toast.error(msg);
    },
  });

  // Close on outside click
  useEffect(() => {
    function handle(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const active = memberships.find((m) => m.id === user?.membershipId) ?? memberships.find((m) => m.currently_active);
  const activeOrgName = active?.organisation?.name ?? "Organisation";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 h-10 rounded-lg border border-border bg-background px-3 text-sm text-text hover:border-primary/50 transition"
      >
        <Building2 size={15} className="text-primary shrink-0" />
        <span className="max-w-[140px] truncate hidden sm:block font-medium">
          {activeOrgName}
        </span>
        {isPending ? (
          <Loader2 size={14} className="animate-spin text-muted" />
        ) : (
          <ChevronDown
            size={14}
            className={`text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-64 rounded-xl border border-border bg-surface shadow-xl z-50 overflow-hidden">
          <p className="px-4 pt-3 pb-1.5 text-[11px] font-semibold tracking-widest text-muted uppercase">
            Your Organisations
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 size={18} className="animate-spin text-muted" />
            </div>
          ) : memberships.length === 0 ? (
            <p className="px-4 py-4 text-sm text-muted">No organisations found.</p>
          ) : (
            <ul className="py-1.5">
              {memberships.map((m) => {
                const isCurrent = m.id === (active?.id);
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => !isCurrent && doSwitch(m.id)}
                      disabled={isCurrent || isPending}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition
                        ${isCurrent
                          ? "text-primary cursor-default"
                          : "text-text hover:bg-background cursor-pointer"
                        }`}
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                        {m.organisation?.name?.charAt(0).toUpperCase() ?? "O"}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p className="truncate font-medium">{m.organisation?.name}</p>
                        <p className="text-xs text-muted capitalize">{m.role}</p>
                      </div>
                      {isCurrent && <Check size={14} className="text-primary shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default OrgSwitcher;
