import { useMemo } from "react";
import Card from "../../components/ui/Card";

function VoterStats({ participants = [] }) {
  const stats = useMemo(() => {
    const voters = participants.filter((p) => p.role === "participant" || !p.role);
    const total = voters.length;
    const voted = voters.filter((p) => p.has_voted).length;
    const linksSent = voters.filter((p) => !!p.voting_link).length;
    const pending = total - voted;

    const pct = (n) =>
      total > 0 ? `${Math.round((n / total) * 100)}% of total` : "No voters yet";

    return [
      { title: "Total Voters", value: total, subtitle: "Enrolled in this election" },
      { title: "Links Sent", value: linksSent, subtitle: pct(linksSent) },
      { title: "Votes Cast", value: voted, subtitle: pct(voted) },
      { title: "Pending", value: pending, subtitle: pct(pending) },
    ];
  }, [participants]);

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-xl border-white/10 p-5">
          <p className="text-sm text-muted">{stat.title}</p>
          <h3 className="mt-2 text-2xl font-bold text-text">{stat.value}</h3>
          <p className="mt-2 text-xs text-muted">{stat.subtitle}</p>
        </Card>
      ))}
    </div>
  );
}

export default VoterStats;
