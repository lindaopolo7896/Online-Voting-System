import { Building2, BriefcaseBusiness, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../ui/Button";
import { getMyVotingLinks, formatElectionDate } from "../../api/organisationApi";

export default function VotingAccess() {
  const { data: links = [], isLoading, isError } = useQuery({
    queryKey: ["my-voting-links"],
    queryFn: getMyVotingLinks,
  });

  // First non-used, non-expired link
  const activeLink = links.find(
    (l) => !l.is_used && (!l.expires_at || new Date(l.expires_at) > new Date()),
  ) ?? links[0] ?? null;

  // Persist active link so VotePage can use it without re-fetching
  if (activeLink) {
    localStorage.setItem("activeVotingLink", JSON.stringify(activeLink));
  }

  const election = activeLink?.election ?? null;
  const org = election?.organisation ?? null;

  if (isLoading) {
    return (
      <AuthLayout className="flex items-center justify-center">
        <p className="text-muted">Loading voting details…</p>
      </AuthLayout>
    );
  }

  if (isError || !activeLink) {
    return (
      <AuthLayout className="flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-text font-semibold text-lg">No Active Voting Link</p>
          <p className="text-muted mt-2 text-sm">
            You don't have an active voting link. Contact the election admin if
            you believe this is an error.
          </p>
        </div>
      </AuthLayout>
    );
  }

  if (activeLink.is_used) {
    return (
      <AuthLayout className="flex items-center justify-center">
        <div className="text-center max-w-sm">
          <p className="text-text font-semibold text-lg">Already Voted</p>
          <p className="text-muted mt-2 text-sm">
            You have already cast your vote for this election.
          </p>
          <Link to="/voter/results" className="mt-4 inline-block text-primary hover:underline text-sm">
            View results →
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout className="max-h-screen flex items-center justify-center bg-transparent px-4">
      <div className="w-full flex flex-col gap-5 max-w-lg rounded-[32px] border">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold text-text">Secure Voting Access</h1>
          <p className="text-muted mt-3 leading-relaxed max-w-sm">
            This link grants you access to participate in the election. Please
            verify the details below.
          </p>
        </div>

        <div className="mt-3 rounded-3xl border border-border bg-surface overflow-hidden">
          <InfoRow
            icon={<Building2 className="w-5 h-5 text-blue-500" />}
            label="Organisation"
            value={org?.name ?? "—"}
          />

          <Divider />

          <InfoRow
            icon={<BriefcaseBusiness className="w-5 h-5 text-primary" />}
            label="Election"
            value={election?.name ?? "—"}
          />

          <Divider />

          <InfoRow
            icon={<CalendarDays className="w-5 h-5 text-primary" />}
            label="Election Ends"
            value={formatElectionDate(election?.date_time_ending)}
            subtext={
              activeLink.expires_at
                ? `Link expires: ${formatElectionDate(activeLink.expires_at)}`
                : undefined
            }
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
