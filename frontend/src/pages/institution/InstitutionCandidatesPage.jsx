import CandidatesTable from "../../features/candidates/CandidatesTable";
import CandidateStats from "../../features/candidates/CandidateStats";

function InstitutionCandidatesPage() {
  return (
    <div className="p-5 flex-col gap-5 flex">
      <CandidateStats />
      <CandidatesTable />
    </div>
  );
}

export default InstitutionCandidatesPage;
