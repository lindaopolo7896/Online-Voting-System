function SummaryItem({ label, value, valueColor = "text-white" }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <p className="text-white/50">{label}</p>

      <p className={`font-medium text-right ${valueColor}`}>{value}</p>
    </div>
  );
}

export default SummaryItem;
