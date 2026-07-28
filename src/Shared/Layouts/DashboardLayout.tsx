import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#f9fafb]">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
