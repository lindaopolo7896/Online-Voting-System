import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { getElectionStatus } from "../../api/organisationApi";

function ElectionStats({ elections = [], participantQueries = [], isLoading }) {
  const activeCount = elections.filter(
    (e) => getElectionStatus(e) === "live",
  ).length;

  const totalVoters = participantQueries.reduce(
    (sum, q) => sum + (q.data?.length ?? 0),
    0,
  );

  const votesCast = participantQueries.reduce(
    (sum, q) => sum + (q.data?.filter((p) => p.has_voted).length ?? 0),
    0,
  );

  const stats = [
    {
      title: "Active Elections",
      value: isLoading ? "…" : activeCount,
      linkText: "View all elections",
      link: "/organisation/elections",
    },
    {
      title: "Total Elections",
      value: isLoading ? "…" : elections.length,
      linkText: "View all elections",
      link: "/organisation/elections",
    },
    {
      title: "Total Voters",
      value: isLoading ? "…" : totalVoters,
      linkText: "View all voters",
      link: "/organisation/voters",
    },
    {
      title: "Votes Cast",
      value: isLoading ? "…" : votesCast,
      linkText: "View all results",
      link: "/organisation/results",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="rounded-xl border border-white/10 p-3"
        >
          <h3 className="text-lg font-medium text-muted">{stat.title}</h3>
          <p className="mt-2 text-4xl font-bold text-text">{stat.value}</p>
          <Link
            to={stat.link}
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            {stat.linkText}
            <span>→</span>
          </Link>
        </Card>
      ))}
    </div>
  );
}

export default ElectionStats;
