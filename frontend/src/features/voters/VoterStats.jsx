import Card from "../../components/ui/Card";

const stats = [
  {
    title: "Total Voters",
    value: "2,898",
    subtitle: "Across all elections",
  },
  {
    title: "Links Sent",
    value: "1,896",
    subtitle: "60.9% of total",
  },
  {
    title: "Verified Voters",
    value: "1,896",
    subtitle: "60.9% of total",
  },
  {
    title: "Pending Verification",
    value: "1,002",
    subtitle: "40.1% of total",
  },
];

function VoterStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-xl border-white/10 p-5">
          <p className="text-sm text-slate-500">{stat.title}</p>

          <h3 className="mt-2 text-2xl font-bold">{stat.value}</h3>

          <p className="mt-2 text-xs text-slate-500">{stat.subtitle}</p>
        </Card>
      ))}
    </div>
  );
}

export default VoterStats;
