import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import TopBar from "../components/common/TopBar";

function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar />

        <main className="flex-1 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
