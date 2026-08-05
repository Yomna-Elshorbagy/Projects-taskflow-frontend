import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f7f6]">
      <Sidebar />
      <main className="flex-1 ml-64 h-screen overflow-hidden flex flex-col">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
