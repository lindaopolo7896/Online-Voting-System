import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Card from "../../components/ui/Card";
import useDashboard from "../../hooks/useDashboard";
import {
  getMemberships,
  getMembershipPermissions,
  bulkAssignPermissions,
} from "../../api/permissionsApi";

const PERMISSION_GROUPS = [
  {
    group: "Organisation",
    permissions: [
      { codename: "view.organisation", label: "View" },
      { codename: "add.organisation", label: "Create" },
      { codename: "update.organisation", label: "Edit" },
      { codename: "delete.organisation", label: "Delete" },
    ],
  },
  {
    group: "Elections",
    permissions: [
      { codename: "view.election", label: "View" },
      { codename: "add.election", label: "Create" },
      { codename: "update.election", label: "Edit" },
      { codename: "delete.election", label: "Delete" },
    ],
  },
  {
    group: "Members",
    permissions: [
      { codename: "view.membership", label: "View" },
      { codename: "add.membership", label: "Add" },
      { codename: "update.membership", label: "Edit" },
      { codename: "delete.membership", label: "Remove" },
    ],
  },
  {
    group: "Candidates",
    permissions: [
      { codename: "view.candidate", label: "View" },
      { codename: "add.candidate", label: "Add" },
      { codename: "update.candidate", label: "Edit" },
      { codename: "delete.candidate", label: "Remove" },
    ],
  },
  {
    group: "Voters",
    permissions: [
      { codename: "view.participant", label: "View" },
      { codename: "add.participant", label: "Add" },
      { codename: "update.participant", label: "Edit" },
      { codename: "delete.participant", label: "Remove" },
    ],
  },
  {
    group: "Positions",
    permissions: [
      { codename: "view.position", label: "View" },
      { codename: "add.position", label: "Create" },
      { codename: "update.position", label: "Edit" },
      { codename: "delete.position", label: "Delete" },
    ],
  },
  {
    group: "Voting Links",
    permissions: [
      { codename: "view.voting_link", label: "View" },
      { codename: "add.voting_link", label: "Create" },
      { codename: "update.voting_link", label: "Edit" },
      { codename: "delete.voting_link", label: "Delete" },
    ],
  },
  {
    group: "Votes",
    permissions: [
      { codename: "view.vote", label: "View" },
      { codename: "add.vote", label: "Cast" },
    ],
  },
  {
    group: "Permissions",
    permissions: [
      { codename: "view.permission", label: "View" },
      { codename: "assign.permission", label: "Assign" },
      { codename: "unassign.permission", label: "Revoke" },
    ],
  },
  {
    group: "Logs",
    permissions: [{ codename: "view.log", label: "View" }],
  },
];

function memberName(m) {
  const u = m.user ?? {};
  const first = u.first_name ?? "";
  const last = u.last_name ?? "";
  return first || last ? `${first} ${last}`.trim() : u.email ?? `Member #${m.id}`;
}

function OrganisationPermissionsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  const queryClient = useQueryClient();

  useEffect(() => {
    setPageTitle("Permissions");
    setSubtitle("Manage member access and permissions");
  }, [setPageTitle, setSubtitle]);

  // ── Members list ─────────────────────────────────────────────────────────
  const { data: members = [], isLoading: membersLoading } = useQuery({
    queryKey: ["memberships"],
    queryFn: getMemberships,
  });

  const [selectedMemberId, setSelectedMemberId] = useState(null);

  useEffect(() => {
    if (members.length > 0 && !selectedMemberId) {
      setSelectedMemberId(members[0].id);
    }
  }, [members, selectedMemberId]);

  // ── Permissions for selected member ──────────────────────────────────────
  const { data: permissionRecords = [], isLoading: permsLoading } = useQuery({
    queryKey: ["member-permissions", selectedMemberId],
    queryFn: () => getMembershipPermissions(selectedMemberId),
    enabled: !!selectedMemberId,
    // Prevent background refetch while the user is editing checkboxes.
    // We manually invalidate after a successful save.
    staleTime: Infinity,
  });

  // Local editable set — only re-initialize when the selected member changes,
  // not on every React Query background refetch (which would reset user edits).
  const [pendingSet, setPendingSet] = useState(() => new Set());
  const [dirty, setDirty] = useState(false);
  const initializedForRef = useRef(null);

  useEffect(() => {
    // Skip while data is still loading for the current member
    if (permsLoading || !selectedMemberId) return;
    // Skip if we already initialized for this member (user may have edited checkboxes)
    if (initializedForRef.current === selectedMemberId) return;

    initializedForRef.current = selectedMemberId;
    setPendingSet(
      new Set(permissionRecords.map((p) => p.codename ?? p.permission_codename ?? "")),
    );
    setDirty(false);
  }, [selectedMemberId, permissionRecords, permsLoading]);

  function toggle(codename) {
    setPendingSet((prev) => {
      const next = new Set(prev);
      next.has(codename) ? next.delete(codename) : next.add(codename);
      return next;
    });
    setDirty(true);
  }

  function getCodenames(records) {
    return new Set(records.map((p) => p.codename ?? p.permission_codename ?? ""));
  }

  function cancel() {
    setPendingSet(getCodenames(permissionRecords));
    setDirty(false);
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  // The backend bulk_assign does delete-all + recreate, so we must send the
  // complete desired set — not just the delta — otherwise adding one permission
  // would wipe all existing ones.
  const assignMutation = useMutation({ mutationFn: bulkAssignPermissions });
  const isSaving = assignMutation.isPending;

  async function save() {
    try {
      await assignMutation.mutateAsync({
        membership_id: selectedMemberId,
        permissions: [...pendingSet],
        type: "organisation",
      });
      queryClient.invalidateQueries({
        queryKey: ["member-permissions", selectedMemberId],
      });
      toast.success("Permissions updated successfully.");
      setDirty(false);
    } catch {
      toast.error("Failed to update permissions. Please try again.");
    }
  }

  const selectedMember = members.find((m) => m.id === selectedMemberId);

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 h-full">
      <div className="flex flex-col lg:flex-row gap-5 flex-1">
        {/* ── Members panel ─────────────────────────────────────────────── */}
        <Card className="border-white/10 rounded-xl p-4 lg:w-64 shrink-0 self-start">
          <h2 className="font-bold text-text mb-3 text-sm uppercase tracking-wide">
            Members
          </h2>

          {membersLoading ? (
            <p className="text-muted text-sm">Loading...</p>
          ) : members.length === 0 ? (
            <p className="text-muted text-sm">No members found.</p>
          ) : (
            <ul className="flex flex-col gap-1">
              {members.map((m) => (
                <li key={m.id}>
                  <button
                    onClick={() => {
                      setSelectedMemberId(m.id);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all ${
                      selectedMemberId === m.id
                        ? "bg-primary text-white"
                        : "text-text hover:bg-background"
                    }`}
                  >
                    <p className="font-medium text-sm leading-tight">
                      {memberName(m)}
                    </p>
                    {m.role && (
                      <p
                        className={`text-xs mt-0.5 ${
                          selectedMemberId === m.id
                            ? "text-white/70"
                            : "text-muted"
                        }`}
                      >
                        {m.role}
                      </p>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* ── Permissions panel ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {!selectedMemberId ? (
            <Card className="border-white/10 rounded-xl p-6">
              <p className="text-muted">
                Select a member to view and edit their permissions.
              </p>
            </Card>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-muted text-sm">Editing permissions for</p>
                  <h2 className="font-bold text-text text-lg">
                    {selectedMember ? memberName(selectedMember) : "…"}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={cancel}
                    disabled={!dirty || isSaving}
                    className="px-4 py-2 rounded-lg border border-border text-text hover:bg-background transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    disabled={!dirty || isSaving}
                    className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isSaving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>

              {/* Permission groups */}
              {permsLoading ? (
                <Card className="border-white/10 rounded-xl p-6">
                  <p className="text-muted">Loading permissions...</p>
                </Card>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {PERMISSION_GROUPS.map(({ group, permissions }) => (
                    <Card
                      key={group}
                      className="border-white/10 rounded-xl p-4"
                    >
                      <h3 className="font-semibold text-text text-sm mb-3">
                        {group}
                      </h3>

                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        {permissions.map(({ codename, label }) => (
                          <label
                            key={codename}
                            className="flex items-center gap-2 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              checked={pendingSet.has(codename)}
                              onChange={() => toggle(codename)}
                              className="w-4 h-4 accent-primary cursor-pointer"
                            />
                            <span className="text-sm text-muted group-hover:text-text transition-colors select-none">
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrganisationPermissionsPage;
