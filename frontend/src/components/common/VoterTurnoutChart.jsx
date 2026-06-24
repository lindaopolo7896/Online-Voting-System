import { Link } from "react-router-dom";
import Card from "../ui/Card";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const turnoutData = [
  {
    election: "2026 Student Council Elections",
    turnout: 86,
  },
  {
    election: "2025 Student Council Elections",
    turnout: 64,
  },
  {
    election: "2024 Student Council Elections",
    turnout: 76,
  },
];

function VoterTurnoutChart({ data = turnoutData }) {
  const chartData = {
    labels: data.map((item) => item.election),
    datasets: [
      {
        label: "Voter Turnout (%)",
        data: data.map((item) => item.turnout),
        backgroundColor: "#144DEF",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value) => `${value}%`,
        },
        grid: {
          color: "rgba(148,163,184,0.2)",
        },
      },

      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Card className="p-6 border-white/10 rounded-xl flex-1">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-text">
          Voter Turnout (Comparison)
        </h2>

        <Link
          to="/organisation/reports"
          className="text-primary font-medium hover:underline"
        >
          View Reports →
        </Link>
      </div>

      <div className="h-[350px]">
        <Bar data={chartData} options={options} />
      </div>
    </Card>
  );
}

export default VoterTurnoutChart;
