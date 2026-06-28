import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { FaBuilding } from "react-icons/fa";
import { MdHowToVote } from "react-icons/md";
import useDashboard from "../../hooks/useDashboard";
import {
  getMyMemberships,
  getElections,
  getElectionStatus,
  formatElectionDate,
} from "../../api/organisationApi";
import Card from "../../components/ui/Card";

const STATUS_BADGE = {
  live: "bg-green-500/15 text-green-400 border-green-500/20",
  upcoming: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  completed: "bg-white/10 text-muted border-white/10",
};

const ROLE_BADGE = {
  admin: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  official: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  member: "bg-green-500/15 text-green-400 border-green-500/20",
};

function VoterOrganisationsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("My Organisations");
    setSubtitle("Organisations you belong to");
  }, [setPageTitle, setSubtitle]);

  // Memberships are the source of truth for which orgs the voter belongs to.
  const {
    data: memberships = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-memberships"],
    queryFn: getMyMemberships,
  });

  // Elections the voter is part of, shown grouped under each organisation.
  const { data: elections = [] } = useQuery({
    queryKey: ["elections"],
    queryFn: () => getElections(),
  });

  const electionsByOrg = useMemo(() => {
    const map = {};
    for (const e of elections) {
      const orgId = e.organisation?.id ?? "unknown";
      (map[orgId] ??= []).push(e);
    }
    return map;
  }, [elections]);

  // One organisation per membership (a user has at most one membership per org).
  const organisations = useMemo(
    () =>
      memberships
        .filter((m) => m.organisation)
        .map((m) => ({
          org: m.organisation,
          role: m.role,
          elections: electionsByOrg[m.organisation.id] ?? [],
        })),
    [memberships, electionsByOrg],
  );

  if (isLoading) {
    return <div className="p-6 text-muted text-sm">Loading organisations…</div>;
  }

  if (isError) {
    return (
      <div className="p-6 text-error text-sm">
        Failed to load organisations. Please refresh.
      </div>
    );
  }

  if (organisations.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <FaBuilding className="text-primary text-2xl" />
        </div>
        <div>
          <p className="text-text font-semibold">No organisations yet</p>
          <p className="text-muted text-sm mt-1">
            You are not a member of any organisation yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <p className="text-muted text-sm mb-6">
        {organisations.length} organisation
        {organisations.length !== 1 ? "s" : ""}
      </p>

      <div className="flex flex-col gap-6">
        {organisations.map(({ org, role, elections: orgElections }) => {
          const orgName = org.name ?? "Unknown Organisation";
          const initial = orgName.charAt(0).toUpperCase();

          return (
            <Card
              key={org.id ?? orgName}
              className="p-5 sm:p-6 border-white/10 rounded-xl flex flex-col gap-5"
            >
              {/* Org header */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary text-xl font-bold">
                    {initial}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-text font-bold text-lg truncate">
                    {orgName}
                  </p>
                  {org.description && (
                    <p className="text-muted text-sm truncate">
                      {org.description}
                    </p>
                  )}
                </div>
                {role && (
                  <span
                    className={`shrink-0 px-2.5 py-0.5 rounded text-xs font-semibold border capitalize ${
                      ROLE_BADGE[role] ?? "bg-white/10 text-muted border-white/10"
                    }`}
                  >
                    {role}
                  </span>
                )}
              </div>

              {/* Elections list */}
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3 flex items-center gap-2">
                  <MdHowToVote className="text-base" />
                  Elections ({orgElections.length})
                </p>

                {orgElections.length === 0 ? (
                  <p className="text-muted text-sm">
                    You are not enrolled in any elections here yet.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {orgElections.map((e) => {
                      const status = getElectionStatus(e);
                      return (
                        <div
                          key={e.id}
                          className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-background"
                        >
                          <div className="min-w-0">
                            <p className="text-text text-sm font-medium truncate">
                              {e.name}
                            </p>
                            <p className="text-muted text-xs mt-0.5">
                              {formatElectionDate(e.date_time_occuring)} →{" "}
                              {formatElectionDate(e.date_time_ending)}
                            </p>
                          </div>

                          <span
                            className={`shrink-0 px-2.5 py-0.5 rounded text-xs font-semibold border capitalize ${
                              STATUS_BADGE[status] ?? STATUS_BADGE.completed
                            }`}
                          >
                            {status === "live" ? "● Live" : status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default VoterOrganisationsPage;
