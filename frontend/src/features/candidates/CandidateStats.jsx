import Card from "../../components/ui/Card";

const stats = [
  {
    title: "Total Candidates",
    value: 24,
    subtitle: "Across all elections",
  },
  {
    title: "Approved",
    value: 18,
    subtitle: "75% of total",
  },
  {
    title: "Pending Review",
    value: 4,
    subtitle: "16.7% of total",
  },
  {
    title: "Rejected",
    value: 2,
    subtitle: "8.3% of total",
  },
];

function CandidateStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="rounded-xl border border-white/10 p-3"
        >
          <h3 className="text-lg font-medium text-muted ">{stat.title}</h3>

          <p className="mt-2 text-4xl font-bold text-text">{stat.value}</p>

          <p className="mt-2 text-sm text-muted">{stat.subtitle}</p>
        </Card>
      ))}
    </div>
  );
}

export default CandidateStats;
