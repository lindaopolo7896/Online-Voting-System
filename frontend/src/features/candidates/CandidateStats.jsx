import { useMemo } from "react";
import Card from "../../components/ui/Card";

function CandidateStats({ candidates = [] }) {
  const stats = useMemo(() => {
    const total = candidates.length;
    const active = candidates.filter((c) => c.status === "active").length;
    const withdrawn = candidates.filter((c) => c.status === "withdrawn").length;
    const disqualified = candidates.filter((c) => c.status === "disqualified").length;

    const pct = (n) =>
      total > 0 ? `${Math.round((n / total) * 100)}% of total` : "No candidates yet";

    return [
      { title: "Total Candidates", value: total, subtitle: "Across all positions" },
      { title: "Active", value: active, subtitle: pct(active) },
      { title: "Withdrawn", value: withdrawn, subtitle: pct(withdrawn) },
      { title: "Disqualified", value: disqualified, subtitle: pct(disqualified) },
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
