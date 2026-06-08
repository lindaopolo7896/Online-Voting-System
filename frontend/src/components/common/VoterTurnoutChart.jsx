import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";

import Card from "../ui/Card";

const turnoutData = [
  {
    election: "2026\nStudent Council\nElections",
    turnout: 86,
  },
  {
    election: "2025\nStudent Council\nElections",
    turnout: 64,
  },
  {
    election: "2024\nStudent Council\nElections",
    turnout: 76,
  },
];

const CustomTick = ({ x, y, payload }) => {
  const lines = payload.value.split("\n");

  return (
    <g transform={`translate(${x},${y})`}>
      {lines.map((line, index) => (
        <text
          key={index}
          x={0}
          y={index * 14}
          dy={16}
          textAnchor="middle"
          fill="currentColor"
          className="text-xs"
        >
          {line}
        </text>
      ))}
    </g>
  );
};

function VoterTurnoutChart({ data = turnoutData }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-text">
          Voter Turnout (Comparison)
        </h2>

        <Link
          to="/institution/reports"
          className="text-primary font-medium hover:underline"
        >
          View Reports →
        </Link>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 20,
              left: 0,
              bottom: 20,
            }}
          >
            <CartesianGrid vertical={false} stroke="rgba(148,163,184,0.2)" />

            <XAxis
              dataKey="election"
              interval={0}
              height={80}
              tick={<CustomTick />}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              tickLine={false}
              axisLine={false}
            />

            <Bar
              dataKey="turnout"
              fill="#144DEF"
              radius={[6, 6, 0, 0]}
              barSize={50}
            >
              <LabelList
                dataKey="turnout"
                position="top"
                formatter={(value) => `${value}%`}
                style={{
                  fontWeight: 700,
                  fill: "currentColor",
                }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

export default VoterTurnoutChart;
