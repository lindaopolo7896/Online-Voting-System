import { elections } from "../../mock/data";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import ProgressCard from "../../components/voter/results/ProgressCard";
import ResultsTable from "../../components/voter/results/ResultsTable";
import VotesDistribution from "../../components/voter/results/VotesDistribution";
import ElectionSummary from "../../components/voter/results/ElectionSummary";
import Card from "../../components/ui/Card";

function ResultPage() {
  const { id } = useParams();

  const election = elections.find((e) => e.id === Number(id));

  const turnout_rate = (
    (election.votesCast / election.totalVoters) *
    100
  ).toFixed(2);

  const totalPositions = new Set(
    election.categories.map((category) => category.position),
  ).size;

  console.log(totalPositions);
  return (
    <div className="min-h-screen px-5 lg:px-10 pt-3 pb-5">
      <div>
        {/* left side  */}
        <div>
          <Link
            to="/voter/results"
            className="text-[#144DEF] flex items-center gap-2 hover:underline  underline-offset-4 transition-all duration-300 ease-in-out w-fit"
          >
            <IoMdArrowRoundBack />
            Back to results
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-text text-2xl font-bold">{election.title}</h1>
            <div
              className={`border p-1 flex items-center justify-center rounded-lg w-1/8  font-semibold ${election.status === "live" ? "border-[#144DEF]/10 text-[#144DEF] bg-[#144DEF]/12" : election.status === "completed" ? "text-[#249D56] bg-[#249D56]/12 border-[#249D56]/10" : "text-[#7B8721] border-[#7B8721]/10 bg-[#7B8721]/12"}`}
            >
              {election.status.toUpperCase()}
            </div>
          </div>
          <p className="text-muted">
            {election.status === "live"
              ? "Election is currently in progress"
              : election.status === "completed"
                ? `Held on ${election.date}`
                : `Scheduled on ${election.date}`}
          </p>
        </div>

        {/* right side  */}
        <div></div>
      </div>

      {/* stats  */}
      <div className="flex flex-col md:flex-row gap-4 py-8">
        {/* card 1  */}
        <Card className=" flex flex-1 border border-white/10  rounded-lg items-center gap-2 p-2">
          <div></div>
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Total Votes Cast</h1>
            <p className="text-[#144DEF] font-bold text-3xl">
              {election.votesCast}
            </p>
            <p className="text-muted">{turnout_rate}% of eligible voters</p>
          </div>
        </Card>

        {/* card 2  */}
        <Card className=" flex flex-1 border border-white/10  rounded-lg items-center gap-2 p-2">
          <div></div>
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Eligible Voters</h1>
            <p className="text-[#144DEF] font-bold text-3xl">
              {election.totalVoters}
            </p>
            <p className="text-muted">100% </p>
          </div>
        </Card>

        {/* card 3  */}
        <Card className=" flex flex-1 border border-white/10 bg-[#040A11] rounded-lg items-center gap-2 p-2">
          <div></div>
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Voter Turnout</h1>
            <p className="text-[#144DEF] font-bold text-3xl">{turnout_rate}</p>
            <p
              className={`${
                turnout_rate >= 70
                  ? "text-[#249D56]"
                  : turnout_rate >= 50
                    ? "text-[#7B8721]"
                    : "text-red-500"
              }`}
            >
              {turnout_rate >= 90
                ? "Excellent"
                : turnout_rate >= 70
                  ? "Very Good"
                  : turnout_rate >= 50
                    ? "Good"
                    : "Poor"}
            </p>
          </div>
        </Card>

        {/* card 4   */}
        <Card className=" flex flex-1 border border-white/10 bg-[#040A11] rounded-lg items-center gap-2 p-2">
          <div></div>
          <div className="flex flex-col gap-2">
            <h1 className="text-muted">Positions</h1>
            <p className="text-[#144DEF] font-bold text-3xl">
              {totalPositions}
            </p>
            <p className="text-muted">
              {election.categories
                .map((category) => category.position)
                .join(", ")}
            </p>
          </div>
        </Card>
      </div>
      <div className="w-full flex flex-col lg:flex-row gap-7">
        <div className="w-[290px] md:w-full lg:w-[700px]">
          <ProgressCard
            title="Overall Progress"
            current={election.votesCast}
            total={election.totalVoters}
          />
          <ResultsTable
            title="Results by Position"
            subtitle="Live results update automatically as votes are cast."
            categories={election.categories}
          />
        </div>
        <div className="flex flex-col gap-10">
          <ElectionSummary
            status={election.status}
            items={[
              {
                label: "Election Status",
                value: election.status,
              },
              {
                label: "Start Date",
                value: election.startDate,
              },
              {
                label: "End Date",
                value: election.endDate,
              },
              {
                label: "Duration",
                value: election.duration,
              },
              {
                label: "Voting System",
                value: "Online",
              },
              election.status === "live"
                ? {
                    label: "Summary Updated",
                    value: "Live in real-time",
                    valueColor: "text-[#144DEF]",
                  }
                : {
                    label: "Result Published",
                    value: election.resultPublished,
                  },
            ]}
          />
          <VotesDistribution categories={election.categories} />
        </div>
      </div>
    </div>
  );
}

export default ResultPage;
