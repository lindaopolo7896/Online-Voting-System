import ElectionStats from "../../features/elections/ElectionStats";
import ElectionsTable from "../../features/elections/ElectionsTable";
import useDashboard from "../../hooks/useDashboard";
import { useEffect } from "react";

function OrganisationElectionsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Elections");
    setSubtitle("Manage and monitor all your elections");
  }, [setPageTitle, setSubtitle]);
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">
      <ElectionStats />
      <ElectionsTable />
    </div>
  );
}

export default OrganisationElectionsPage;
