import { useState, useMemo } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Pencil } from "lucide-react";
import DataTable from "../../components/ui/DataTable";
import CandidateFilters from "./CandidateFilters";

function candidateName(c) {
  const u = c.membership?.user ?? c.user ?? {};
  return (
    `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() ||
    u.email ||
    `Candidate #${c.id}`
  );
}

function candidateEmail(c) {
  return c.membership?.user?.email ?? c.user?.email ?? "—";
}

const STATUS_STYLES = {
  approved: "bg-green-50 border-green-500 text-green-600",
  pending: "bg-orange-50 border-orange-500 text-orange-600",
  rejected: "bg-red-50 border-red-500 text-red-600",
};

const columns = [
  {
    id: "name",
    header: "CANDIDATE",
    accessorFn: (row) => candidateName(row),
    cell: ({ row }) => {
      const name = candidateName(row.original);
      const email = candidateEmail(row.original);
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
    id: "position",
    header: "POSITION",
    accessorFn: (row) => row.position?.name ?? "",
    filterFn: "equals",
    cell: ({ row }) => (
      <span className="text-sm text-text">
        {row.original.position?.name ?? (
          <span className="text-muted italic">Unassigned</span>
        )}
      </span>
    ),
  },
  {
    id: "status",
    header: "STATUS",
    accessorFn: (row) => row.status ?? "pending",
    filterFn: "equals",
    cell: ({ row }) => {
      const status = row.original.status ?? "pending";
      return (
        <span
          className={`inline-flex min-w-[110px] justify-center rounded-md border px-3 py-1 text-xs font-semibold uppercase ${
            STATUS_STYLES[status] ?? "bg-slate-50 border-slate-300 text-slate-600"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "votes",
    header: "VOTES",
    accessorFn: (row) => row.votes ?? 0,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-text">
        {row.original.votes ?? 0}
      </span>
    ),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <Eye size={15} />
        </button>
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <Pencil size={15} />
        </button>
      </div>
    ),
  },
];

function CandidatesTable({
  candidates = [],
  elections = [],
  selectedElectionId,
  onElectionChange,
  isLoading,
  onRegisterClick,
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const [search, setSearch] = useState("");

  const positions = useMemo(
    () => [...new Set(candidates.map((c) => c.position?.name).filter(Boolean))],
    [candidates],
  );

  const filteredData = useMemo(
    () =>
      search
        ? candidates.filter((c) => {
            const name = candidateName(c).toLowerCase();
            const email = candidateEmail(c).toLowerCase();
            const q = search.toLowerCase();
            return name.includes(q) || email.includes(q);
          })
        : candidates,
    [candidates, search],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <CandidateFilters
        table={table}
        search={search}
        setSearch={setSearch}
        elections={elections}
        selectedElectionId={selectedElectionId}
        onElectionChange={onElectionChange}
        positions={positions}
        onRegisterClick={onRegisterClick}
      />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted">
          Loading candidates…
        </p>
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}

export default CandidatesTable;
