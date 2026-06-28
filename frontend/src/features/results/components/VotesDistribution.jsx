import { useMemo, useState } from "react";
import Card from "@/components/ui/Card";

function VotesDistribution({ categories, title = "Votes Distribution" }) {
  const [activePosition, setActivePosition] = useState(0);

  const category = categories[activePosition];

  const colors = ["#144DEF", "#7C3AED", "#F59E0B", "#10B981", "#EF4444"];

  const totalVotes = useMemo(() => {
    return category.results.reduce(
      (total, candidate) => total + candidate.votes,
      0,
    );
  }, [category]);

  // CREATE CONIC GRADIENT

  const gradient = useMemo(() => {
    let start = 0;

    const sections = category.results.map((candidate, index) => {
      const end = start + candidate.percentage;

      const section = `${colors[index]} ${start}% ${end}%`;

      start = end;

      return section;
    });

    return `conic-gradient(${sections.join(", ")})`;
  }, [category]);

  return (
    <Card
      className="
      w-full
      
      border border-white/10
      rounded-2xl
      p-6
      flex flex-col gap-6
      "
    >
      {/* HEADER */}

      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-text text-xl font-bold">{title}</h1>
        </div>

        {/* POSITION SWITCHER */}

        <select
          value={activePosition}
          onChange={(e) => setActivePosition(Number(e.target.value))}
          className="
          bg-surface
          border border-white/10
          shadow
          rounded-lg
          px-4 py-2
          text-text
          outline-none
          cursor-pointer
          "
        >
          {categories.map((category, index) => (
            <option key={category.id} value={index}>
              {category.position}
            </option>
          ))}
        </select>
      </div>

      {/* CONTENT */}

      <div
        className="
        flex flex-col lg:flex-row
        items-center
        justify-between
        gap-10
        "
      >
        {/* DONUT CHART */}

        <div className="relative flex items-center justify-center">
          <div
            className="
            w-56 h-56
            rounded-full
            flex items-center justify-center
            "
            style={{
              background: gradient,
            }}
          >
            {/* INNER CIRCLE */}

            <div
              className="
              w-36 h-36
              rounded-full
              bg-surface
              border border-white/10
              flex flex-col
              items-center justify-center
              "
            >
              <h1 className="text-text text-5xl font-bold">{totalVotes}</h1>

              <p className="text-muted text-sm">Total Votes</p>
            </div>
          </div>
        </div>

        {/* LEGEND */}

        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          {category.results.map((candidate, index) => (
            <div
              key={index}
              className="flex justify-between items-center gap-4"
            >
              {/* LEFT */}

              <div className="flex items-center gap-4">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor: colors[index],
                  }}
                ></div>

                <p className="text-text text-lg font-medium">
                  {candidate.candidate}
                </p>
              </div>

              {/* RIGHT */}

              <p className="text-muted font-semibold">
                {candidate.percentage}% ({candidate.votes})
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default VotesDistribution;
