import { Search, Download, UserPlus } from "lucide-react";

function CandidateFilters({
  table,
  search,
  setSearch,
  elections = [],
  selectedElectionId,
  onElectionChange,
  positions = [],
  onRegisterClick,
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Election filter — parent-controlled */}
        <select
          value={selectedElectionId ?? ""}
          onChange={(e) =>
            onElectionChange(e.target.value ? parseInt(e.target.value, 10) : null)
          }
          className="h-10 rounded-lg border border-white/10 bg-surface px-3 text-sm text-text focus:outline-none focus:border-primary"
        >
          <option value="">All Elections</option>
          {elections.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        {/* Position filter — column-level */}
        <select
          value={table.getColumn("position")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table
              .getColumn("position")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-lg border border-white/10 bg-surface px-3 text-sm text-text focus:outline-none focus:border-primary"
        >
          <option value="">All Positions</option>
          {positions.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {/* Status filter — column-level */}
        <select
          value={table.getColumn("status")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table
              .getColumn("status")
              ?.setFilterValue(e.target.value || undefined)
          }
          className="h-10 rounded-lg border border-white/10 bg-surface px-3 text-sm text-text focus:outline-none focus:border-primary"
        >
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        {/* Search */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
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
        {onRegisterClick && (
          <button
            onClick={onRegisterClick}
            className="flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm text-white hover:bg-primary/90 transition"
          >
            <UserPlus size={16} />
            Register Candidate
          </button>
        )}
        <button className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-surface px-4 text-sm text-text hover:bg-background transition">
          <Download size={16} />
          Export
        </button>
      </div>
    </div>
  );
}

export default CandidateFilters;
