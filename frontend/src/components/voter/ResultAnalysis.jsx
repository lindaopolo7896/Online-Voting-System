import React from "react";

const data = [
  {
    id: 1,
    name: "Total Elections",
    count: 3,
  },
  {
    id: 2,
    name: "Live Elections",
    count: 1,
  },
  {
    id: 3,
    name: "Participated Elections",
    count: 2,
  },
];

function ResultAnalysis() {
  return (
    <div className="flex justify-center gap-10 mx-10 mt-25">
      {data.map((analysis) => (
        <div
          className="flex flex-col gap-2 shadow-lg p-3 rounded-xl w-1/2 items-center font-medium"
          key={analysis.id}
        >
          <p className="text-[#144DEF]  text-3xl">{analysis.count}</p>
          <p className="text-black/58">{analysis.name.toUpperCase()}</p>
        </div>
      ))}
    </div>
  );
}

export default ResultAnalysis;
