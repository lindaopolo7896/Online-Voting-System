import { Minus, Plus, X } from "lucide-react";
import Card from "../../../components/ui/Card";

function PositionsStep({ positions, setPositions, onBack, onNext }) {
  const addPosition = () => {
    setPositions([...positions, ""]);
  };

  const removePosition = () => {
    if (positions.length > 1) {
      setPositions(positions.slice(0, -1));
    }
  };

  const updatePosition = (index, value) => {
    const updated = [...positions];
    updated[index] = value;
    setPositions(updated);
  };

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Add Positions</h2>

          <p className="text-sm text-slate-500">
            Specify the number of positions and add their titles
          </p>
        </div>

        <button>
          <X size={18} />
        </button>
      </div>

      {/* Number of Positions */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">
          Number of Positions *
        </label>

        <div className="flex w-full max-w-md">
          <input
            readOnly
            value={positions.length}
            className="flex-1 rounded-l-lg border border-slate-200 px-4 py-2"
          />

          <button
            onClick={addPosition}
            className="border-y border-r border-slate-200 px-4"
          >
            <Plus size={16} />
          </button>

          <button
            onClick={removePosition}
            className="border-y border-r border-slate-200 px-4"
          >
            <Minus size={16} />
          </button>
        </div>
      </div>

      {/* Position Inputs */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Positions *</label>

        {positions.map((position, index) => (
          <input
            key={index}
            value={position}
            onChange={(e) => updatePosition(index, e.target.value)}
            placeholder={`Position ${index + 1}`}
            className="w-full rounded-lg border border-slate-200 px-4 py-2"
          />
        ))}
      </div>

      <div className="mt-8 flex justify-between">
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

export default PositionsStep;
