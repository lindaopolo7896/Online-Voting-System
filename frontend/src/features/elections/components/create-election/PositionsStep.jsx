import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Minus } from "lucide-react";
import Card from "@/components/ui/Card";

function PositionsStep({ positions, setPositions, onBack, onNext }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      positions: positions.length
        ? positions.map((name) => ({ name }))
        : [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "positions",
  });

  function onSubmit(data) {
    setPositions(data.positions.map((p) => p.name.trim()));
    onNext();
  }

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">Add Positions</h2>
        <p className="text-sm text-muted">
          Specify the positions candidates can contest for in this election
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Count display */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-text">
            Number of Positions
          </label>
          <div className="flex w-full max-w-xs items-center">
            <input
              readOnly
              value={fields.length}
              className="flex-1 rounded-l-lg border border-border bg-background px-4 py-2 text-center text-text outline-none"
            />
            <button
              type="button"
              onClick={() => append({ name: "" })}
              className="border-y border-r border-border bg-surface px-4 py-2 hover:bg-background transition text-text"
            >
              <Plus size={16} />
            </button>
            <button
              type="button"
              onClick={() => fields.length > 1 && remove(fields.length - 1)}
              disabled={fields.length <= 1}
              className="rounded-r-lg border-y border-r border-border bg-surface px-4 py-2 hover:bg-background transition text-text disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>

        {/* Position inputs */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-text">
            Position Names <span className="text-error">*</span>
          </label>

          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="flex items-center gap-2">
                <input
                  {...register(`positions.${index}.name`, {
                    required: "Position name is required",
                    validate: (v) =>
                      v.trim().length > 0 || "Position name cannot be empty",
                  })}
                  placeholder={`Position ${index + 1} (e.g. President)`}
                  className={`w-full rounded-lg border px-4 py-2.5 text-sm text-text bg-background outline-none transition-colors ${
                    errors.positions?.[index]?.name
                      ? "border-error"
                      : "border-border focus:border-primary"
                  }`}
                />
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="shrink-0 rounded-lg border border-border p-2 text-muted hover:border-error hover:text-error transition"
                  >
                    <Minus size={15} />
                  </button>
                )}
              </div>
              {errors.positions?.[index]?.name && (
                <p className="mt-1 text-xs text-error">
                  {errors.positions[index].name.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="rounded-lg border border-border px-6 py-2 text-text text-sm hover:bg-background transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-6 py-2 text-white text-sm hover:bg-primary/90 transition"
          >
            Save & Continue
          </button>
        </div>
      </form>
    </Card>
  );
}

export default PositionsStep;
