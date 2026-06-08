import Card from "../../ui/Card";
import SummaryItem from "./SummaryItem";

function ElectionSummary({ title = "Election Summary", status, items = [] }) {
  const statusStyles = {
    completed: "bg-green-500/10 text-green-400",
    live: "bg-[#144DEF]/10 text-[#144DEF]",
    upcoming: "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <Card
      className="
      w-full
      bg-[#050B14]
      border border-white/10
      rounded-2xl
      p-6
      flex flex-col gap-6
      "
    >
      {/* HEADER */}

      <div className="flex justify-between items-center">
        <h1 className="text-text text-xl font-bold">{title}</h1>

        <div
          className={`
            px-4 py-1
            rounded-lg
            text-sm font-semibold
            ${statusStyles[status]}
          `}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex flex-col gap-5">
        {items.map((item, index) => (
          <SummaryItem
            key={index}
            label={item.label}
            value={item.value}
            valueColor={item.valueColor}
          />
        ))}
      </div>
    </Card>
  );
}

export default ElectionSummary;
