import { ChevronDown, Plus } from "lucide-react";
import { Link } from "react-router-dom";

function ElectionFilters({ table }) {
  return (
    <div className="mb-6 flex items-start justify-between">
      <div>
        <h2 className="text-2xl font-bold text-text">All Elections</h2>

        <p className="mt-1 text-sm text-muted">
          Manage and monitor all elections
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <select
            value={table.getColumn("status")?.getFilterValue() ?? ""}
            onChange={(e) =>
              table
                .getColumn("status")
                ?.setFilterValue(e.target.value || undefined)
            }
            className="h-11 rounded-lg border border-white/10 bg-surface px-4 pr-10 shadow-sm outline-none text-text"
          >
            <option value="">All Statuses</option>
            <option value="live">Live</option>
            <option value="upcoming">Upcoming</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <Link
          to="/organization/elections/create"
          className="flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-white shadow transition-all duration-300 hover:bg-primary/90"
        >
          <Plus size={18} />
          Create Election
        </Link>
      </div>
    </div>
  );
}

export default ElectionFilters;
