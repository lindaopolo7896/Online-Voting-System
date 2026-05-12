import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/voter/Sidebar";

function VoterLayout() {
  return (
    <div className="flex ">
      <Sidebar />

      <div className="w-full lg:ml-80">
        <Outlet />
      </div>
    </div>
  );
}

export default VoterLayout;
