import { useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import useDashboard from "../../hooks/useDashboard";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import ProgressCard from "../../components/voter/results/ProgressCard";
import ProfileImg from "../../components/ui/ProfileImg";
import Divider from "../../components/ui/Divider";
import { IoMdAdd } from "react-icons/io";
import { IoPersonAdd, IoPersonAddOutline } from "react-icons/io5";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuClipboardList } from "react-icons/lu";
import VoterTurnoutChart from "../../components/common/VoterTurnoutChart";
import CandidatesByPositionChart from "../../components/common/CandidatesByPositionChart";
import {
  getElections,
  getElectionCandidates,
  getElectionParticipants,
  getElectionStatus,
  formatElectionDate,
} from "../../api/organisationApi";

const actions = [
  {
    icon: IoMdAdd,
    actionName: "Create new election",
    link: "/organisation/elections/create",
  },
  {
    icon: IoPersonAdd,
    actionName: "Add Candidates",
    link: "/organisation/candidates",
  },
  {
    icon: IoPersonAddOutline,
    actionName: "Add Member",
    link: "/organisation/voters",
  },
  {
    icon: IoCloudUploadOutline,
    actionName: "Upload Voters",
    link: "/organisation/voters",
  },
  {
    icon: LuClipboardList,
    actionName: "View Results",
    link: "/organisation/results",
  },
];

function OrganisationDashboardPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Welcome Back");
    setSubtitle("Here is what is happening with your elections");
  }, [setPageTitle, setSubtitle]);

  // ── Elections list ────────────────────────────────────────────────────────
  const {
    data: elections = [],
    isLoading: electionsLoading,
    isError: electionsError,
  } = useQuery({
    queryKey: ["elections"],
    queryFn: getElections,
  });

  const liveElection = elections.find((e) => getElectionStatus(e) === "live");
  const activeCount = elections.filter(
    (e) => getElectionStatus(e) === "live",
  ).length;

  // Most recent completed election — fallback for charts when nothing is live
  const mostRecentCompleted = [...elections]
    .filter((e) => getElectionStatus(e) === "completed")
    .sort((a, b) => new Date(b.date_time_ending) - new Date(a.date_time_ending))[0] ?? null;

  // Chart election: live takes priority, then most recent completed
  const chartElection = liveElection ?? mostRecentCompleted ?? null;

  // ── Candidates for chart election (for "by position" doughnut) ───────────
  const { data: chartCandidates = [] } = useQuery({
    queryKey: ["candidates", chartElection?.id],
    queryFn: () => getElectionCandidates(chartElection.id),
    enabled: !!chartElection,
  });

  // Dashboard stat card uses live election candidates only
  const liveCandidates =
    liveElection?.id === chartElection?.id ? chartCandidates : [];

  // ── Participants for ALL elections (for turnout comparison bar chart) ─────
  const allParticipantQueries = useQueries({
    queries: elections.map((e) => ({
      queryKey: ["participants", e.id],
      queryFn: () => getElectionParticipants(e.id),
    })),
  });

  // Live election participants for stat cards
  const liveIdx = elections.findIndex((e) => e.id === liveElection?.id);
  const participants = liveIdx >= 0 ? (allParticipantQueries[liveIdx]?.data ?? []) : [];
  const votesCast = participants.filter((p) => p.has_voted).length;
  const totalVoters = participants.length;

  // ── Derived chart data ────────────────────────────────────────────────────

  // Voter turnout per election
  const turnoutChartData = elections.map((e, i) => {
    const parts = allParticipantQueries[i]?.data ?? [];
    const voted = parts.filter((p) => p.has_voted).length;
    const total = parts.length;
    return {
      election: e.name,
      turnout: total > 0 ? Math.round((voted / total) * 100) : 0,
    };
  });

  // Candidates grouped by position for the chart election
  const candidatesByPosition = Object.entries(
    chartCandidates.reduce((acc, c) => {
      const pos = c.position?.name ?? `Position #${c.position_id}`;
      acc[pos] = (acc[pos] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([position, count]) => ({ position, count }));

  // ── Dashboard stat cards ──────────────────────────────────────────────────
  const dashboardStats = [
    {
      title: "Active Elections",
      value: electionsLoading ? "…" : activeCount,
      link: "/organisation/elections",
      sub: "View all elections",
    },
    {
      title: "Total Candidates",
      value: liveElection ? liveCandidates.length : "—",
      link: "/organisation/candidates",
      sub: liveElection ? "In current election" : "No active election",
    },
    {
      title: "Enrolled Voters",
      value: liveElection ? totalVoters : "—",
      link: "/organisation/voters",
      sub: liveElection ? "In current election" : "No active election",
    },
    {
      title: "Votes Cast",
      value: liveElection ? votesCast : "—",
      link: "/organisation/results",
      sub: liveElection ? "In current election" : "No active election",
    },
  ];

  if (electionsError) {
    return (
      <div className="p-8">
        <p className="text-error">
          Failed to load dashboard data. Please refresh.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 flex flex-col gap-6 sm:gap-8">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {dashboardStats.map((stat) => (
          <Card
            key={stat.title}
            className="border-white/10 flex flex-col gap-2 p-3 rounded-lg"
          >
            <h1 className="font-medium text-muted text-sm">{stat.title}</h1>
            <p className="text-xl sm:text-2xl font-bold text-text">
              {stat.value}
            </p>
            <Link
              to={stat.link}
              className="flex items-center text-xs sm:text-sm gap-2 text-primary hover:underline underline-offset-2 w-fit"
            >
              {stat.sub}
              <FaArrowRightLong />
            </Link>
          </Card>
        ))}
      </div>

      {/* section 2 */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* live election card */}
        <Card className="border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col gap-5 flex-1">
          <h1 className="text-text text-lg font-bold">Current Live Election</h1>

          {electionsLoading ? (
            <p className="text-muted">Loading...</p>
          ) : liveElection ? (
            <>
              <div className="flex gap-4">
                <ProfileImg className="w-16 h-16 sm:w-20 sm:h-20 p-2 shrink-0" />

                <div className="flex flex-col gap-2 min-w-0">
                  <h1 className="text-primary font-medium leading-tight">
                    {liveElection.name}
                  </h1>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <h4 className="text-muted text-xs">Start Date</h4>
                      <p className="text-text text-sm">
                        {formatElectionDate(liveElection.date_time_occuring)}
                      </p>
                    </div>
                    <Divider />
                    <div>
                      <h4 className="text-muted text-xs">End Date</h4>
                      <p className="text-text text-sm">
                        {formatElectionDate(liveElection.date_time_ending)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ProgressCard
                title="Voter Turnout"
                current={votesCast}
                total={totalVoters || 1}
              />

              <Link
                to="/organisation/elections"
                className="flex items-center gap-2 text-primary bg-primary/12 w-fit border border-primary rounded px-3 py-1 hover:underline underline-offset-2 text-sm"
              >
                View election details <FaArrowRightLong />
              </Link>
            </>
          ) : (
            <p className="text-muted">No live election at the moment.</p>
          )}
        </Card>

        {/* quick actions */}
        <Card className="border-white/10 rounded-2xl flex flex-col gap-3 p-5 lg:w-80 shrink-0">
          <h1 className="font-bold text-lg text-text">Quick Actions</h1>
          {actions.map((action) => (
            <Link
              key={action.actionName}
              to={action.link}
              className="hover:shadow-primary/12 hover:shadow rounded-lg transition-all duration-300 ease-in-out"
            >
              <Card className="border-white/10 flex items-center rounded-xl p-3 justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 bg-primary flex items-center justify-center rounded shrink-0">
                    <action.icon className="text-white text-lg" />
                  </div>
                  <p className="text-sm sm:text-base text-text">
                    {action.actionName}
                  </p>
                </div>
                <FaArrowRightLong className="text-muted shrink-0" />
              </Card>
            </Link>
          ))}
        </Card>
      </div>

      {/* section 3 — charts */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <VoterTurnoutChart data={turnoutChartData} />
        <CandidatesByPositionChart
          positions={candidatesByPosition}
          isLive={!!liveElection}
          electionName={chartElection?.name ?? ""}
        />
      </div>
    </div>
  );
}

export default OrganisationDashboardPage;
