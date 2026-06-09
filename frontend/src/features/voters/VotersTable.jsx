import { useState } from "react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Pencil, MoreVertical } from "lucide-react";

import DataTable from "../../components/ui/DataTable";
import VoterFilters from "./VoterFilters";

const columns = [
  {
    accessorKey: "name",
    header: "VOTER",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <img
          src={row.original.avatar}
          alt={row.original.name}
          className="h-12 w-12 rounded-full object-cover"
        />

        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },

  {
    accessorKey: "email",
    header: "EMAIL",
  },

  {
    accessorKey: "phone",
    header: "PHONE",
  },

  {
    accessorKey: "election",
    header: "ELECTION",
    filterFn: "equals",
  },

  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const styles = {
        active: "bg-green-50 border-green-500 text-green-600",
        inactive: "bg-red-50 border-red-500 text-red-600",
      };

      return (
        <span
          className={`inline-flex min-w-[90px] justify-center rounded-md border px-3 py-1 text-xs font-semibold uppercase ${styles[row.original.status]}`}
        >
          {row.original.status}
        </span>
      );
    },
  },

  {
    accessorKey: "linkStatus",
    header: "LINK STATUS",
    cell: ({ row }) => {
      const styles = {
        sent: "bg-green-50 border-green-500 text-green-600",
        voted: "bg-blue-50 border-blue-500 text-blue-600",
        not_sent: "bg-red-50 border-red-500 text-red-600",
      };

      return (
        <span
          className={`inline-flex min-w-[90px] justify-center rounded-md border px-3 py-1 text-xs font-semibold uppercase ${styles[row.original.linkStatus]}`}
        >
          {row.original.linkStatus.replace("_", " ")}
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
    status: "active",
    linkStatus: "sent",
  },

  {
    id: 2,
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "Sarah Njeri",
    email: "sarah@gmail.com",
    phone: "0711111111",
    election: "2026 Student Council Elections",
    status: "active",
    linkStatus: "voted",
  },

  {
    id: 3,
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "John Mwangi",
    email: "john@gmail.com",
    phone: "0722222222",
    election: "2026 Student Council Elections",
    status: "active",
    linkStatus: "not_sent",
  },

  {
    id: 4,
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Grace Wanjiru",
    email: "grace@gmail.com",
    phone: "0733333333",
    election: "2026 Student Council Elections",
    status: "active",
    linkStatus: "sent",
  },
];

function VotersTable() {
  const [columnFilters, setColumnFilters] = useState([]);
  const [search, setSearch] = useState("");

  const filteredData = data.filter(
    (voter) =>
      voter.name.toLowerCase().includes(search.toLowerCase()) ||
      voter.email.toLowerCase().includes(search.toLowerCase()),
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-4">
      <VoterFilters table={table} search={search} setSearch={setSearch} />

      <DataTable table={table} />
    </div>
  );
}

export default VotersTable;
