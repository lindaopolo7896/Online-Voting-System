import { useContext } from "react";
import { DashboardContext } from "../contexts/DashboardContext";

function useDashboard() {
  return useContext(DashboardContext);
}

export default useDashboard;
