import { useMemo } from "react";
import Card from "../../components/ui/Card";

function CandidateStats({ candidates = [] }) {
  const stats = useMemo(() => {
    const total = candidates.length;
    const approved = candidates.filter((c) => c.status === "approved").length;
    const pending = candidates.filter((c) => c.status === "pending").length;
    const rejected = candidates.filter((c) => c.status === "rejected").length;

    const pct = (n) =>
      total > 0 ? `${Math.round((n / total) * 100)}% of total` : "No candidates yet";

    return [
      { title: "Total Candidates", value: total, subtitle: "Across all positions" },
      { title: "Approved", value: approved, subtitle: pct(approved) },
      { title: "Pending Review", value: pending, subtitle: pct(pending) },
      { title: "Rejected", value: rejected, subtitle: pct(rejected) },
    ];
  }, [candidates]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-xl border border-white/10 p-3">
          <h3 className="text-lg font-medium text-muted">{stat.title}</h3>
          <p className="mt-2 text-4xl font-bold text-text">{stat.value}</p>
          <p className="mt-2 text-sm text-muted">{stat.subtitle}</p>
        </Card>
      ))}
    </div>
  );
}

export default CandidateStats;
