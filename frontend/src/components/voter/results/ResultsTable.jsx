import { useMemo, useState } from "react";
import Card from "../../ui/Card";

function ResultsTable({
  title,
  subtitle,
  categories,
  accentColor = "#144DEF",
}) {
  const [activeTab, setActiveTab] = useState(0);

  const [sortType, setSortType] = useState("most");

  const category = categories[activeTab];

  const sortedResults = useMemo(() => {
    const results = [...category.results];

    if (sortType === "most") {
      return results.sort((a, b) => b.votes - a.votes);
    }

    return results.sort((a, b) => a.votes - b.votes);
  }, [category, sortType]);

  return (
    <Card
      className="
      mt-8
      w-full
      
      border border-white/10
      rounded-2xl
      p-6
      flex flex-col gap-6
      "
    >
      {/* HEADER */}

      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-text text-xl font-bold">{title}</h1>

          <p className="text-muted text-sm">{subtitle}</p>
        </div>

        {/* SORT */}

        <select
          value={sortType}
          onChange={(e) => setSortType(e.target.value)}
          className="
          bg-surface
          shadow
          border border-white/10
          rounded-lg
          px-4 py-2
          text-text
          outline-none
          cursor-pointer
          "
        >
          <option value="most">Sort by: Most Votes</option>

          <option value="least">Sort by: Least Votes</option>
        </select>
      </div>

      {/* TABS */}

      <div
        className="
        flex items-center gap-8
        border-b border-white/10
        overflow-x-auto
        "
      >
        {categories.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(index)}
            className="
            pb-3
            whitespace-nowrap
            font-semibold
            transition-all
            "
            style={{
              color: activeTab === index ? "text-primary" : "text-text",

              borderBottom:
                activeTab === index ? `2px solid ${accentColor}` : "none",
            }}
          >
            {item.position}
          </button>
        ))}
      </div>

      {/* TABLE */}

      <div
        className="
        border border-white/10
        rounded-2xl
        overflow-hidden
        "
      >
        {/* HEADER */}

        <div
          className="
          grid grid-cols-[60px_1fr_120px_120px]
          px-6 py-4
          border-b border-white/10
          text-muted
          text-sm
          font-semibold
          "
        >
          <p>#</p>

          <p>Candidate</p>

          <p>Votes</p>

          <p>Percentage</p>
        </div>

        {/* BODY */}

        <div className="flex flex-col">
          {sortedResults.map((candidate, index) => (
            <div
              key={index}
              className="
              grid grid-cols-[60px_1fr_120px_120px]
              items-center
              px-6 py-5
              border-b border-white/5
              "
            >
              {/* RANK */}

              <p
                className="text-3xl font-bold"
                style={{
                  color: accentColor,
                }}
              >
                {index + 1}
              </p>

              {/* CANDIDATE */}

              <div className="flex items-center gap-4">
                <img
                  src={candidate.image}
                  alt={candidate.candidate}
                  className="
                  w-12 h-12
                  rounded-full
                  object-cover
                  border border-white/10
                  "
                />

                <div className="flex flex-col gap-2 w-full">
                  <p className="text-text font-semibold">
                    {candidate.candidate}
                  </p>

                  {/* BAR */}

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="
                      h-full
                      rounded-full
                      transition-all duration-700
                      "
                      style={{
                        width: `${candidate.percentage}%`,
                        backgroundColor: accentColor,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* VOTES */}

              <p className="text-text font-bold text-lg">{candidate.votes}</p>

              {/* PERCENTAGE */}

              <p
                className="font-bold text-2xl"
                style={{
                  color: accentColor,
                }}
              >
                {candidate.percentage}%
              </p>
            </div>
          ))}
        </div>

        {/* FOOTER */}

        <div
          className="
          flex justify-between items-center
          px-6 py-4
          text-sm
          "
        >
          <p className="text-muted">
            Total votes for this position:{" "}
            <span className="text-text font-semibold">
              {sortedResults.reduce(
                (total, candidate) => total + candidate.votes,
                0,
              )}
            </span>
          </p>

          <p className="text-muted">Valid votes only</p>
        </div>
      </div>
    </Card>
  );
}

export default ResultsTable;
