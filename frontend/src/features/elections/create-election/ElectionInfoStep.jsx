import { CalendarDays } from "lucide-react";
import Card from "../../../components/ui/Card";

function ElectionInfoStep({ formData, setFormData, onNext }) {
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

      <div className="space-y-5">
        {/* Election Title */}
        <div>
          <label className="mb-2 block text-sm font-medium text-text">
            Election Title <span className="text-error">*</span>
          </label>

          <input
            type="text"
            placeholder="e.g 2026 Student Council Elections"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Description (Optional)
          </label>

          <textarea
            rows={4}
            placeholder="Brief description about this election..."
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none"
          />
        </div>

        {/* Schedule Section */}
        <div className="pt-2">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays size={18} />

            <span className="font-medium">Schedule</span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Start Date & Time *
              </label>

              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                End Date & Time *
              </label>

              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleChange("endDate", e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Timezone */}
        <div>
          <label className="mb-2 block text-sm font-medium">Timezone *</label>

          <select
            value={formData.timezone}
            onChange={(e) => handleChange("timezone", e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none"
          >
            <option value="">Select Timezone</option>

            <option value="Africa/Nairobi">Africa/Nairobi (UTC+3)</option>

            <option value="Europe/London">Europe/London</option>

            <option value="America/New_York">America/New York</option>
          </select>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          className="rounded-lg border border-slate-200 px-5 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onNext}
          className="rounded-lg bg-primary px-6 py-2 text-white"
        >
          Save & Continue
        </button>
      </div>
    </Card>
  );
}

export default ElectionInfoStep;
