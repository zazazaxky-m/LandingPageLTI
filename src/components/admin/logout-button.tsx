"use client";

import { LogOut } from "lucide-react";

import { buttonClasses } from "@/components/ui/button";
import { logoutAction } from "@/features/auth-actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className={buttonClasses("ghost", "min-h-9 px-3 text-xs")} type="submit">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </form>
  );
}
