"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Calendar, CheckCircle, Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

interface Notifaction {
  id: string;
  title: string;
  message: string;
  type: "appointment" | "schedule" | "system" | "user";
  timeStamp: Date;
  read: boolean;
}

export const Mock_NOTIFICATION: Notifaction[] = [
  {
    id: "1",
    title: "Appointment confirmed",
    message: "Your appointment with Dr. Sarah Ahmed is confirmed.",
    type: "appointment",
    timeStamp: new Date("2026-11-25T09:00:00"),
    read: false,
  },
  {
    id: "2",
    title: "Schedule updated",
    message: "Your consultation schedule has been updated.",
    type: "schedule",
    timeStamp: new Date("2026-11-24T15:30:00"),
    read: false,
  },
  {
    id: "3",
    title: "Profile updated",
    message: "Your profile information was successfully updated.",
    type: "user",
    timeStamp: new Date("2026-11-23T11:15:00"),
    read: true,
  },
  {
    id: "4",
    title: "Service notice",
    message: "Our support team is available if you need assistance.",
    type: "system",
    timeStamp: new Date("2026-11-22T08:45:00"),
    read: true,
  },
];

const getNitificationIcon = (type: Notifaction["type"]) => {
  switch (type) {
    case "appointment":
      return <Calendar className="h4 w-4 text-blue-600"></Calendar>;
    case "schedule":
      return <Clock className="h4 w-4 text-green-600"></Clock>;
    case "system":
      return <CheckCircle className="h4 w-4 text-purple-600"></CheckCircle>;
    case "appointment":
      return <User className="h4 w-4 text-green-600"></User>;
    default:
      return <Bell className="h4 w-4 text-gray-600"></Bell>;
  }
};
const NotficationDropDown = () => {
  const unreadCount = Mock_NOTIFICATION.filter(
    (Notification) => !Notification.read,
  ).length;
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="relative"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none text-destructive-foreground">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <span>Notificataion</span>
              {unreadCount > 0 && (
                <Badge variant={"secondary"} className="ml-2">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
              {Mock_NOTIFICATION.length > 0 ? (
                Mock_NOTIFICATION.map((Notification) => (
                  <DropdownMenuItem
                    key={Notification.id}
                    className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                  >
                    <div className="mt-0.5">
                      {getNitificationIcon(Notification.type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium leading-none">
                          {Notification.title}
                        </p>

                        {!Notification.read && (
                          <div className="h-2 w-2 rounded-full bg-blue-600" />
                        )}
                      </div>
                      <p className="text-xl text-muted-foreground line-clamp-2">
                        {Notification.message}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(Notification.timeStamp, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">
                  No Notification Found
                </div>
              )}
            </ScrollArea>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="text-center justify-center cursor-pointer">
            View All Notification
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotficationDropDown;
