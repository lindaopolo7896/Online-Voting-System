import { useForm } from "react-hook-form";
import { Trash2, UserPlus } from "lucide-react";
import Card from "../../../components/ui/Card";

function VotersStep({ voters, setVoters, onBack, onNext }) {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  function onAdd(data) {
    const duplicate = voters.some(
      (v) => v.email.toLowerCase() === data.email.trim().toLowerCase()
    );
    if (duplicate) {
      setError("email", { message: "A voter with this email is already added." });
      return;
    }
    setVoters((prev) => [
      ...prev,
      { name: data.name.trim(), email: data.email.trim() },
    ]);
    reset();
  }

  function removeVoter(index) {
    setVoters((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">Additional Voters</h2>
        <p className="text-sm text-muted">
          Manually add individual voters who weren't included in the participants
          file. For bulk additions, use the Upload File option in the previous step.
        </p>
      </div>

      {/* Add voter form */}
      <form onSubmit={handleSubmit(onAdd)} noValidate>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex flex-col gap-1">
            <input
              type="text"
              placeholder="Full name"
              {...register("name", {
                required: "Full name is required.",
                minLength: { value: 2, message: "Name must be at least 2 characters." },
                maxLength: { value: 100, message: "Name must be under 100 characters." },
              })}
              className={`rounded-lg border px-4 py-3 bg-surface text-text placeholder:text-muted/50 outline-none focus:border-primary text-sm transition ${
                errors.name ? "border-error" : "border-border"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name.message}</p>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <input
              type="email"
              placeholder="Email address"
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address.",
                },
              })}
              className={`rounded-lg border px-4 py-3 bg-surface text-text placeholder:text-muted/50 outline-none focus:border-primary text-sm transition ${
                errors.email ? "border-error" : "border-border"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-error">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 transition shrink-0 self-start"
          >
            <UserPlus size={16} />
            Add
          </button>
        </div>
      </form>

      {/* Voter list */}
      {voters.length > 0 ? (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-text">
              Added{" "}
              <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                {voters.length}
              </span>
            </h3>
            <button
              type="button"
              onClick={() => setVoters([])}
              className="text-xs text-error hover:underline"
            >
              Clear all
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto rounded-lg border border-border divide-y divide-border">
            {voters.map((voter, index) => (
              <div
                key={index}
                className="flex items-center justify-between px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-text">{voter.name}</p>
                  <p className="text-xs text-muted">{voter.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeVoter(index)}
                  className="text-muted hover:text-error transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-dashed border-border p-6 text-center">
          <p className="text-muted text-sm">No additional voters added yet.</p>
          <p className="text-muted text-xs mt-1">
            You can skip this step if all participants were already handled in the
            previous step.
          </p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border px-6 py-2 text-text text-sm hover:bg-background transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-primary px-6 py-2 text-sm text-white hover:bg-primary/90 transition"
        >
          {voters.length === 0 ? "Skip & Continue" : "Save & Continue"}
        </button>
      </div>
    </Card>
  );
}

export default VotersStep;
