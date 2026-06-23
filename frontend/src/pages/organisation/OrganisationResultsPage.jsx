import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useDashboard from "../../hooks/useDashboard";
import Card from "../../components/ui/Card";
import {
  getElections,
  getElectionCandidates,
  getElectionParticipants,
  getElectionStatus,
  formatElectionDate,
} from "../../api/organisationApi";

function StatusBadge({ status }) {
  const styles = {
    live: "bg-blue-500/12 text-blue-500 border-blue-500/20",
    upcoming: "bg-yellow-500/12 text-yellow-500 border-yellow-500/20",
    completed: "bg-green-500/12 text-green-500 border-green-500/20",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded border text-xs font-semibold uppercase ${styles[status] ?? ""}`}
    >
      {status}
    </span>
  );
}

function ElectionResultCard({ election, onClick, isSelected }) {
  const status = getElectionStatus(election);
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl border p-4 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/8"
          : "border-white/10 bg-surface hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="text-text font-semibold text-sm leading-tight">{election.name}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-muted text-xs">
        {formatElectionDate(election.date_time_occuring)} – {formatElectionDate(election.date_time_ending)}
      </p>
    </button>
  );
}

function ResultsDetail({ election }) {
  const { data: candidates = [], isLoading: candidatesLoading } = useQuery({
    queryKey: ["candidates", election.id],
    queryFn: () => getElectionCandidates(election.id),
  });

  const { data: participants = [], isLoading: participantsLoading } = useQuery({
    queryKey: ["participants", election.id],
    queryFn: () => getElectionParticipants(election.id),
  });

  const status = getElectionStatus(election);
  const voted = participants.filter((p) => p.has_voted).length;
  const total = participants.length;
  const turnout = total > 0 ? Math.round((voted / total) * 100) : 0;

  // Group candidates by position
  const byPosition = candidates.reduce((acc, c) => {
    const pos = c.position?.name ?? `Position #${c.position_id}`;
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(c);
    return acc;
  }, {});

  const isLoading = candidatesLoading || participantsLoading;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-text text-xl font-bold">{election.name}</h2>
          <p className="text-muted text-sm">
            {formatElectionDate(election.date_time_occuring)} – {formatElectionDate(election.date_time_ending)}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Voters", value: total || "—" },
          { label: "Votes Cast", value: voted || "—" },
          { label: "Turnout", value: total ? `${turnout}%` : "—" },
          { label: "Positions", value: Object.keys(byPosition).length || "—" },
        ].map((s) => (
          <Card key={s.label} className="border-white/10 p-4 rounded-xl flex flex-col gap-1">
            <p className="text-muted text-xs">{s.label}</p>
            <p className="text-primary text-2xl font-bold">{isLoading ? "…" : s.value}</p>
          </Card>
        ))}
      </div>

      {/* Turnout bar */}
      {!isLoading && total > 0 && (
        <Card className="border-white/10 p-4 rounded-xl">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-text font-medium">Voter Turnout</span>
            <span className="text-primary font-bold">{turnout}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${turnout}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-1">{voted} of {total} voters have voted</p>
        </Card>
      )}

      {/* Results by position */}
      {isLoading ? (
        <p className="text-muted text-sm">Loading results...</p>
      ) : Object.keys(byPosition).length === 0 ? (
        <Card className="border-white/10 p-6 rounded-xl text-center">
          <p className="text-muted">No candidates registered for this election yet.</p>
        </Card>
      ) : (
        Object.entries(byPosition).map(([position, positionCandidates]) => {
          const totalVotesForPos = positionCandidates.reduce((s, c) => s + (c.votes ?? 0), 0);
          const sorted = [...positionCandidates].sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
          return (
            <Card key={position} className="border-white/10 p-4 rounded-xl">
              <h3 className="text-text font-semibold mb-3">{position}</h3>
              <div className="flex flex-col gap-3">
                {sorted.map((c, i) => {
                  const votes = c.votes ?? 0;
                  const pct = totalVotesForPos > 0 ? Math.round((votes / totalVotesForPos) * 100) : 0;
                  return (
                    <div key={c.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className={`text-text font-medium ${i === 0 && status === "completed" ? "text-primary" : ""}`}>
                          {i === 0 && status === "completed" ? "👑 " : ""}{c.membership?.user?.first_name ?? ""} {c.membership?.user?.last_name ?? `Candidate #${c.id}`}
                        </span>
                        <span className="text-muted">{totalVotesForPos > 0 ? `${votes} votes · ${pct}%` : "No votes yet"}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/10">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${i === 0 ? "bg-primary" : "bg-white/30"}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
}

function OrganisationResultsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Results");
    setSubtitle("View election results and voter turnout");
  }, [setPageTitle, setSubtitle]);

  const { data: elections = [], isLoading, isError } = useQuery({
    queryKey: ["elections"],
    queryFn: getElections,
  });

  const [selectedId, setSelectedId] = useState(null);

  // Auto-select the first live or most recent completed election
  useEffect(() => {
    if (elections.length > 0 && !selectedId) {
      const live = elections.find((e) => getElectionStatus(e) === "live");
      const completed = [...elections]
        .filter((e) => getElectionStatus(e) === "completed")
        .sort((a, b) => new Date(b.date_time_ending) - new Date(a.date_time_ending))[0];
      setSelectedId((live ?? completed ?? elections[0])?.id ?? null);
    }
  }, [elections, selectedId]);

  const selectedElection = elections.find((e) => e.id === selectedId) ?? null;

  if (isLoading) {
    return (
      <div className="p-8">
        <p className="text-muted">Loading elections...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <p className="text-error">Failed to load elections. Please refresh.</p>
      </div>
    );
  }

  if (elections.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center gap-4 text-center">
        <p className="text-muted text-lg">No elections found.</p>
        <p className="text-muted text-sm">Create your first election to see results here.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col lg:flex-row gap-6">
      {/* Sidebar: election list */}
      <div className="flex flex-col gap-3 lg:w-72 shrink-0">
        <h2 className="text-text font-semibold">All Elections</h2>
        {elections.map((e) => (
          <ElectionResultCard
            key={e.id}
            election={e}
            isSelected={e.id === selectedId}
            onClick={() => setSelectedId(e.id)}
          />
        ))}
      </div>

      {/* Main: results detail */}
      <div className="flex-1 min-w-0">
        {selectedElection ? (
          <ResultsDetail election={selectedElection} />
        ) : (
          <p className="text-muted">Select an election to view results.</p>
        )}
      </div>
    </div>
  );
}

export default OrganisationResultsPage;
