import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Pencil, Users, Trash2 } from "lucide-react";
import DropdownPortal from "../../components/ui/DropdownPortal";

import { useNavigate } from "react-router-dom";
import DataTable from "../../components/ui/DataTable";
import ElectionFilters from "./ElectionFilters";
import Card from "../../components/ui/Card";
import ViewElectionModal from "./ViewElectionModal";
import EditElectionModal from "./EditElectionModal";
import DeleteElectionModal from "./DeleteElectionModal";
import { getElectionStatus, formatElectionDate } from "../../api/organisationApi";

const STATUS_STYLES = {
  live: "bg-blue-50 text-blue-600 border-blue-500",
  upcoming: "bg-orange-50 text-orange-600 border-orange-500",
  completed: "bg-green-50 text-green-600 border-green-500",
};

function ActionsMenu({ election, onView, onEdit, onManageMembers, onDelete }) {
  const locked = election.status === "live" || election.status === "completed";

  const items = [
    { label: "View Election",   icon: Eye,    onClick: () => onView(election),          disabled: false,  danger: false },
    { label: "Edit Election",   icon: Pencil, onClick: () => onEdit(election),          disabled: locked, danger: false },
    { label: "Manage Members",  icon: Users,  onClick: () => onManageMembers(election), disabled: locked, danger: false },
    { label: "Delete Election", icon: Trash2, onClick: () => onDelete(election),        disabled: locked, danger: true  },
  ];

  return <DropdownPortal items={items} />;
}

function ElectionsTable({ elections = [], participantQueries = [], candidateQueries = [], isLoading, isError }) {
  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState([]);
  const [viewing, setViewing] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const rows = useMemo(
    () =>
      elections.map((e, i) => {
        const parts = participantQueries[i]?.data ?? [];
        const totalVoters = parts.length;
        const votesCast = parts.filter((p) => p.has_voted).length;
        const turnout =
          totalVoters > 0 ? Math.round((votesCast / totalVoters) * 100) : 0;
        const totalCandidates = candidateQueries[i]?.data?.length ?? 0;
        return {
          ...e,
          status: getElectionStatus(e),
          turnout,
          votesCast,
          totalVoters,
          totalCandidates,
        };
      }),
    [elections, participantQueries, candidateQueries],
  );

  const columns = [
    {
      accessorKey: "name",
      header: "ELECTION NAME",
      cell: ({ row }) => (
        <span className="font-medium text-text">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "dates",
      header: "DATES",
      cell: ({ row }) => (
        <div className="space-y-1 text-sm">
          <p className="text-text">{formatElectionDate(row.original.date_time_occuring)}</p>
          <p className="text-muted">{formatElectionDate(row.original.date_time_ending)}</p>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "STATUS",
      filterFn: "equals",
      cell: ({ row }) => (
        <span
          className={`inline-flex rounded-md border px-3 py-1 text-xs font-semibold uppercase ${
            STATUS_STYLES[row.original.status] ?? ""
          }`}
        >
          {row.original.status}
        </span>
      ),
    },
    {
      accessorKey: "totalCandidates",
      header: "CANDIDATES",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text">
          {row.original.totalCandidates}
        </span>
      ),
    },
    {
      accessorKey: "totalVoters",
      header: "VOTERS",
      cell: ({ row }) => (
        <span className="text-sm font-semibold text-text">
          {row.original.totalVoters}
        </span>
      ),
    },
    {
      accessorKey: "turnout",
      header: "VOTER TURNOUT",
      cell: ({ row }) => {
        const { turnout, votesCast, totalVoters } = row.original;
        return (
          <div className="w-40">
            <p className="font-semibold text-text">{turnout}%</p>
            <p className="mb-2 text-xs text-muted">
              {votesCast}/{totalVoters} votes
            </p>
            <div className="h-2 rounded-full bg-border">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${turnout}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ActionsMenu
          election={row.original}
          onView={setViewing}
          onEdit={setEditing}
          onManageMembers={(e) => navigate(`/organisation/members?election_id=${e.id}`)}
          onDelete={setDeleting}
        />
      ),
    },
  ];

  const table = useReactTable({
    data: rows,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <Card className="space-y-4 p-5 border-white/10">
        <ElectionFilters table={table} />

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted">
            Loading elections…
          </p>
        ) : isError ? (
          <p className="py-10 text-center text-sm text-error">
            Failed to load elections. Please refresh.
          </p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted">
            No elections found. Create your first election to get started.
          </p>
        ) : (
          <DataTable table={table} />
        )}
      </Card>

      {viewing && (
        <ViewElectionModal election={viewing} onClose={() => setViewing(null)} />
      )}
      {editing && (
        <EditElectionModal election={editing} onClose={() => setEditing(null)} />
      )}
      {deleting && (
        <DeleteElectionModal
          election={deleting}
          onClose={() => setDeleting(null)}
        />
      )}
    </>
  );
}

export default ElectionsTable;
