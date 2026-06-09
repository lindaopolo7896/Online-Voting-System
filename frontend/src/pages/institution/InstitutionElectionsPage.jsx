import ElectionStats from "../../features/elections/ElectionStats";
import ElectionsTable from "../../features/elections/ElectionsTable";
import useDashboard from "../../hooks/useDashboard";
import { useEffect } from "react";

function InstitutionElectionsPage() {
  const { setPageTitle, setSubtitle } = useDashboard();
  useEffect(() => {
    setPageTitle("Elections");
    setSubtitle("Here is what is happening with your eectionss");
  }, [setPageTitle, setSubtitle]);
  return (
    <div className="p-6 flex flex-col gap-5">
      <ElectionStats />
      <ElectionsTable />
    </div>
  );
}

export default InstitutionElectionsPage;
