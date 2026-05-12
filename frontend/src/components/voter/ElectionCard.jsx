import Voters from "../../assets/voters.png";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";

function ElectionCard({ isActive, title, countdown }) {
  return (
    <div
      className="
        w-full min-h-[400px] lg:min-h-80
        bg-cover bg-center rounded-xl
        px-5 py-8 sm:px-8 lg:px-10
        flex flex-col lg:flex-row
        items-start lg:items-center
        lg:justify-between
        gap-10
      "
      style={{ backgroundImage: `url(${Voters})` }}
    >
      <div className="flex flex-col gap-6 w-full lg:w-1/2">
        <div className="flex flex-col gap-2">
          <div
            className="
              text-[#144DEF] font-bold border border-[#144DEF]
              flex py-1 px-4 rounded-full
              w-fit
              bg-white/10 backdrop-blur-sm
            "
          >
            <p className="text-center flex items-center justify-center gap-2 text-sm sm:text-base">
              {isActive && <GoDotFill className="animate-pulse" />}

              {isActive ? "LIVE NOW" : "SCHEDULED"}
            </p>
          </div>

          <p className="text-[#144DEF] font-bold text-sm sm:text-base">
            {isActive ? "ACTIVE ELECTION" : "PENDING ELECTION"}
          </p>
        </div>

        <p
          className="
            text-white font-bold
            text-2xl sm:text-3xl lg:text-4xl
            leading-tight
            w-full lg:w-3/4
          "
        >
          {title}
        </p>

        <Link to="/voter/vote" className="w-full sm:w-fit">
          <button
            className="
              bg-[#144DEF]
              rounded-full
              px-8 py-3
              text-base sm:text-lg
              font-bold text-white
              hover:bg-white hover:text-[#144DEF]
              active:bg-transparent active:border active:border-[#144DEF]
              transition-all duration-300 ease-in-out
              cursor-pointer
              w-full sm:w-auto
            "
          >
            Cast your vote
          </button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 w-full lg:w-auto">
        <p className="font-bold text-white/80 text-base sm:text-lg">
          Election is ending in:
        </p>

        <div
          className="
            flex items-center
            justify-start lg:justify-between
            gap-3 sm:gap-6
            flex-wrap
          "
        >
          <div
            className="
              flex flex-col items-center justify-center
              bg-[#0A1527]
              border border-[#144DEF]
              p-4 rounded-xl
              w-20 h-20 sm:w-24 sm:h-24
            "
          >
            <p className="text-xl sm:text-2xl font-bold text-[#144DEF]">
              {countdown.hours.toString().padStart(2, "0")}
            </p>

            <h1 className="text-white/67 text-sm sm:text-base">Hours</h1>
          </div>

          {/* MINUTES */}
          <div
            className="
              flex flex-col items-center justify-center
              bg-[#0A1527]
              border border-[#144DEF]
              p-4 rounded-xl
              w-20 h-20 sm:w-24 sm:h-24
            "
          >
            <p className="text-xl sm:text-2xl font-bold text-[#144DEF]">
              {countdown.minutes.toString().padStart(2, "0")}
            </p>

            <h1 className="text-white/67 text-sm sm:text-base">Mins</h1>
          </div>

          <div
            className="
              flex flex-col items-center justify-center
              bg-[#0A1527]
              border border-[#144DEF]
              p-4 rounded-xl
              w-20 h-20 sm:w-24 sm:h-24
            "
          >
            <p className="text-xl sm:text-2xl font-bold text-[#144DEF]">
              {countdown.seconds.toString().padStart(2, "0")}
            </p>

            <h1 className="text-white/67 text-sm sm:text-base">Secs</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ElectionCard;
