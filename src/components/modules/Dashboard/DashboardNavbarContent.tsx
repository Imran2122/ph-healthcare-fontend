"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NavSection } from "@/types/dashboardtypes";
import { UserInfo } from "@/types/user.type";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import DashbaordMobileSidebar from "./DashbaordMobileSidebar";
import { Input } from "@/components/ui/input";
import NotficationDropDown from "./NotficationDropDown";
import UserDropDown from "./UserDropDown";

interface DashbaordNavbarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardNavbarContent = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashbaordNavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setisMobile] = useState(false);

  useEffect(() => {
    const chaeckSmallerScreen = () => {
      setisMobile(window.innerWidth < 768);
    };

    chaeckSmallerScreen();
    window.addEventListener("resize", chaeckSmallerScreen);

    return () => {
      window.removeEventListener("resize", chaeckSmallerScreen);
    };
  }, []);

  return (
    <div className="flex h-16 w-full shrink-0 items-center gap-3 border-b bg-background px-4 md:px-6">
      {/* Mobile menu Toggle Button and Munu */}
      <Sheet open={isOpen && isMobile} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          }
        />
        <SheetContent side="left" className="w-64 p-0">
          <DashbaordMobileSidebar
            userInfo={userInfo}
            navItems={navItems}
            dashboardHome={dashboardHome}
          ></DashbaordMobileSidebar>
        </SheetContent>
      </Sheet>

      <div className="relative hidden min-w-0 flex-1 sm:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input type="text" placeholder="Search..." className="pl-9 pr-4" />
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <NotficationDropDown />
        <UserDropDown userInfo={userInfo} />
      </div>
    </div>
  );
};

export default DashboardNavbarContent;
