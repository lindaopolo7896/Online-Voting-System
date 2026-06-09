import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Pencil, Trash2 } from "lucide-react";

import DataTable from "../../components/ui/DataTable";
import ElectionFilters from "./ElectionFilters";
import Card from "../../components/ui/Card";

const columns = [
  {
    accessorKey: "name",
    header: "ELECTION NAME",
  },

  {
    accessorKey: "dates",
    header: "DATES",
    cell: ({ row }) => (
      <div className="space-y-1">
        <p>{row.original.startDate}</p>
        <p>{row.original.endDate}</p>
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: "STATUS",
    filterFn: "equals",
    cell: ({ row }) => {
      const status = row.original.status;

      const styles = {
        live: "bg-blue-50 text-blue-600 border-blue-500",
        upcoming: "bg-orange-50 text-orange-600 border-orange-500",
        completed: "bg-green-50 text-green-600 border-green-500",
      };

      return (
        <div className="space-y-2">
          <span
            className={`inline-flex rounded-md border px-3 py-1 text-xs font-semibold uppercase ${styles[status]}`}
          >
            {status}
          </span>

          <p className="text-xs text-slate-500">{row.original.statusMessage}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "turnout",
    header: "VOTER TURNOUT",
    cell: ({ row }) => (
      <div className="w-40">
        <p className="font-semibold">{row.original.turnout}%</p>

        <p className="mb-2 text-xs text-slate-500">
          {row.original.votes}/{row.original.totalVoters} votes
        </p>

        <div className="h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-600"
            style={{
              width: `${row.original.turnout}%`,
            }}
          />
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: ({ row }) => {
      const isEditable = row.original.status === "upcoming";

      return (
        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            <Eye size={16} />
          </button>

          <button
            disabled={!isEditable}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border
            ${
              isEditable
                ? "border-slate-200 hover:bg-slate-50"
                : "cursor-not-allowed border-slate-200 opacity-40"
            }`}
          >
            <Pencil size={16} />
          </button>

          <button
            disabled={!isEditable}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border
            ${
              isEditable
                ? "border-red-200 text-red-500 hover:bg-red-50"
                : "cursor-not-allowed border-red-200 text-red-500 opacity-40"
            }`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];

const data = [
  {
    id: 1,
    name: "2026 Student Council Elections",
    startDate: "May 15, 2026 8:00 AM",
    endDate: "May 15, 2026 2:00 PM",
    status: "live",
    statusMessage: "2h 32m remaining",
    turnout: 78,
    votes: 987,
    totalVoters: 1250,
  },
  {
    id: 2,
    name: "2025 Student Council Elections",
    startDate: "May 15, 2025 8:00 AM",
    endDate: "May 15, 2025 2:00 PM",
    status: "completed",
    statusMessage: "Ended May 15",
    turnout: 92,
    votes: 1150,
    totalVoters: 1250,
  },
  {
    id: 3,
    name: "2027 Student Council Elections",
    startDate: "May 15, 2027 8:00 AM",
    endDate: "May 15, 2027 2:00 PM",
    status: "upcoming",
    statusMessage: "Starts in 12 days",
    turnout: 0,
    votes: 0,
    totalVoters: 1250,
  },
];
function ElectionsTable() {
  const [columnFilters, setColumnFilters] = useState([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <Card className="space-y-4  p-5 border-white/10">
      <ElectionFilters table={table} />

      <DataTable table={table} />
    </Card>
  );
}

export default ElectionsTable;
