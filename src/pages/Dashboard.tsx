import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/overview/DashboardLayout";

import { useNavigate, useLocation, Outlet } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handlePageChange = (page: string) => {
    if (page === "settings") {
      // Navigate to the dedicated settings page
      navigate("/settings");
    } else {
      // Handle other page changes normally
      // Navigation is now handled by React Router
    }
  };

  return (
    <DashboardLayout onPageChange={handlePageChange}>
      <Outlet />
    </DashboardLayout>
  );
};

export default Dashboard;