import { Search } from "lucide-react";

function VoterFilters({
  search,
  setSearch,
  elections = [],
  selectedElectionId,
  onElectionChange,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Election filter — parent-controlled */}
      <select
        value={selectedElectionId ?? ""}
        onChange={(e) =>
          onElectionChange(e.target.value ? parseInt(e.target.value, 10) : null)
        }
        className="h-10 rounded-lg border border-border bg-surface px-3 text-sm text-text focus:outline-none focus:border-primary"
      >
        <option value="">All Elections</option>
        {elections.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>

      {/* Role filter — column-level (passed as prop when needed) */}

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
          className="h-10 w-64 rounded-lg border border-border bg-surface pl-9 pr-4 text-sm text-text placeholder:text-muted/50 focus:outline-none focus:border-primary"
        />
      </div>
    </div>
  );
}

export default VoterFilters;
