import { useEffect, useState } from "react";

export default function Countdown() {
  const [time, setTime] = useState(5 * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return (
    <h1 className="text-[#111827] font-bold">
      {minutes}:{seconds.toString().padStart(2, "0")}m
    </h1>
  );
}
