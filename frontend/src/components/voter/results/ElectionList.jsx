import { GoDotFill } from "react-icons/go";
import { RxCaretRight } from "react-icons/rx";
import { Link } from "react-router-dom";
import Card from "../../ui/Card";

function ElectionList({ elections }) {
  return (
    <Card className="p-5 border-none rounded-lg">
      <div>
        <div className="mb-6">
          <h1 className="text-tet font-bold text-2xl">Available Elections</h1>
          <p className="text-muted">
            Select an election to view detailed results
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center md:justify-start flex-col gap-8">
        {elections.map((election) => (
          <Card className="hover:shadow-xl hover:shadow-[#144DEF]/12 cursor-pointer hover:scale-102 transition-all duration-300 ease-in-out border-white/10 rounded-lg">
            <Link
              to={`/voter/results/${election.id}`}
              key={election.id}
              className="flex items-center justify-center md:justify-between border  border-white/10 w-full rounded-xl p-4 gap-5 "
            >
              {/* left side */}
              <div className="flex flex-col md:flex-row gap-5 ">
                <div className="flex flex-col items-center justify-center gap-2 md:w-50">
                  <img
                    src={`https://ui-avatars.com/api/?name=${election.organization}&background=144DEF&color=fff`}
                    alt={election.organization}
                    className="w-20 h-20 rounded-full"
                  />
                  <p className="text-text">{election.organization}</p>
                </div>
                <div className="hidden md:flex h-30 w-0.5 bg-white/10 mr-10"></div>

                <div className="flex flex-col gap-5">
                  <h1 className="text-text text-center md:text-left font-bold">
                    {election.title}
                  </h1>
                  <div className="text-muted flex items-center gap-4">
                    <p>{election.date}</p>
                    <GoDotFill />
                    <p>{election.totalVoters} voters</p>
                    <GoDotFill />
                    <p>{election.totalVoters} votes cast</p>
                  </div>
                  <div
                    className="
              text-[#144DEF]
              font-bold
              border border-[#144DEF]
              flex py-1 px-4
              rounded-full
              w-fit
              bg-white/10
              backdrop-blur-sm
              "
                  >
                    <p className="flex items-center justify-center gap-2 text-sm">
                      {election.status === "live" && (
                        <GoDotFill className="animate-pulse" />
                      )}

                      {election.status === "live"
                        ? "LIVE NOW"
                        : election.status === "completed"
                          ? "COMPLETED"
                          : "UPCOMING"}
                    </p>
                  </div>
                </div>
              </div>
              {/* right side  */}
              <div>
                <RxCaretRight className="hidden md:flex text-5xl mr-20 text-[#144DEF]" />
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </Card>
  );
}

export default ElectionList;
