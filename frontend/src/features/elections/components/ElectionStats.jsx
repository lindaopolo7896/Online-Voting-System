import Card from "@/components/ui/Card";
import { getElectionStatus } from "@/api/organisationApi";

function ElectionStats({ elections = [], isLoading }) {
  const total     = elections.length;
  const active    = elections.filter((e) => getElectionStatus(e) === "live").length;
  const upcoming  = elections.filter((e) => getElectionStatus(e) === "upcoming").length;
  const completed = elections.filter((e) => getElectionStatus(e) === "completed").length;

  const v = (n) => isLoading ? "…" : n;

  const stats = [
    { title: "Total Elections", value: v(total),     subtitle: "All time"           },
    { title: "Active",          value: v(active),    subtitle: "Currently live"     },
    { title: "Upcoming",        value: v(upcoming),  subtitle: "Scheduled"          },
    { title: "Completed",       value: v(completed), subtitle: "Finished elections" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="rounded-xl border border-white/10 p-5">
          <p className="text-sm text-muted">{stat.title}</p>
          <h3 className="mt-2 text-2xl font-bold text-text">{stat.value}</h3>
          <p className="mt-2 text-xs text-muted">{stat.subtitle}</p>
        </Card>
      ))}
    </div>
  );
}

export default ElectionStats;
