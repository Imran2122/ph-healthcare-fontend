import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import React from "react";

const RootDashboardlayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* dashboard Side bar */}
      <DashboardSidebar></DashboardSidebar>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* dashbaord Navbar */}
        <DashboardNavbar></DashboardNavbar>

        <main className="min-w-0 flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
};

export default RootDashboardlayout;
