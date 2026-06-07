export default function CountDownCard({ countdown }) {
  const items = [
    {
      label: "Hours",
      value: countdown?.hours ?? 0,
    },
    {
      label: "Mins",
      value: countdown?.minutes ?? 0,
    },
    {
      label: "Secs",
      value: countdown?.seconds ?? 0,
    },
  ];

  return (
    <div className="flex gap-3 sm:gap-6 flex-wrap">
      {items.map((item) => (
        <div
          key={item.label}
          className="
          flex flex-col
          items-center justify-center
          bg-[#0A1527]
          border border-primary
          p-4
          rounded-xl
          w-20 h-20
          sm:w-24 sm:h-24
          "
        >
          <p className="text-xl sm:text-2xl font-bold text-primary">
            {item.value.toString().padStart(2, "0")}
          </p>

          <h1 className="text-white/67">{item.label}</h1>
        </div>
      ))}
    </div>
  );
}
