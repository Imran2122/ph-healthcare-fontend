import { getDefaultDashboard } from "@/lib/authUtils";
import { getNavItemsByRole } from "@/lib/navItems";
import { getUserInfo } from "@/services/auth.service";
import { NavSection } from "@/types/dashboardtypes";
import React from "react";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {
  const userInfo = await getUserInfo();
  if (!userInfo) {
    return null;
  }
  const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboard(userInfo.role);
  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      dashboardHome={dashboardHome}
      navItems={navItems}
    ></DashboardNavbarContent>
  );
};

export default DashboardNavbar;
