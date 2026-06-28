import { useEffect, useState } from "react";

export default function Countdown({ election }) {
  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      // Completed elections stay at 0
      if (election.status === "completed") {
        setCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      // Determine target time
      const targetDate =
        election.status === "live"
          ? new Date(election.endTime)
          : new Date(election.startTime);

      const now = new Date();

      const difference = targetDate - now;

      if (difference <= 0) {
        setCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      const hours = Math.floor(difference / (1000 * 60 * 60));

      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setCountdown({
        hours,
        minutes,
        seconds,
      });
    };

    calculateTime();

    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [election]);

  return countdown;
}
