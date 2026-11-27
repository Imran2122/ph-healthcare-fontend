"use client";
import { Separator } from "@/components/ui/separator";
import { getIconComponensts } from "@/lib/iconMapper";
import { NavSection } from "@/types/dashboardtypes";
import { UserInfo } from "@/types/user.type";
import { cn } from "cn";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface DashboardSidebarContentProps {
  userInfo: UserInfo;
  navItems: NavSection[];
  dashboardHome: string;
}

const DashboardSidebarContent = ({
  dashboardHome,
  navItems,
  userInfo,
}: DashboardSidebarContentProps) => {
  const pathname = usePathname();
  const initial = userInfo?.name?.charAt(0)?.toUpperCase() || "U";
  const role = userInfo?.role?.toLowerCase().replaceAll("_", " ") || "user";
  const activeHref = navItems
    .flatMap((section) => section.items)
    .map((item) => item.href)
    .filter(
      (href) => pathname === href || pathname.startsWith(`${href}/`),
    )
    .sort((first, second) => second.length - first.length)[0];

  return (
    <div className="hidden h-full w-64 shrink-0 flex-col border-r bg-card md:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Link href={dashboardHome}>
          <span className="text-xl font-bold text-primary">Ph Healthcare</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto overscroll-contain px-3 py-4">
        {navItems.map((section, sectionId) => (
          <div key={sectionId}>
            {section.title && (
              <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </h4>
            )}

            <div className="space-y-1">
              {section.items.map((item, id) => {
                const isActive = item.href === activeHref;

                const Icon = getIconComponensts(item.icon);

                return (
                  <Link
                    href={item.href}
                    key={id}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
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

      {/* User Info */}
      <div className="border-t px-3 py-4">
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

export default DashboardSidebarContent;
