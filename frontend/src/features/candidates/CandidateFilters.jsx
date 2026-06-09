import { Search, Download } from "lucide-react";

function CandidateFilters({ table, search, setSearch }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Election Filter */}
        <select className="h-11 rounded-lg border border-white/10 bg-surface px-4">
          <option>All Elections</option>
          <option>2026 Student Council Elections</option>
        </select>

        {/* Position Filter */}
        <select
          value={table.getColumn("position")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table
              .getColumn("position")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-11 rounded-lg border border-white/10 bg-surface px-4"
        >
          <option value="">All Positions</option>
          <option value="President">President</option>
          <option value="Vice President">Vice President</option>
        </select>

        {/* Status Filter */}
        <select
          value={table.getColumn("status")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table
              .getColumn("status")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-11 rounded-lg border border-white/10 bg-surface px-4"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-72 rounded-lg border border-white/10 bg-surface pl-10 pr-4 outline-none"
          />
        </div>
      </div>

      <button className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-white">
        <Download size={18} />
        Export
      </button>
    </div>
  );
}

export default CandidateFilters;
