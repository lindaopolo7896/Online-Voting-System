import { useEffect, useState } from "react";

export default function ComingSoon() {
  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const launchDate = new Date("2026-12-31T23:59:59").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const distance = launchDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        return;
      }

      setTime({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(
          2,
          "0",
        ),

        hours: String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(
          2,
          "0",
        ),

        minutes: String(Math.floor((distance / (1000 * 60)) % 60)).padStart(
          2,
          "0",
        ),

        seconds: String(Math.floor((distance / 1000) % 60)).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
      min-h-screen
      bg-[#0b0b0c]
      text-white
      flex
      items-center
      justify-center
      overflow-hidden
      relative
      px-6
    "
    >
      {/* glow */}
      <div
        className="
        absolute
        w-[500px]
        h-[500px]
        rounded-full
        bg-white/10
        blur-[100px]
      "
      />

      <div
        className="
        relative
        z-10
        text-center
        max-w-3xl
      "
      >
        {/* Badge */}
        <div
          className="
          inline-flex
          items-center
          px-4
          py-2
          rounded-full
          border
          border-white/10
          text-gray-400
          text-sm
          mb-8
          backdrop-blur-md
        "
        >
          <span className="mr-2">●</span>
          Launching Soon
        </div>

        {/* Heading */}
        <h1
          className="
          text-6xl
          md:text-8xl
          font-semibold
          tracking-[-4px]
          leading-none
          mb-6
        "
        >
          Something
          <br />
          Beautiful is Coming
        </h1>

        <p
          className="
          text-gray-400
          max-w-md
          mx-auto
          text-lg
          leading-8
        "
        >
          We're crafting an experience worth waiting for. The countdown has
          begun.
        </p>

        <div
          className="
          w-20
          h-px
          bg-white/10
          mx-auto
          my-12
        "
        />

        {/* Countdown */}
        <div
          className="
          flex
          justify-center
          gap-8
          flex-wrap
        "
        >
          {[
            ["days", time.days],
            ["hours", time.hours],
            ["minutes", time.minutes],
            ["seconds", time.seconds],
          ].map(([label, value]) => (
            <div key={label} className="min-w-[100px]">
              <div
                className="
                text-5xl
                font-semibold
                tracking-tight
              "
              >
                {value}
              </div>

              <div
                className="
                text-gray-400
                uppercase
                text-xs
                tracking-[3px]
                mt-2
              "
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        <div
          className="
          mt-12
          text-gray-500
          text-sm
        "
        >
          © 2026 Your Brand
        </div>
      </div>
    </div>
  );
}
