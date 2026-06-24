import { useEffect, useState } from "react";

function VerificationCountdown() {
  const [time, setTime] = useState(10 * 60);

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
    <span className="text-[#6F7995] font-bold">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </span>
  );
}

export default VerificationCountdown;
