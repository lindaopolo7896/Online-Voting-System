import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import CandidateFilters from "./CandidateFilters";
import DataTable from "../../components/ui/DataTable";
import { Eye, Pencil, MoreVertical } from "lucide-react";

const columns = [
  {
    accessorKey: "name",
    header: "CANDIDATE",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.avatar}
          alt={row.original.name}
          className="h-12 w-12 rounded-full object-cover"
        />

        <div>
          <p className="font-medium">{row.original.name}</p>

          <p className="text-sm text-slate-500">{row.original.email}</p>

          <p className="text-sm text-slate-500">{row.original.phone}</p>
        </div>
      </div>
    ),
  },

  {
    accessorKey: "election",
    header: "ELECTION",
    filterFn: "equals",
  },
  {
    accessorKey: "position",
    header: "POSITION",
    filterFn: "equals",
  },
  {
    accessorKey: "status",
    header: "STATUS",
    filterFn: "equals",
    cell: ({ row }) => {
      const status = row.original.status;

      const styles = {
        approved: "bg-green-50 border-green-500 text-green-600",

        pending: "bg-orange-50 border-orange-500 text-orange-600",

        rejected: "bg-red-50 border-red-500 text-red-600",
      };

      return (
        <span
          className={`inline-flex min-w-[110px] justify-center rounded-md border px-3 py-1 text-xs font-semibold uppercase ${styles[status]}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "ACTIONS",
    cell: () => (
      <div className="flex items-center gap-2">
        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <Eye size={16} />
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <Pencil size={16} />
        </button>

        <button className="flex h-8 w-8 items-center justify-center rounded border border-slate-200 hover:bg-slate-50">
          <MoreVertical size={16} />
        </button>
      </div>
    ),
  },
];

const data = [
  {
    id: 1,
    avatar: "https://i.pravatar.cc/150?img=1",
    name: "Elijah Kitaka",
    email: "elijahkitaka@gmail.com",
    phone: "0712345678",
    election: "2026 Student Council Elections",
    position: "President",
    status: "approved",
  },

  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "Sarah Njeri",
    email: "sarah@gmail.com",
    phone: "0711111111",
    election: "2026 Student Council Elections",
    position: "Vice President",
    status: "approved",
  },

  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "John Mwangi",
    email: "john@gmail.com",
    phone: "0722222222",
    election: "2026 Student Council Elections",
    position: "President",
    status: "rejected",
  },

  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Grace Wanjiru",
    email: "grace@gmail.com",
    phone: "0733333333",
    election: "2026 Student Council Elections",
    position: "President",
    status: "pending",
  },
];

function CandidatesTable() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [search, setSearch] = useState("");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* <CandidateFilters table={table} search={search} setSearch={setSearch} /> */}

      <DataTable table={table} />
    </div>
  );
}

export default CandidatesTable;
