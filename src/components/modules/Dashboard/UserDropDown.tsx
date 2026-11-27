import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "@/types/user.type";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface UserDropDownProps {
  userInfo: UserInfo;
}

const UserDropDown = ({ userInfo }: UserDropDownProps) => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" className="rounded-full">
              <span>{userInfo.name.charAt(0).toUpperCase()}</span>
            </Button>
          }
        />

        <DropdownMenuContent align={"end"} className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{userInfo.name}</p>
                <p className="text-xs text-muted-foreground">{userInfo.email}</p>
                <p className="text-xs text-primary capitalize">
                  {userInfo.role.toLocaleLowerCase().replace("_", "")}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={"my-profile"}>My Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href={"/change-password"}>change-password</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {}}
              className="cursor-pointer text-red-600"
            >
              <Link href={"/logout"}>
                <LogOut className="mr-2 h-4 w-4">Logout</LogOut>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropDown;
