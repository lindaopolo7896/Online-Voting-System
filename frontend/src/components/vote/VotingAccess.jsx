import { Building2, BriefcaseBusiness, CalendarDays } from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function VotingAccess() {
  return (
    <AuthLayout className="max-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full flex flex-col gap-5 max-w-lg rounded-[32px] border ">
        {/* Top Icon */}
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-text">Secure Voting Access</h1>
          <p className="text-muted mt-3 leading-relaxed max-w-sm">
            This link grants you access to participate in the election. Please
            verify the details below.
          </p>
        </div>

        {/* Details Card */}
        <div className="mt-3 rounded-3xl border border-border bg-surface overflow-hidden">
          <InfoRow
            icon={<Building2 className="w-5 h-5 text-blue-500" />}
            label="Organization"
            value="ABC University"
          />

          <Divider />

          <InfoRow
            icon={<BriefcaseBusiness className="w-5 h-5 text-primary" />}
            label="Election"
            value="Student Council Election 2026"
          />

          <Divider />

          <InfoRow
            icon={<CalendarDays className="w-5 h-5 text-primary" />}
            label="Election Ends"
            value="June 30, 2026 • 11:59 PM"
            subtext="EAT (East Africa Time)"
          />

          <Divider />
        </div>

        {/* Button */}
        <Link to={"/voting-instructions"} className="w-full ">
          <Button name={"Continue"} />
        </Link>
      </div>
    </AuthLayout>
  );
}

function InfoRow({ icon, label, value, subtext }) {
  return (
    <div className="flex gap-4 p-5">
      <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-sm text-gray-400">{label}</p>

        <h3 className="text-white font-semibold text-lg mt-1">{value}</h3>

        {subtext && <p className="text-sm text-blue-300 mt-1">{subtext}</p>}
      </div>
    </div>
  );
}

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent mx-5" />
  );
}
