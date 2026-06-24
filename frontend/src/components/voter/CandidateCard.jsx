import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

function CandidateCard({
  candidate,
  selectedCandidate,
  setSelectedCandidate,
  onViewInfo,
}) {
  const isSelected = selectedCandidate?.id === candidate.id;

  const handleSelect = () => {
    setSelectedCandidate(candidate);
  };

  return (
    <div
      className={`relative  rounded-2xl shadow-lg p-3 w-87 md:w-100 h-110 transition-all duration-300 border-2 ${
        isSelected
          ? "border-[#144DEF]"
          : "border-transparent hover:border-[#144DEF]/40"
      }`}
    >
      {isSelected && (
        <FaCheckCircle className="absolute top-3 right-3 text-[#144DEF] text-xl" />
      )}

      <div className="relative">
        {candidate.image ? (
          <img
            src={candidate.image}
            alt={candidate.name}
            className="w-full h-60 object-cover rounded-xl"
          />
        ) : (
          <div className="w-full h-60 rounded-xl bg-[#144DEF]/10 border border-[#144DEF]/20 flex items-center justify-center">
            <span className="text-[#144DEF] text-7xl font-bold">
              {candidate.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <button
          onClick={onViewInfo}
          className="absolute bottom-3 right-3 bg-[#144DEF] text-white text-sm px-4 py-1 rounded-full hover:bg-[#0F1117] transition-all duration-300"
        >
          View Info
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-center text-[#144DEF]">
          {candidate.name}
        </h1>

        <p className="text- text-gray-500 text-center">{candidate.slogan}</p>

        <button
          onClick={handleSelect}
          className={`mt-2 py-2 rounded-full border font-medium transition-all duration-300 ${
            isSelected
              ? "bg-[#144DEF] text-white border-[#144DEF]"
              : "border-[#144DEF] text-[#144DEF] hover:bg-[#144DEF] hover:text-white"
          }`}
        >
          {isSelected ? "Selected" : "Select"}
        </button>
      </div>
    </div>
  );
}

export default CandidateCard;
