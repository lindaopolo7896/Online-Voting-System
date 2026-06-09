import { Link } from "react-router-dom";
import { Upload, Plus, Search } from "lucide-react";

function VoterFilters({ search, setSearch, table }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Upload Voters */}
        <button className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-white shadow">
          <Upload size={18} />
          Upload Voters
        </button>

        {/* Import CSV */}
        <button className="flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5">
          <Upload size={18} />
          Import from CSV
        </button>

        {/* Election Filter */}
        <select
          value={table.getColumn("election")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table
              .getColumn("election")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-11 rounded-lg border border-slate-200 bg-white px-4"
        >
          <option value="">All Elections</option>
          <option value="2026 Student Council Elections">
            2026 Student Council Elections
          </option>
          <option value="2025 Student Council Elections">
            2025 Student Council Elections
          </option>
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
            className="h-11 w-72 rounded-lg border border-slate-200 bg-white pl-10 pr-4 outline-none"
          />
        </div>
      </div>

      {/* Add Voter */}
      <Link
        to="/organization/voters/create"
        className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-white shadow"
      >
        <Plus size={18} />
        Add Voter
      </Link>
    </div>
  );
}

export default VoterFilters;
