import { useForm } from "react-hook-form";
import { CalendarDays } from "lucide-react";
import Card from "@/components/ui/Card";

function ElectionInfoStep({ formData, setFormData, onNext }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
    },
  });

  const startDate = watch("startDate");

  function onSubmit(data) {
    setFormData(data);
    onNext();
  }

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">
          Election Information & Schedule
        </h2>
        <p className="mt-1 text-sm text-muted">
          Provide the basic details and schedule for your election
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Election Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Election Title <span className="text-error">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g 2026 Student Council Elections"
            {...register("title", { required: "Election title is required" })}
            className={`w-full rounded-lg border px-4 py-3 outline-none text-text bg-background transition-colors ${
              errors.title ? "border-error focus:border-error" : "border-border focus:border-primary"
            }`}
          />
          {errors.title && (
            <p className="mt-1.5 text-xs text-error">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Description <span className="text-muted text-xs">(Optional)</span>
          </label>
          <textarea
            rows={4}
            placeholder="Brief description about this election..."
            {...register("description")}
            className="w-full rounded-lg border border-border px-4 py-3 outline-none text-text bg-background focus:border-primary transition-colors resize-none"
          />
        </div>

        {/* Schedule */}
        <div className="pt-2">
          <div className="mb-4 flex items-center gap-2 text-text">
            <CalendarDays size={18} />
            <span className="font-medium">Schedule</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                Start Date & Time <span className="text-error">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("startDate", {
                  required: "Start date is required",
                  validate: (v) =>
                    new Date(v) > new Date() || "Start date must be in the future",
                })}
                className={`w-full rounded-lg border px-4 py-3 outline-none text-text bg-background transition-colors ${
                  errors.startDate ? "border-error" : "border-border focus:border-primary"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1.5 text-xs text-error">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-text">
                End Date & Time <span className="text-error">*</span>
              </label>
              <input
                type="datetime-local"
                {...register("endDate", {
                  required: "End date is required",
                  validate: (v) =>
                    !startDate ||
                    new Date(v) > new Date(startDate) ||
                    "End date must be after start date",
                })}
                className={`w-full rounded-lg border px-4 py-3 outline-none text-text bg-background transition-colors ${
                  errors.endDate ? "border-error" : "border-border focus:border-primary"
                }`}
              />
              {errors.endDate && (
                <p className="mt-1.5 text-xs text-error">{errors.endDate.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            className="rounded-lg border border-border px-5 py-2 text-text text-sm hover:bg-background transition"
          >
            Cancel
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

export default ElectionInfoStep;
