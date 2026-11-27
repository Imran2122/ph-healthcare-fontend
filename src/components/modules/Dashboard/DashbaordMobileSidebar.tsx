"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SheetTitle } from "@/components/ui/sheet";
import { getIconComponensts } from "@/lib/iconMapper";
import { NavSection } from "@/types/dashboardtypes";
import { UserInfo } from "@/types/user.type";

import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface DashbaordMobileSidebarProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashbaordMobileSidebar = ({
  userInfo,
  navItems,
  dashboardHome,
}: DashbaordMobileSidebarProps) => {
  const pathName = usePathname();
  const initial = userInfo?.name?.charAt(0)?.toUpperCase() || "U";

  const role = userInfo?.role?.toLowerCase().replaceAll("_", " ") || "user";

  return (
    <div className="flex h-full flex-col">
      {/* logo /brand */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={dashboardHome}>
          <span className="text-xl font-bold text-primary">Ph HealthCare</span>
        </Link>
      </div>
      <SheetTitle className="sr-only"></SheetTitle>
      {/* navigation Area */}

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((section, sectionId) => (
            <div key={sectionId}>
              {section.title && (
                <h4 className="mb-2 px-3 text-xs font-bold text-muted-foreground uppercase ">
                  {section.title}
                </h4>
              )}

              <div className="space-y-1">
                {section.items.map((item, id) => {
                  const isActive = pathName === item.href;
                  const Icon = getIconComponensts(item.icon);

                  return (
                    <Link
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font font-medium transition-all",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      )}
                      href={item.href}
                      key={id}
                    >
                      <Icon className="h-4 w-4"></Icon>
                      <span className="flex-1">{item.title}</span>
                    </Link>
                  );
                })}
              </div>

              {sectionId < navItems.length - 1 && (
                <Separator className="my-4"></Separator>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* User Info */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
           
           
            <span className="text-sm font-semibold text-primary">
              {initial}
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {userInfo?.name || "Unknown User"}
            </p>

            <p className="text-xs capitalize text-muted-foreground">{role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashbaordMobileSidebar;
