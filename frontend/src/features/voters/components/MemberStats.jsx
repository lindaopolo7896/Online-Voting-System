import { useMemo } from "react";
import Card from "@/components/ui/Card";

function MemberStats({ members = [] }) {
  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.is_active).length;
    const officials = members.filter((m) => m.role === "official").length;
    const admins = members.filter((m) => m.role === "admin").length;

    const pct = (n) =>
      total > 0 ? `${Math.round((n / total) * 100)}% of total` : "No members yet";

    return [
      { title: "Total Members", value: total,     subtitle: "In this organisation" },
      { title: "Active",        value: active,    subtitle: pct(active)            },
      { title: "Officials",     value: officials, subtitle: pct(officials)         },
      { title: "Admins",        value: admins,    subtitle: pct(admins)            },
    ];
  }, [members]);

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

export default MemberStats;
