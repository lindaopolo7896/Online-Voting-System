import { useState } from "react";
import { MdOutlineNavigateNext } from "react-icons/md";
import { MdOutlineNavigateBefore } from "react-icons/md";

function LiveResults({ election }) {
  const [currentPosition, setCurrentPosition] = useState(0);

  const category = election.categories[currentPosition];

  const colors = [
    "bg-[#144DEF]",
    "bg-[#0F1117]",
    "bg-[#9CA3AF]",
    "bg-[#F59E0B]",
    "bg-[#10B981]",
  ];

  const nextPosition = () => {
    if (currentPosition < election.categories.length - 1) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  const prevPosition = () => {
    if (currentPosition > 0) {
      setCurrentPosition(currentPosition - 1);
    }
  };

  return (
    <div
      className="border border-[#144DEF] rounded-2xl 
    px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10
    w-full bg-white shadow-[0px_4px_10px_0px_rgba(20,77,239,0.25)]"
    >
      <div className="flex justify-between items-start gap-4 mb-6 sm:mb-8">
        <div className="min-w-0">
          <p className="text-gray-400 text-xs sm:text-sm font-semibold tracking-wide">
            LIVE RESULTS
          </p>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#144DEF] wrap-break-word">
            {election.title}
          </h1>

          <p className="font-semibold text-base sm:text-lg break-words">
            {category.position}
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3 shrink-0">
          <button
            onClick={prevPosition}
            disabled={currentPosition === 0}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              currentPosition === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#144DEF] hover:text-white"
            }`}
          >
            <MdOutlineNavigateBefore className="text-lg sm:text-xl" />
          </button>

          <button
            onClick={nextPosition}
            disabled={currentPosition === election.categories.length - 1}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${
              currentPosition === election.categories.length - 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-[#144DEF] hover:text-white"
            }`}
          >
            <MdOutlineNavigateNext className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 sm:gap-6">
        {category.results.map((candidate, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex justify-between items-start sm:items-center gap-3 text-sm">
              <p className="text-gray-500 font-medium break-words max-w-[55%] sm:max-w-none">
                {candidate.candidate}
              </p>

              <div className="flex gap-2 sm:gap-3 items-center shrink-0">
                <p className="font-bold text-sm sm:text-base">
                  {candidate.votes}
                </p>

                <p className="text-gray-400 text-xs sm:text-sm">
                  {candidate.percentage}%
                </p>
              </div>
            </div>

            <div className="w-full h-2.5 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${colors[index]}`}
                style={{
                  width: `${candidate.percentage}%`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LiveResults;
