import VotersTable from "../../features/voters/VotersTable";
import VoterStats from "../../features/voters/VoterStats";

function InstitutionVotersPage() {
  return (
    <div className="p-5 flex flex-col gap-5">
      <VoterStats />
      <VotersTable />
    </div>
  );
}

export default InstitutionVotersPage;
