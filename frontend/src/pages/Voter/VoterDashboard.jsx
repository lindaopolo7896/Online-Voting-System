import { useEffect } from "react";
import useDashboard from "@/hooks/useDashboard";
import ElectionCard from "@/features/voter-dashboard/components/ElectionCard";
import LiveResults from "@/features/voter-dashboard/components/LiveResults";
import VotingProcess from "@/features/voter-dashboard/components/VotingProcess";
import { useVoterDashboard } from "@/features/voter-dashboard/hooks/useVoterDashboard";

function VoterDashboard() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Dashboard");
    setSubtitle("Welcome back");
  }, [setPageTitle, setSubtitle]);

  const { electionList, selectedElection, electionsLoading, setSelectedId } =
    useVoterDashboard();

  if (electionsLoading) {
    return <div className="p-6 text-muted text-sm">Loading elections…</div>;
  }

  if (!selectedElection) {
    return (
      <div className="p-6 text-muted text-sm">No elections available yet.</div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left — election card + live results */}
        <div className="flex flex-col gap-8 lg:flex-1 min-w-0">
          <ElectionCard
            elections={electionList}
            selectedElection={selectedElection}
            setSelectedElection={(e) => setSelectedId(e.id)}
          />
          <LiveResults election={selectedElection} />
        </div>

        {/* Right — voting process */}
        <div className="lg:w-80 shrink-0">
          <VotingProcess election={selectedElection} />
        </div>
      </div>
    </div>
  );
}

export default VoterDashboard;
