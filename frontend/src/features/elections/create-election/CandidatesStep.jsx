import { useState } from "react";
import Card from "../../../components/ui/Card";

function CandidatesStep({
  positions,
  candidates,
  setCandidates,
  onBack,
  onNext,
}) {
  const [mode, setMode] = useState("manual");

  const addCandidate = (position) => {
    setCandidates((prev) => ({
      ...prev,
      [position]: [...(prev[position] || []), ""],
    }));
  };

  const updateCandidate = (position, index, value) => {
    setCandidates((prev) => {
      const updated = [...(prev[position] || [])];
      updated[index] = value;

      return {
        ...prev,
        [position]: updated,
      };
    });
  };

  const removeCandidate = (position, index) => {
    setCandidates((prev) => ({
      ...prev,
      [position]: prev[position].filter((_, i) => i !== index),
    }));
  };

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Candidates</h2>

        <p className="text-sm text-slate-500">
          Add candidates for each position
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-6 border-b border-slate-200">
        <button
          onClick={() => setMode("manual")}
          className={`pb-3 text-sm font-medium ${
            mode === "manual"
              ? "border-b-2 border-primary text-primary"
              : "text-slate-500"
          }`}
        >
          Add Manually
        </button>

        <button
          onClick={() => setMode("upload")}
          className={`pb-3 text-sm font-medium ${
            mode === "upload"
              ? "border-b-2 border-primary text-primary"
              : "text-slate-500"
          }`}
        >
          Upload Candidates
        </button>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-slate-200 p-5">
        {mode === "manual" ? (
          <div className="space-y-8">
            {positions.map((position) => (
              <div key={position}>
                <div className="mb-3 flex items-center gap-2">
                  <h3 className="font-semibold">{position}</h3>

                  <span className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    Required
                  </span>
                </div>

                <div className="space-y-3">
                  {(candidates[position] || []).map((candidate, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={candidate}
                        onChange={(e) =>
                          updateCandidate(position, index, e.target.value)
                        }
                        placeholder="Candidate name"
                        className="flex-1 rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-primary"
                      />

                      <button
                        onClick={() => removeCandidate(position, index)}
                        className="rounded-lg border border-red-200 px-4 py-3 text-red-500 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => addCandidate(position)}
                    className="rounded-lg border border-dashed border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
                  >
                    + Add Candidate
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-xl border-2 border-dashed border-slate-300 p-10 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                📄
              </div>

              <h3 className="font-semibold">Upload Candidate List</h3>

              <p className="mt-2 text-sm text-slate-500">
                Upload a CSV file containing candidate information.
              </p>

              <button className="mt-5 rounded-lg bg-primary px-5 py-2 text-white">
                Choose File
              </button>

              <p className="mt-3 text-xs text-slate-500">
                Supported format: CSV
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <h4 className="mb-2 font-medium">Required CSV Columns</h4>

              <ul className="space-y-1 text-sm text-slate-600">
                <li>• Full Name</li>
                <li>• Email Address</li>
                <li>• Phone Number</li>
                <li>• Position</li>
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-slate-200 px-6 py-2"
        >
          Back
        </button>

        <button
          onClick={onNext}
          className="rounded-lg bg-primary px-6 py-2 text-white"
        >
          Save & Continue
        </button>
      </div>
    </Card>
  );
}

export default CandidatesStep;
