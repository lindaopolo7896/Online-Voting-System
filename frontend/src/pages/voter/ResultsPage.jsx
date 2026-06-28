import { useEffect } from "react";
import ElectionList from "@/features/results/components/ElectionList";
import VoteIcon from "@/assets/icons/vote.png";
import VoterIcon from "@/assets/icons/voter.png";
import TickIcon from "@/assets/icons/tick.png";
import Card from "@/components/ui/Card";
import useDashboard from "@/hooks/useDashboard";
import { useElectionResults } from "@/features/results/hooks/useElectionResults";

function ResultsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Election Results");
    setSubtitle("Results for all elections registered");
  }, [setPageTitle, setSubtitle]);

  const { elections, isLoading } = useElectionResults();

  const stats = [
    {
      id: 1,
      name: "Total Elections",
      count: elections.length,
      icon: VoteIcon,
    },
    {
      id: 2,
      name: "Live Elections",
      count: elections.filter((e) => e.status === "live").length,
      icon: TickIcon,
    },
    {
      id: 3,
      name: "Participated Elections",
      count: elections.filter((e) => e.status !== "upcoming").length,
      icon: VoterIcon,
    },
  ];

  if (isLoading) {
    return <div className="p-8 text-muted text-sm">Loading elections…</div>;
  }

  return (
    <div className="min-h-screen pb-5">
      <div className="mx-3 md:mx-10 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row justify-center gap-2 lg:gap-10 mt-5">
          {stats.map((analysis) => (
            <Card
              className="flex w-full gap-6 p-3 rounded-xl items-center font-medium border border-white/10"
              key={analysis.id}
            >
              <img src={analysis.icon} alt="" className="w-20" />
              <div>
                <p className="text-muted">{analysis.name.toUpperCase()}</p>
                <p className="text-[#144DEF] text-3xl">{analysis.count}</p>
              </div>
            </Card>
          ))}
        </div>
        <ElectionList elections={elections} />
      </div>
    </div>
  );
}

export default ResultsPage;
