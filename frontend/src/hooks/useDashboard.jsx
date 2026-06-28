import { useContext } from "react";
import { DashboardContext } from "@/app/providers/DashboardContext";

function useDashboard() {
  return useContext(DashboardContext);
}

export default useDashboard;
