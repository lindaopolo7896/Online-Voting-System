import { useState, useMemo } from "react";
import { getCoreRowModel, getFilteredRowModel, useReactTable } from "@tanstack/react-table";
import { Search, UserPlus, Upload, Eye, UserCog, ShieldCheck, Trash2 } from "lucide-react";
import DropdownPortal from "@/components/ui/DropdownPortal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DataTable from "@/components/ui/DataTable";
import AddMemberModal from "@/features/members/components/AddMemberModal";
import BulkUploadMembersModal from "@/features/members/components/BulkUploadMembersModal";
import ViewMemberModal from "@/features/members/components/ViewMemberModal";
import EditMemberModal from "@/features/members/components/EditMemberModal";
import { deleteMembership } from "@/api/organisationApi";

const ROLE_BADGE = {
  admin:    "bg-purple-500/10 text-purple-600 border-purple-500/20",
  official: "bg-blue-500/10   text-blue-600   border-blue-500/20",
  member:   "bg-green-500/10  text-green-600  border-green-500/20",
};

function memberName(m) {
  const u = m.user ?? {};
  const full = `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim();
  return full || `Member #${m.id}`;
}

function ActionsMenu({ member, onView, onEdit, onManagePerms, onRemove }) {
  const items = [
    { label: "View Profile",       icon: Eye,         onClick: () => onView(member),        disabled: false, danger: false },
    { label: "Edit Member",        icon: UserCog,     onClick: () => onEdit(member),        disabled: false, danger: false },
    { label: "Manage Permissions", icon: ShieldCheck, onClick: () => onManagePerms(member), disabled: false, danger: false },
    { label: "Remove",             icon: Trash2,      onClick: () => onRemove(member),      disabled: false, danger: true  },
  ];

  return <DropdownPortal items={items} />;
}

// ── Table component ───────────────────────────────────────────────────────────
function MembersTable({ members = [], isLoading }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const { mutate: doRemove } = useMutation({
    mutationFn: (id) => deleteMembership(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["memberships"] });
      toast.success("Member removed.");
      setRemovingId(null);
    },
    onError: (err) => {
      const msg = err?.response?.data?.detail || "Failed to remove member.";
      toast.error(msg);
      setRemovingId(null);
    },
  });

  function handleRemove(member) {
    if (!window.confirm(`Remove ${memberName(member)} from the organisation?`)) return;
    setRemovingId(member.id);
    doRemove(member.id);
  }

  const columns = useMemo(() => [
    {
      id: "member",
      header: "MEMBER",
      accessorFn: (row) => memberName(row),
      cell: ({ row }) => {
        const name = memberName(row.original);
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {name.charAt(0).toUpperCase()}
            </div>
            <p className="font-medium text-text">{name}</p>
          </div>
        );
      },
    },
    {
      id: "email",
      header: "EMAIL",
      accessorFn: (row) => row.user?.email ?? "—",
      cell: ({ row }) => (
        <span className="text-sm text-muted">{row.original.user?.email ?? "—"}</span>
      ),
    },
    {
      id: "role",
      header: "ROLE",
      accessorFn: (row) => row.role ?? "member",
      filterFn: "equals",
      cell: ({ row }) => {
        const role = row.original.role ?? "member";
        return (
          <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold capitalize ${ROLE_BADGE[role] ?? "bg-muted/10 border-muted/20 text-muted"}`}>
            {role}
          </span>
        );
      },
    },
    {
      id: "phone",
      header: "PHONE",
      accessorFn: (row) => row.user?.phone ?? "—",
      cell: ({ row }) => (
        <span className="text-sm text-text">{row.original.user?.phone ?? <span className="text-muted">—</span>}</span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ActionsMenu
          member={row.original}
          onView={setViewingMember}
          onEdit={setEditingMember}
          onManagePerms={(m) => navigate(`/organisation/permissions?membership_id=${m.id}`)}
          onRemove={handleRemove}
        />
      ),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [navigate, removingId]);

  const filtered = useMemo(() => {
    let data = members;
    if (roleFilter) data = data.filter((m) => m.role === roleFilter);
    if (search) {
      const q = search.toLowerCase();
      data = data.filter((m) => {
        const name = memberName(m).toLowerCase();
        const email = (m.user?.email ?? "").toLowerCase();
        const phone = (m.user?.phone ?? "").toLowerCase();
        return name.includes(q) || email.includes(q) || phone.includes(q);
      });
    }
    return data;
  }, [members, search, roleFilter]);

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-lg border border-white/10 bg-surface px-3 text-sm text-text focus:outline-none focus:border-primary"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="official">Official</option>
            <option value="member">Member</option>
          </select>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-64 rounded-lg border border-white/10 bg-surface pl-9 pr-4 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUpload(true)}
            className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-surface px-4 text-sm text-text hover:bg-background transition"
          >
            <Upload size={15} />
            Upload Members
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm text-white hover:bg-primary/90 transition"
          >
            <UserPlus size={15} />
            Add Member
          </button>
        </div>
      </div>

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted">Loading members…</p>
      ) : (
        <DataTable table={table} />
      )}

      {showAdd      && <AddMemberModal onClose={() => setShowAdd(false)} />}
      {showUpload   && <BulkUploadMembersModal onClose={() => setShowUpload(false)} />}
      {viewingMember && <ViewMemberModal member={viewingMember} onClose={() => setViewingMember(null)} />}
      {editingMember && <EditMemberModal member={editingMember} onClose={() => setEditingMember(null)} />}
    </div>
  );
}

export default MembersTable;
