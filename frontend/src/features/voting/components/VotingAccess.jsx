import { BriefcaseBusiness, ShieldCheck, ListChecks } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import AuthLayout from "@/components/layout/AuthLayout";
import Button from "@/components/ui/Button";
import {
  getVotingSession,
  groupBallotByPosition,
} from "@/features/voting/session";

export default function VotingAccess() {
  const session = getVotingSession();

  if (!session) {
    return <Navigate to="/sign-in" replace />;
  }

  const positions = groupBallotByPosition(session.ballot);
  const candidateCount = session.ballot.length;

  return (
    <AuthLayout className="max-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full flex flex-col gap-5 max-w-lg ">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-text">Secure Voting Access</h1>
          <p className="text-muted mt-3 leading-relaxed max-w-sm">
            Your identity has been verified. Review the details below before you
            begin.
          </p>
        </div>

        <div className="mt-3 rounded-3xl border border-border bg-surface overflow-hidden">
          <InfoRow
            icon={<ShieldCheck className="w-5 h-5 text-blue-500" />}
            label="Verified voter"
            value={session.voter?.name || session.voter?.email || "—"}
          />

          <Divider />

          <InfoRow
            icon={<ListChecks className="w-5 h-5 text-primary" />}
            label="Positions on your ballot"
            value={
              positions.length > 0
                ? positions.map((p) => p.title).join(", ")
                : "—"
            }
            subtext={`${candidateCount} candidate${candidateCount === 1 ? "" : "s"} total`}
          />

          <Divider />

          <InfoRow
            icon={<BriefcaseBusiness className="w-5 h-5 text-primary" />}
            label="One vote per voter"
            value="This link can only be used once"
          />

          <Divider />
        </div>

        <Link to="/voting-instructions" className="w-full">
          <Button name="Continue" />
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
