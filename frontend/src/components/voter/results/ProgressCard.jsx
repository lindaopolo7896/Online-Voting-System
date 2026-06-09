import Card from "../../ui/Card";

function ProgressCard({ title, current, total, color = "#144DEF" }) {
  const percentage = ((current / total) * 100).toFixed(0);

  return (
    <Card
      className="w-full
        
        border border-white/10
        rounded-2xl
        p-5
        flex flex-col gap-3
      "
    >
      {/* TITLE */}
      <h1 className="text-text font-bold text-lg">{title}</h1>

      {/* PROGRESS */}
      <div className="flex items-center gap-4">
        {/* BAR */}
        <div className="w-full h-6 bg-[#E9EAE1] rounded-full overflow-hidden">
          <div
            className="
              h-full
              rounded-full
              transition-all duration-700
            "
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(to right, ${color}, #2563EB)`,
            }}
          ></div>
        </div>

        {/* PERCENT */}
        <p
          className="text-4xl font-bold"
          style={{
            color,
          }}
        >
          {percentage}%
        </p>
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center text-sm">
        <p className="text-muted">
          {current} / {total} voters have participated
        </p>

        <p className="text-muted">{total - current} remaining</p>
      </div>
    </Card>
  );
}

export default ProgressCard;
