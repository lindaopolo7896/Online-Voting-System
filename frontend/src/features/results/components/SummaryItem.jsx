function SummaryItem({ label, value, valueColor = "text-text" }) {
  return (
    <div className="flex justify-between items-center gap-4">
      <p className="text-muted">{label}</p>

      <p className={`font-medium text-right ${valueColor}`}>{value}</p>
    </div>
  );
}

export default SummaryItem;
