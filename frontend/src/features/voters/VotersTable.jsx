import { useState, useMemo } from "react";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Pencil, MoreVertical } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import VoterFilters from "./VoterFilters";

function voterName(p) {
  const u = p.membership?.user ?? p.user ?? {};
  return (
    `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
    u.email ||
    `Voter #${p.id}`
  );
}

function voterEmail(p) {
  return p.membership?.user?.email ?? p.user?.email ?? "—";
}

const ROLE_BADGE = {
  admin: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  official: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  member: "bg-green-500/10 text-green-600 border-green-500/20",
};

const columns = [
  {
    id: "name",
    header: "VOTER",
    accessorFn: (row) => voterName(row),
    cell: ({ row }) => {
      const name = voterName(row.original);
      const email = voterEmail(row.original);
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-text">{name}</p>
            <p className="text-xs text-muted">{email}</p>
          </div>
        </div>
      );
    },
  },
  {
    id: "role",
    header: "ROLE",
    accessorFn: (row) => row.membership?.role ?? row.role ?? "member",
    cell: ({ row }) => {
      const role = row.original.membership?.role ?? row.original.role ?? "member";
      return (
        <span
          className={`inline-flex rounded border px-2 py-0.5 text-xs font-semibold capitalize ${
            ROLE_BADGE[role] ?? "bg-slate-50 border-slate-300 text-slate-600"
          }`}
        >
          {role}
        </span>
      );
    },
  },
  {
    id: "voted",
    header: "VOTED",
    accessorFn: (row) => row.has_voted,
    cell: ({ row }) =>
      row.original.has_voted ? (
        <span className="inline-flex rounded border border-green-500 bg-green-50 px-3 py-1 text-xs font-semibold uppercase text-green-600">
          Yes
        </span>
      ) : (
        <span className="inline-flex rounded border border-slate-300 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase text-slate-500">
          No
        </span>
      ),
  },
  {
    id: "link",
    header: "VOTING LINK",
    cell: ({ row }) =>
      row.original.voting_link ? (
        <span className="inline-flex rounded border border-blue-500 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase text-blue-600">
          Sent
        </span>
      ) : (
        <span className="inline-flex rounded border border-orange-400 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase text-orange-500">
          Not Sent
        </span>
      ),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <Pencil size={15} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <MoreVertical size={15} />
        </button>
      </div>
    ),
  },
];

function VotersTable({
  participants = [],
  elections = [],
  selectedElectionId,
  onElectionChange,
  isLoading,
}) {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(
    () =>
      search
        ? participants.filter((p) => {
            const name = voterName(p).toLowerCase();
            const email = voterEmail(p).toLowerCase();
            const q = search.toLowerCase();
            return name.includes(q) || email.includes(q);
          })
        : participants,
    [participants, search],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <VoterFilters
        search={search}
        setSearch={setSearch}
        elections={elections}
        selectedElectionId={selectedElectionId}
        onElectionChange={onElectionChange}
      />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted">
          Loading voters…
        </p>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}

export default VotersTable;
