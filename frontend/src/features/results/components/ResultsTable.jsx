import { useState } from "react";
import Card from "@/components/ui/Card";

// Shows live per-candidate tallies when the backend provides vote counts
// (category.tallied === true); otherwise falls back to a candidate roster.
function ResultsTable({ title, subtitle, categories, accentColor = "#144DEF" }) {
  const [activeTab, setActiveTab] = useState(0);

  const category = categories[activeTab];
  const candidates = category?.results ?? [];
  const tallied = !!category?.tallied;
  const totalVotes = candidates.reduce((s, c) => s + (c.votes ?? 0), 0);

  return (
    <Card className="mt-8 w-full border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
      {/* HEADER */}
      <div>
        <h1 className="text-text text-xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted text-sm">{subtitle}</p>}
      </div>

      {/* TABS */}
      <div className="flex items-center gap-8 border-b border-white/10 overflow-x-auto">
        {categories.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(index)}
            className="pb-3 whitespace-nowrap font-semibold transition-all"
            style={{
              color: activeTab === index ? accentColor : undefined,
              borderBottom:
                activeTab === index ? `2px solid ${accentColor}` : "none",
            }}
          >
            {item.position}
          </button>
        ))}
      </div>

      <div className="border border-white/10 rounded-2xl overflow-hidden">
        {/* column header */}
        <div
          className={`grid ${tallied ? "grid-cols-[60px_1fr_120px_120px]" : "grid-cols-[60px_1fr]"} px-6 py-4 border-b border-white/10 text-muted text-sm font-semibold`}
        >
          <p>#</p>
          <p>Candidate</p>
          {tallied && <p>Votes</p>}
          {tallied && <p>Percentage</p>}
        </div>

        {/* rows */}
        <div className="flex flex-col">
          {candidates.map((candidate, index) => (
            <div
              key={index}
              className={`grid ${tallied ? "grid-cols-[60px_1fr_120px_120px]" : "grid-cols-[60px_1fr]"} items-center px-6 py-5 border-b border-white/5`}
            >
              <p className="text-2xl font-bold" style={{ color: accentColor }}>
                {index + 1}
              </p>

              <div className="flex items-center gap-4">
                {candidate.image ? (
                  <img
                    src={candidate.image}
                    alt={candidate.candidate}
                    className="w-12 h-12 rounded-full object-cover border border-white/10 shrink-0"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 text-white font-bold text-lg"
                    style={{ backgroundColor: accentColor + "33" }}
                  >
                    {candidate.candidate.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex flex-col gap-2 w-full min-w-0">
                  <p className="text-text font-semibold">{candidate.candidate}</p>
                  {tallied && (
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${candidate.percentage}%`,
                          backgroundColor: accentColor,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {tallied && (
                <p className="text-text font-bold text-lg">{candidate.votes}</p>
              )}
              {tallied && (
                <p className="font-bold text-2xl" style={{ color: accentColor }}>
                  {candidate.percentage}%
                </p>
              )}
            </div>
          ))}
        </div>

        {/* footer */}
        <div className="px-6 py-4 text-sm">
          {tallied ? (
            <p className="text-muted">
              Total votes for this position:{" "}
              <span className="text-text font-semibold">{totalVotes}</span>
            </p>
          ) : (
            <p className="text-muted">
              {candidates.length} candidate{candidates.length !== 1 ? "s" : ""} ·
              live tallies appear here as votes are counted.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

export default ResultsTable;
