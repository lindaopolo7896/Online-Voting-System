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
import { getElections } from "../../api/organisationApi";

// Organisation-scoped permissions (election == null). Mirrors ORG_PERMISSIONS
// in the backend services/permission_service.py.
const ORG_PERMISSION_GROUPS = [
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
    group: "Members",
    permissions: [
      { codename: "view.membership", label: "View" },
      { codename: "add.membership", label: "Add" },
      { codename: "update.membership", label: "Edit" },
      { codename: "delete.membership", label: "Remove" },
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
    permissions: [
      { codename: "view.log", label: "View" },
      { codename: "delete.log", label: "Delete" },
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
    group: "Voting Links",
    permissions: [
      { codename: "view.voting_link", label: "View" },
      { codename: "add.voting_link", label: "Create" },
    ],
  },
];

// Election-scoped permissions (tied to a specific election). Mirrors
// ELECTION_PERMISSIONS in the backend services/permission_service.py.
const ELECTION_PERMISSION_GROUPS = [
  {
    group: "Election",
    permissions: [
      { codename: "view.election", label: "View" },
      { codename: "update.election", label: "Edit" },
      { codename: "delete.election", label: "Delete" },
      { codename: "start.election", label: "Start" },
      { codename: "close.election", label: "Close" },
      { codename: "publish.results", label: "Publish Results" },
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
    group: "Voters",
    permissions: [
      { codename: "view.participant", label: "View" },
      { codename: "add.participant", label: "Add" },
      { codename: "update.participant", label: "Edit" },
      { codename: "delete.participant", label: "Remove" },
    ],
  },
  {
    group: "Candidates",
    permissions: [
      { codename: "view.candidate", label: "View" },
      { codename: "add.candidate", label: "Add" },
      { codename: "update.candidate", label: "Edit" },
      { codename: "delete.candidate", label: "Remove" },
      { codename: "approve.candidate", label: "Approve" },
      { codename: "reject.candidate", label: "Reject" },
    ],
  },
  {
    group: "Votes",
    permissions: [
      { codename: "view.vote", label: "View" },
      { codename: "add.vote", label: "Cast" },
      { codename: "update.vote", label: "Edit" },
      { codename: "delete.vote", label: "Delete" },
      { codename: "view.results", label: "View Results" },
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
];

function memberName(m) {
  const u = m.user ?? {};
  const first = u.first_name ?? "";
  const last = u.last_name ?? "";
  return first || last
    ? `${first} ${last}`.trim()
    : (u.email ?? `Member #${m.id}`);
}

// A permission record belongs to the election scope when it carries an
// election object; org-scoped records have election == null.
function recordCodenamesForScope(records, scope, electionId) {
  return new Set(
    records
      .filter((p) =>
        scope === "election"
          ? p.election?.id === electionId
          : !p.election,
      )
      .map((p) => p.codename ?? p.permission_codename ?? ""),
  );
}

function OrganisationPermissionsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  const queryClient = useQueryClient();

  useEffect(() => {
    setPageTitle("Permissions");
    setSubtitle("Manage member access and permissions");
  }, [setPageTitle, setSubtitle]);

  // ── Scope: organisation-wide vs a specific election ───────────────────────
  const [scope, setScope] = useState("organisation"); // "organisation" | "election"
  const [selectedElectionId, setSelectedElectionId] = useState(null);

  const { data: elections = [] } = useQuery({
    queryKey: ["elections"],
    queryFn: () => getElections(),
  });

  // Default to the first election when switching into election scope.
  useEffect(() => {
    if (scope === "election" && elections.length > 0 && !selectedElectionId) {
      setSelectedElectionId(elections[0].id);
    }
  }, [scope, elections, selectedElectionId]);

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

  // ── Permissions for selected member (all scopes; filtered client-side) ────
  const { data: permissionRecords = [], isLoading: permsLoading } = useQuery({
    queryKey: ["member-permissions", selectedMemberId],
    queryFn: () => getMembershipPermissions(selectedMemberId),
    enabled: !!selectedMemberId,
    staleTime: Infinity,
  });

  // Local editable set — re-initialize when the member, scope, or selected
  // election changes, but not on background refetches (which would discard edits).
  const [pendingSet, setPendingSet] = useState(() => new Set());
  const [dirty, setDirty] = useState(false);
  const initializedForRef = useRef(null);

  const scopeKey = `${selectedMemberId}:${scope}:${selectedElectionId ?? ""}`;

  useEffect(() => {
    if (permsLoading || !selectedMemberId) return;
    if (scope === "election" && !selectedElectionId) return;
    if (initializedForRef.current === scopeKey) return;

    initializedForRef.current = scopeKey;
    setPendingSet(
      recordCodenamesForScope(permissionRecords, scope, selectedElectionId),
    );
    setDirty(false);
  }, [scopeKey, permissionRecords, permsLoading, selectedMemberId, scope, selectedElectionId]);

  function toggle(codename) {
    setPendingSet((prev) => {
      const next = new Set(prev);
      next.has(codename) ? next.delete(codename) : next.add(codename);
      return next;
    });
    setDirty(true);
  }

  function cancel() {
    setPendingSet(
      recordCodenamesForScope(permissionRecords, scope, selectedElectionId),
    );
    setDirty(false);
  }

  function changeScope(nextScope) {
    if (nextScope === scope) return;
    setScope(nextScope);
    initializedForRef.current = null; // force re-init for the new scope
  }

  // ── Save ─────────────────────────────────────────────────────────────────
  // The backend bulk_assign does delete-all + recreate at the chosen scope, so
  // we send the complete desired set — not a delta.
  const assignMutation = useMutation({ mutationFn: bulkAssignPermissions });
  const isSaving = assignMutation.isPending;

  async function save() {
    try {
      await assignMutation.mutateAsync({
        membership_id: selectedMemberId,
        permissions: [...pendingSet],
        type: scope,
        ...(scope === "election" && { election_id: selectedElectionId }),
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
  const groups =
    scope === "election" ? ELECTION_PERMISSION_GROUPS : ORG_PERMISSION_GROUPS;
  const electionNotChosen = scope === "election" && !selectedElectionId;

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5 h-full">
      {/* ── Scope toggle ──────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-border p-1">
          {[
            { key: "organisation", label: "Organisation" },
            { key: "election", label: "Election" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => changeScope(key)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
                scope === key
                  ? "bg-primary text-white"
                  : "text-muted hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {scope === "election" && (
          <select
            value={selectedElectionId ?? ""}
            onChange={(e) => {
              setSelectedElectionId(Number(e.target.value) || null);
            }}
            className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:border-primary"
          >
            {elections.length === 0 ? (
              <option value="">No elections</option>
            ) : (
              elections.map((el) => (
                <option key={el.id} value={el.id}>
                  {el.name}
                </option>
              ))
            )}
          </select>
        )}
      </div>

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
          ) : electionNotChosen ? (
            <Card className="border-white/10 rounded-xl p-6">
              <p className="text-muted">
                Select an election to manage election-specific permissions.
              </p>
            </Card>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-muted text-sm">
                    Editing{" "}
                    {scope === "election" ? "election" : "organisation"}{" "}
                    permissions for
                  </p>
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
                  {groups.map(({ group, permissions }) => (
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
