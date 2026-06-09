import Card from "../../../components/ui/Card";
import { FileText } from "lucide-react";

function ElectionSummary({ formData }) {
  const hasData =
    formData.title ||
    formData.description ||
    formData.startDate ||
    formData.endDate;

  return (
    <Card className="p-6 border-white/10 rounded-xl">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Election Summary</h2>

        <p className="mt-1 text-sm text-slate-500">
          Your election details will appear here as you progress
        </p>
      </div>

      {!hasData ? (
        <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30">
            <FileText size={28} className="text-primary" />
          </div>

          <h3 className="font-medium">No details added yet</h3>

          <p className="mt-2 max-w-xs text-sm text-slate-500">
            Complete the steps to see your election summary
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase text-slate-500">Election Title</p>

            <p className="mt-1 font-medium">{formData.title || "-"}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">Description</p>

            <p className="mt-1 text-sm">{formData.description || "-"}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">Start Date</p>

            <p className="mt-1 text-sm">{formData.startDate || "-"}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">End Date</p>

            <p className="mt-1 text-sm">{formData.endDate || "-"}</p>
          </div>

          <div>
            <p className="text-xs uppercase text-slate-500">Timezone</p>

            <p className="mt-1 text-sm">{formData.timezone || "-"}</p>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ElectionSummary;
