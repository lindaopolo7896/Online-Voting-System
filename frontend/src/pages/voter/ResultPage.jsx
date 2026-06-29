import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IoMdArrowRoundBack } from "react-icons/io";
import ProgressCard from "@/features/results/components/ProgressCard";
import ResultsTable from "@/features/results/components/ResultsTable";
import ElectionSummary from "@/features/results/components/ElectionSummary";
import Card from "@/components/ui/Card";
import {
  getElection,
  getElectionParticipants,
  getElectionCandidates,
  getElectionStatus,
  formatElectionDate,
} from "@/api/organisationApi";

function buildCategories(candidates) {
  const posMap = {};
  for (const c of candidates) {
    const posId = c.position?.id ?? 0;
    if (!posMap[posId]) {
      posMap[posId] = {
        id: posId,
        position: c.position?.name ?? "Unknown Position",
        results: [],
      };
    }
    const user = c.membership?.user ?? c.user;
    posMap[posId].results.push({
      candidate:
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
        "Unknown",
      // null = backend hasn't provided a tally yet; a number = real live count.
      votes: typeof c.vote_count === "number" ? c.vote_count : null,
      percentage: 0,
      image: user?.profile_picture ?? "",
    });
  }
  return Object.values(posMap).map((pos) => {
    const tallied = pos.results.some((r) => r.votes != null);
    const total = pos.results.reduce((s, r) => s + (r.votes ?? 0), 0);
    return {
      ...pos,
      tallied,
      results: pos.results
        .map((r) => ({
          ...r,
          percentage: total > 0 ? Math.round(((r.votes ?? 0) / total) * 100) : 0,
        }))
        .sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0)),
    };
  });
}

function computeDuration(start, end) {
  if (!start || !end) return "—";
  const diff = new Date(end) - new Date(start);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
}

function ResultPage() {
  const { id } = useParams();

  const { data: election, isLoading: electionLoading } = useQuery({
    queryKey: ["election", id],
    queryFn: () => getElection(id),
    enabled: !!id,
  });

  const { data: participants = [] } = useQuery({
    queryKey: ["election-participants", id],
    queryFn: () => getElectionParticipants(id),
    enabled: !!id,
  });

  const { data: candidates = [] } = useQuery({
    queryKey: ["election-candidates", id],
    queryFn: () => getElectionCandidates(id),
    enabled: !!id,
  });

  if (electionLoading || !election) {
    return (
      <div className="min-h-screen px-5 lg:px-10 pt-6 text-muted text-sm">
        Loading election…
      </div>
    );
  }

  const status = getElectionStatus(election);
  const votesCast = participants.filter((p) => p.has_voted).length;
  const totalVoters = participants.length;
  const turnoutRate =
    totalVoters > 0
      ? ((votesCast / totalVoters) * 100).toFixed(2)
      : "0.00";

  const categories = buildCategories(candidates);
  const positions = categories.map((c) => c.position);

  const statusColor = {
    live: "border-[#144DEF]/10 text-[#144DEF] bg-[#144DEF]/12",
    completed: "text-[#249D56] bg-[#249D56]/12 border-[#249D56]/10",
    upcoming: "text-[#7B8721] border-[#7B8721]/10 bg-[#7B8721]/12",
  };

  return (
    <div className="min-h-screen px-5 lg:px-10 pt-3 pb-5">
      {/* Header */}
      <div>
        <Link
          to="/voter/results"
          className="text-[#144DEF] flex items-center gap-2 hover:underline underline-offset-4 transition-all duration-300 ease-in-out w-fit"
        >
          <IoMdArrowRoundBack />
          Back to results
        </Link>

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <h1 className="text-text text-2xl font-bold">{election.name}</h1>
          <div
            className={`border p-1 flex items-center justify-center rounded-lg px-3 font-semibold text-sm ${
              statusColor[status] ?? statusColor.upcoming
            }`}
          >
            {status.toUpperCase()}
          </div>
        </div>

        <p className="text-muted mt-1">
          {status === "live"
            ? "Election is currently in progress"
            : status === "completed"
              ? `Held on ${formatElectionDate(election.date_time_occuring)}`
              : `Scheduled on ${formatElectionDate(election.date_time_occuring)}`}
        </p>
      </div>

      {/* Stats */}
      <div className="flex flex-col md:flex-row gap-4 py-8">
        <Card className="flex flex-1 border border-white/10 rounded-lg items-center gap-2 p-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Total Votes Cast</h1>
            <p className="text-[#144DEF] font-bold text-3xl">{votesCast}</p>
            <p className="text-muted">{turnoutRate}% of eligible voters</p>
          </div>
        </Card>

        <Card className="flex flex-1 border border-white/10 rounded-lg items-center gap-2 p-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Eligible Voters</h1>
            <p className="text-[#144DEF] font-bold text-3xl">{totalVoters}</p>
            <p className="text-muted">100%</p>
          </div>
        </Card>

        <Card className="flex flex-1 border border-white/10 bg-[#040A11] rounded-lg items-center gap-2 p-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Voter Turnout</h1>
            <p className="text-[#144DEF] font-bold text-3xl">{turnoutRate}%</p>
            <p
              className={
                Number(turnoutRate) >= 70
                  ? "text-[#249D56]"
                  : Number(turnoutRate) >= 50
                    ? "text-[#7B8721]"
                    : "text-red-500"
              }
            >
              {Number(turnoutRate) >= 90
                ? "Excellent"
                : Number(turnoutRate) >= 70
                  ? "Very Good"
                  : Number(turnoutRate) >= 50
                    ? "Good"
                    : "Poor"}
            </p>
          </div>
        </Card>

        <Card className="flex flex-1 border border-white/10 bg-[#040A11] rounded-lg items-center gap-2 p-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Positions</h1>
            <p className="text-[#144DEF] font-bold text-3xl">
              {categories.length}
            </p>
            <p className="text-muted text-sm truncate">
              {positions.join(", ") || "—"}
            </p>
          </div>
        </Card>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted text-sm py-8 text-center">
          No candidate results available for this election yet.
        </p>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-7">
          <div className="w-full lg:w-[700px]">
            <ProgressCard
              title="Overall Progress"
              current={votesCast}
              total={totalVoters || 1}
            />
            <ResultsTable
              title="Results by Position"
              subtitle="Live results update as votes are counted."
              categories={categories}
            />
          </div>

          <div className="flex flex-col gap-10">
            <ElectionSummary
              status={status}
              items={[
                { label: "Election Status", value: status },
                {
                  label: "Start Date",
                  value: formatElectionDate(election.date_time_occuring),
                },
                {
                  label: "End Date",
                  value: formatElectionDate(election.date_time_ending),
                },
                {
                  label: "Duration",
                  value: computeDuration(
                    election.date_time_occuring,
                    election.date_time_ending,
                  ),
                },
                { label: "Voting System", value: "Online" },
                status === "live"
                  ? {
                      label: "Summary Updated",
                      value: "Live in real-time",
                      valueColor: "text-[#144DEF]",
                    }
                  : {
                      label: "Result Published",
                      value:
                        status === "completed"
                          ? formatElectionDate(election.date_time_ending)
                          : "Pending",
                    },
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultPage;
