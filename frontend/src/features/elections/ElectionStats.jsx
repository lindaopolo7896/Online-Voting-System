import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";

const stats = [
  {
    title: "Active Elections",
    value: 3,
    linkText: "View all elections",
    link: "/institution/elections",
  },
  {
    title: "Total Candidates",
    value: 24,
    linkText: "View all candidates",
    link: "/institution/candidates",
  },
  {
    title: "Total Voters",
    value: 1259,
    linkText: "View all voters",
    link: "/institution/voters",
  },
  {
    title: "Votes Cast",
    value: 987,
    linkText: "View all results",
    link: "/institution/results",
  },
];

function ElectionStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="rounded-xl border border-white/10 p-3 "
        >
          <h3 className="text-lg font-medium text-text-secondary text-muted">
            {stat.title}
          </h3>

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
