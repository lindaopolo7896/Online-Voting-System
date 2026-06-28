import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Vote,
  Users,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import useDashboard from "@/hooks/useDashboard";
import Card from "@/components/ui/Card";
import {
  getElections,
  getElectionCandidates,
  getElectionParticipants,
  getMemberships,
  getElectionStatus,
} from "@/api/organisationApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

const PALETTE = [
  "#144DEF",
  "#10B981",
  "#F59E0B",
  "#7C3AED",
  "#06B6D4",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
];

const STATUS_COLORS = {
  live: "#144DEF",
  upcoming: "#F59E0B",
  completed: "#10B981",
};

function KpiCard({ icon: Icon, label, value, sub }) {
  return (
    <Card className="border-white/10 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <p className="text-muted text-sm font-medium">{label}</p>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/12 shrink-0">
          <Icon size={16} className="text-primary" />
        </div>
      </div>
      <p className="text-2xl font-bold text-text">{value}</p>
      {sub && <p className="text-muted text-xs">{sub}</p>}
    </Card>
  );
}

function DoughnutCard({ title, subtitle, segments }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const hasData = total > 0;

  const chartData = {
    labels: segments.map((s) => s.label),
    datasets: [
      {
        data: segments.map((s) => s.value),
        backgroundColor: segments.map((s) => s.color),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: { legend: { display: false } },
  };

  return (
    <Card className="border-white/10 rounded-xl p-5 sm:p-6 flex-1 flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold text-text">{title}</h2>
        {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
      </div>

      {hasData ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48 shrink-0">
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-text">{total}</span>
              <span className="text-xs text-muted">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap sm:flex-col gap-3 w-full">
            {segments.map((s) => (
              <div key={s.label} className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-sm text-muted truncate capitalize">
                  {s.label}
                </span>
                <span className="text-sm font-semibold text-text ml-auto pl-2">
                  {s.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center py-8">
          <p className="text-muted text-sm">No data available yet.</p>
        </div>
      )}
    </Card>
  );
}

function OrganisationAnalyticsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Analytics");
    setSubtitle("Insights across all your elections and members");
  }, [setPageTitle, setSubtitle]);

  const {
    data: elections = [],
    isLoading: electionsLoading,
    isError: electionsError,
  } = useQuery({ queryKey: ["elections"], queryFn: getElections });

  const { data: memberships = [] } = useQuery({
    queryKey: ["memberships"],
    queryFn: () => getMemberships(),
  });

  const participantQueries = useQueries({
    queries: elections.map((e) => ({
      queryKey: ["participants", e.id],
      queryFn: () => getElectionParticipants(e.id),
    })),
  });

  const candidateQueries = useQueries({
    queries: elections.map((e) => ({
      queryKey: ["candidates", e.id],
      queryFn: () => getElectionCandidates(e.id),
    })),
  });

  // Per-election aggregates
  const electionRows = useMemo(
    () =>
      elections.map((e, i) => {
        const parts = participantQueries[i]?.data ?? [];
        const total = parts.length;
        const voted = parts.filter((p) => p.has_voted).length;
        const turnout = total > 0 ? Math.round((voted / total) * 100) : 0;
        const candidates = candidateQueries[i]?.data ?? [];
        return {
          id: e.id,
          name: e.name,
          status: getElectionStatus(e),
          total,
          voted,
          turnout,
          candidates: candidates.length,
        };
      }),
    [elections, participantQueries, candidateQueries],
  );

  // KPIs
  const totalVotesCast = electionRows.reduce((s, r) => s + r.voted, 0);
  const totalEnrolled = electionRows.reduce((s, r) => s + r.total, 0);
  const avgTurnout =
    totalEnrolled > 0 ? Math.round((totalVotesCast / totalEnrolled) * 100) : 0;

  // Turnout comparison (only elections that have voters)
  const turnoutRows = electionRows.filter((r) => r.total > 0);
  const turnoutChart = {
    labels: turnoutRows.map((r) => r.name),
    datasets: [
      {
        label: "Voter Turnout (%)",
        data: turnoutRows.map((r) => r.turnout),
        backgroundColor: "#144DEF",
        borderRadius: 6,
      },
    ],
  };
  const turnoutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `${ctx.raw}%` } },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: (v) => `${v}%` },
        grid: { color: "rgba(148,163,184,0.2)" },
      },
      x: { grid: { display: false } },
    },
  };

  // Election status breakdown
  const statusSegments = ["live", "upcoming", "completed"]
    .map((status) => ({
      label: status,
      value: electionRows.filter((r) => r.status === status).length,
      color: STATUS_COLORS[status],
    }))
    .filter((s) => s.value > 0);

  // Members by role
  const roleCounts = useMemo(() => {
    const counts = {};
    memberships.forEach((m) => {
      const role = m.role ?? "member";
      counts[role] = (counts[role] ?? 0) + 1;
    });
    return counts;
  }, [memberships]);

  const roleSegments = Object.entries(roleCounts).map(([role, value], i) => ({
    label: role,
    value,
    color: PALETTE[i % PALETTE.length],
  }));

  if (electionsError) {
    return (
      <div className="p-8">
        <p className="text-error">Failed to load analytics. Please refresh.</p>
      </div>
    );
  }

  if (electionsLoading) {
    return (
      <div className="p-8">
        <p className="text-muted">Loading analytics…</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-6">
      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          icon={Vote}
          label="Total Elections"
          value={elections.length}
          sub={`${statusSegments.find((s) => s.label === "live")?.value ?? 0} live now`}
        />
        <KpiCard
          icon={Users}
          label="Total Members"
          value={memberships.length}
          sub={`${roleCounts.official ?? 0} officials`}
        />
        <KpiCard
          icon={CheckCircle2}
          label="Total Votes Cast"
          value={totalVotesCast}
          sub={`of ${totalEnrolled} enrolled`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Average Turnout"
          value={`${avgTurnout}%`}
          sub="Across all elections"
        />
      </div>

      {/* Turnout comparison */}
      <Card className="border-white/10 rounded-xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-text mb-6">
          Voter Turnout Comparison
        </h2>
        {turnoutRows.length > 0 ? (
          <div className="h-[240px] sm:h-[320px]">
            <Bar data={turnoutChart} options={turnoutOptions} />
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted text-sm">
              No voter data yet. Enroll voters in an election to see turnout.
            </p>
          </div>
        )}
      </Card>

      {/* Breakdowns */}
      <div className="flex flex-col lg:flex-row gap-6">
        <DoughnutCard
          title="Elections by Status"
          subtitle="Distribution across the lifecycle"
          segments={statusSegments}
        />
        <DoughnutCard
          title="Members by Role"
          subtitle="How your organisation is composed"
          segments={roleSegments}
        />
      </div>

      {/* Per-election table */}
      <Card className="border-white/10 rounded-xl p-5 sm:p-6">
        <h2 className="text-xl font-bold text-text mb-4">
          Election Breakdown
        </h2>
        {electionRows.length === 0 ? (
          <p className="text-muted text-sm py-6 text-center">
            No elections to analyse yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted">
                  <th className="py-2 pr-4 font-semibold">Election</th>
                  <th className="py-2 pr-4 font-semibold">Status</th>
                  <th className="py-2 pr-4 font-semibold">Candidates</th>
                  <th className="py-2 pr-4 font-semibold">Voters</th>
                  <th className="py-2 pr-4 font-semibold">Votes</th>
                  <th className="py-2 font-semibold w-40">Turnout</th>
                </tr>
              </thead>
              <tbody>
                {electionRows.map((r) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="py-3 pr-4 font-medium text-text">{r.name}</td>
                    <td className="py-3 pr-4">
                      <span
                        className="inline-flex px-2 py-0.5 rounded text-xs font-semibold capitalize"
                        style={{
                          backgroundColor: `${STATUS_COLORS[r.status]}1f`,
                          color: STATUS_COLORS[r.status],
                        }}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-text">{r.candidates}</td>
                    <td className="py-3 pr-4 text-text">{r.total}</td>
                    <td className="py-3 pr-4 text-text">{r.voted}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${r.turnout}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-text w-9 text-right">
                          {r.turnout}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default OrganisationAnalyticsPage;
