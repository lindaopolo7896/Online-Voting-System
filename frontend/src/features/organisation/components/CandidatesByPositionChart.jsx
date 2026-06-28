import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Card from "@/components/ui/Card";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#2563EB",
  "#10B981",
  "#F59E0B",
  "#7C3AED",
  "#06B6D4",
  "#EF4444",
  "#8B5CF6",
  "#F97316",
];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "60%",
  plugins: { legend: { display: false } },
};

function CandidatesByPositionChart({ positions = [], isLive = false, electionName = "" }) {
  const hasData = positions.length > 0;
  const total = positions.reduce((s, p) => s + p.count, 0);

  const chartData = {
    labels: positions.map((p) => p.position),
    datasets: [
      {
        data: positions.map((p) => p.count),
        backgroundColor: COLORS.slice(0, positions.length),
        borderWidth: 0,
      },
    ],
  };

  return (
    <Card className="p-5 sm:p-6 flex-1 border-white/10 rounded-xl flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-text">
            Candidates by Position
          </h2>
          {electionName && (
            <p className="text-xs text-muted mt-0.5 truncate max-w-[200px]">
              {electionName}
            </p>
          )}
        </div>

        <span
          className={`shrink-0 px-3 py-1 text-xs font-semibold border rounded-md ${
            isLive
              ? "border-primary text-primary"
              : "border-muted/30 text-muted"
          }`}
        >
          {isLive ? "● LIVE NOW" : "● COMPLETED"}
        </span>
      </div>

      {hasData ? (
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Doughnut */}
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 shrink-0">
            <Doughnut data={chartData} options={options} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-text">{total}</span>
              <span className="text-xs text-muted">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap sm:flex-col gap-3">
            {positions.map((p, i) => (
              <div key={p.position} className="flex items-center gap-2 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="text-sm text-muted truncate">
                  {p.position}
                </span>
                <span className="text-sm font-semibold text-text ml-auto pl-2">
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 py-8 text-center">
          <p className="text-muted text-sm">No candidate data available.</p>
          <p className="text-muted text-xs mt-1">
            Register candidates in an active or completed election.
          </p>
        </div>
      )}
    </Card>
  );
}

export default CandidatesByPositionChart;
