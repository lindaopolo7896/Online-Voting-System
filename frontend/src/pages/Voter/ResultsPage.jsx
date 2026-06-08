import ElectionList from "../../components/voter/results/ElectionList";
import VoteIcon from "../../assets/icons/vote.png";
import VoterIcon from "../../assets/icons/voter.png";
import TickIcon from "../../assets/icons/tick.png";
import { elections } from "../../mock/data";
import Card from "../../components/ui/Card";
import useDashboard from "../../hooks/useDashboard";
import { useEffect } from "react";

const data = [
  {
    id: 1,
    name: "Total Elections",
    count: 3,
    icon: VoteIcon,
  },
  {
    id: 2,
    name: "Live Elections",
    count: 1,
    icon: TickIcon,
  },
  {
    id: 3,
    name: "Participated Elections",
    count: 2,
    icon: VoterIcon,
  },
];

function ResultsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();

  useEffect(() => {
    setPageTitle("Election Results");
    setSubtitle("Results for all elections registered");
  }, []);
  return (
    <div className="min-h-screen pb-5">
      <div className="mx-3 md:mx-10 flex flex-col gap-8">
        <div className="flex flex-col lg:flex-row justify-center gap-2 lg:gap-10  mt-5">
          {data.map((analysis) => (
            <Card
              className="flex w-full  gap-6  p-3 rounded-xl items-center font-medium
            border border-white/10"
              key={analysis.id}
            >
              <img src={analysis.icon} alt="" className="w-20" />
              <div>
                <p className="text-muted">{analysis.name.toUpperCase()}</p>
                <p className="text-[#144DEF]  text-3xl">{analysis.count}</p>
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
