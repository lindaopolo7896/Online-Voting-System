import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import Card from "../ui/Card";

ChartJS.register(ArcElement, Tooltip, Legend);

const positionData = {
  labels: [
    "President",
    "Vice President",
    "Secretary",
    "Finance Minister",
    "Other",
  ],
  datasets: [
    {
      data: [6, 7, 5, 4, 2],
      backgroundColor: ["#2563EB", "#10B981", "#F59E0B", "#7C3AED", "#06B6D4"],
      borderWidth: 0,
    },
  ],
};

function CandidatesByPositionChart() {
  const total = positionData.datasets[0].data.reduce(
    (sum, value) => sum + value,
    0,
  );

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "60%",
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <Card className="p-6 flex-1 border-white/10 rounded-xl flex flex-col gap-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-text">Candidates by Position</h2>

        <span className="px-3 py-1 text-xs font-semibold border border-primary text-primary rounded-md">
          ● LIVE NOW
        </span>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="relative w-56 h-56">
          <Doughnut data={positionData} options={options} />

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-text">{total}</span>
            <span className="text-sm text-muted">Total</span>
          </div>
        </div>

        <div className="space-y-4">
          {positionData.labels.map((label, index) => (
            <div key={label} className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor:
                    positionData.datasets[0].backgroundColor[index],
                }}
              />

              <span className="font-medium text-muted">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

export default CandidatesByPositionChart;
