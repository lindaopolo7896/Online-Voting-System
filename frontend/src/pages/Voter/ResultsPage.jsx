import { useEffect } from "react";
import { useQuery, useQueries } from "@tanstack/react-query";
import ElectionList from "../../components/voter/results/ElectionList";
import VoteIcon from "../../assets/icons/vote.png";
import VoterIcon from "../../assets/icons/voter.png";
import TickIcon from "../../assets/icons/tick.png";
import Card from "../../components/ui/Card";
import useDashboard from "../../hooks/useDashboard";
import {
  getElections,
  getElectionParticipants,
  getElectionStatus,
  formatElectionDate,
} from "../../api/organisationApi";

function ResultsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Election Results");
    setSubtitle("Results for all elections registered");
  }, [setPageTitle, setSubtitle]);

  const { data: rawElections = [], isLoading } = useQuery({
    queryKey: ["elections"],
    queryFn: () => getElections(),
  });

  // Fetch participants per election to show voter counts
  const participantQueries = useQueries({
    queries: rawElections.map((e) => ({
      queryKey: ["election-participants", e.id],
      queryFn: () => getElectionParticipants(e.id),
    })),
  });

  // Normalize elections into the shape ElectionList expects
  const elections = rawElections.map((e, i) => {
    const parts = participantQueries[i]?.data ?? [];
    return {
      id: e.id,
      title: e.name,
      organization: e.organisation?.name ?? "",
      date: formatElectionDate(e.date_time_occuring),
      totalVoters: parts.length,
      votesCast: parts.filter((p) => p.has_voted).length,
      status: getElectionStatus(e),
    };
  });

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
