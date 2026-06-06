import {
  ShieldCheck,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Shield,
  Lock,
  ArrowRight,
} from "lucide-react";
import AuthLayout from "../../layouts/AuthLayout";
import { Link } from "react-router-dom";

export default function VotingAccess() {
  return (
    <AuthLayout className="max-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full max-h-[600px] max-w-lg rounded-[32px] border border-blue-500/20 bg-[#050816]/90 backdrop-blur-xl p-6 shadow-[0_0_40px_rgba(37,99,235,0.15)]">
        {/* Top Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-6">
            <div className="absolute -left-6 top-6 w-2 h-2 rounded-full bg-blue-500 blur-[2px]" />
            <div className="absolute -right-5 top-10 w-2 h-2 rounded-full bg-blue-500 blur-[2px]" />
          </div>

          <h1 className="text-3xl font-bold text-white">
            Secure Voting Access
          </h1>

          <p className="text-gray-400 mt-3 leading-relaxed max-w-sm">
            This link grants you access to participate in the election. Please
            verify the details below.
          </p>
        </div>

        {/* Details Card */}
        <div className="mt-8 rounded-3xl border border-blue-500/15 bg-[#0A1022]/80 overflow-hidden">
          <InfoRow
            icon={<Building2 className="w-5 h-5 text-blue-500" />}
            label="Organization"
            value="ABC University"
          />

          <Divider />

          <InfoRow
            icon={<BriefcaseBusiness className="w-5 h-5 text-blue-500" />}
            label="Election"
            value="Student Council Election 2026"
          />

          <Divider />

          <InfoRow
            icon={<CalendarDays className="w-5 h-5 text-blue-500" />}
            label="Election Ends"
            value="June 30, 2026 • 11:59 PM"
            subtext="EAT (East Africa Time)"
          />

          <Divider />
        </div>

        {/* Security Notice */}
        <div className="mt-5 rounded-2xl border border-blue-500/15 bg-[#09101F] p-4 flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
            <Lock className="w-5 h-5 text-white" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold">
                Your connection is secure
              </h3>

              <div className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>

            <p className="text-sm text-gray-400 mt-1">
              Your data and vote are protected.
            </p>
          </div>
        </div>

        {/* Button */}
        <Link to={"/vote"}>
          <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 transition-all duration-300 text-white font-medium py-4 rounded-2xl flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(37,99,235,0.45)]">
            Continue
            <ArrowRight className="w-5 h-5" />
          </button>
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
