import Voters from "../../../assets/images/voters.png";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { useMemo, useEffect, useState } from "react";

function ElectionCard({ elections, selectedElection, setSelectedElection }) {
  // SORT ELECTIONS

  const sortedElections = useMemo(() => {
    return [...elections].sort((a, b) => {
      // Upcoming always last
      if (a.status === "upcoming" && b.status !== "upcoming") {
        return 1;
      }

      if (a.status !== "upcoming" && b.status === "upcoming") {
        return -1;
      }

      // newest → oldest
      return new Date(b.date) - new Date(a.date);
    });
  }, [elections]);

  // COUNTDOWN

  const [countdown, setCountdown] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      // COMPLETED

      if (selectedElection.status === "completed") {
        setCountdown({
          hours: 0,
          minutes: 0,
          seconds: 0,
        });

        return;
      }

      // LIVE → END TIME
      // UPCOMING → START TIME

      const targetDate =
        selectedElection.status === "live"
          ? new Date(selectedElection.endTime)
          : new Date(selectedElection.startTime);

      const now = new Date();

      const difference = targetDate - now;

      // TIMER FINISHED

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
  }, [selectedElection]);

  return (
    <div
      className="
      w-full
      min-h-[400px]
      lg:min-h-80
      bg-cover
      bg-center
      rounded-xl
      px-5 py-8
      sm:px-8
      lg:px-10
      flex flex-col
      lg:flex-row
      items-start
      lg:items-center
      lg:justify-between
      gap-10
      "
      style={{
        backgroundImage: `url(${Voters})`,
      }}
    >
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <div
              className="
              text-[#144DEF]
              font-bold
              border border-[#144DEF]
              flex py-1 px-4
              rounded-full
              w-fit
              bg-white/10
              backdrop-blur-sm
              "
            >
              <p className="flex items-center justify-center gap-2 text-sm">
                {selectedElection.status === "live" && (
                  <GoDotFill className="animate-pulse" />
                )}

                {selectedElection.status === "live"
                  ? "LIVE NOW"
                  : selectedElection.status === "completed"
                    ? "COMPLETED"
                    : "UPCOMING"}
              </p>
            </div>

            <p className="text-[#144DEF] font-bold">
              {selectedElection.organization}
            </p>
          </div>
        </div>

        <p
          className="
          text-white
          font-bold
          text-2xl
          sm:text-3xl
          lg:text-4xl
          leading-tight
          w-full
          lg:w-3/4
          "
        >
          {selectedElection.title}
        </p>

        <Link to="/voter/results" className="w-full sm:w-fit">
          <button
            className="
            bg-[#144DEF]
            rounded-full
            px-8 py-3
            text-base sm:text-lg
            font-bold text-white
            hover:bg-white
            hover:text-[#144DEF]
            active:bg-transparent
            active:border
            active:border-[#144DEF]
            transition-all duration-300
            cursor-pointer
            w-full sm:w-auto
            "
          >
            View Results
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-auto">
        <select
          value={selectedElection.id}
          onChange={(e) => {
            const election = sortedElections.find(
              (item) => item.id === Number(e.target.value),
            );

            setSelectedElection(election);
          }}
          className="
          bg-[#0F1117]
          border border-white/10
          rounded-lg
          px-4 py-2
          text-white
          outline-none
          cursor-pointer
          w-[260px]
          "
        >
          {sortedElections.map((election) => (
            <option
              key={election.id}
              value={election.id}
              className="bg-[#0F1117]"
            >
              {election.title}
            </option>
          ))}
        </select>

        <p className="font-bold text-white/80">
          {selectedElection.status === "upcoming"
            ? "Election starts in:"
            : "Election ends in:"}
        </p>

        <div className="flex gap-3 sm:gap-6 flex-wrap">
          {[
            {
              label: "Hours",
              value: countdown.hours,
            },
            {
              label: "Mins",
              value: countdown.minutes,
            },
            {
              label: "Secs",
              value: countdown.seconds,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="
              flex flex-col
              items-center justify-center
              bg-[#0A1527]
              border border-[#144DEF]
              p-4
              rounded-xl
              w-20 h-20
              sm:w-24 sm:h-24
              "
            >
              <p className="text-xl sm:text-2xl font-bold text-[#144DEF]">
                {item.value.toString().padStart(2, "0")}
              </p>

              <h1 className="text-white/67">{item.label}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ElectionCard;
