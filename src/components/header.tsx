import { Bell, Atom, Sparkles } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/ui/UserDropdown";
import React from "react";

export function Header() {
  return (
    <>
      <head>
        <meta name="csrf-token" content="{{ csrf_token() }}"></meta>
      </head>
      <header className="sticky top-0 z-50 w-flex border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 w-full">
          <div className="flex flex-1 items-center justify-between">
            {/* Logo y nombre de la app */}
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6" />
              <span className="text-xl font-bold">BeautySalon</span>
            </div>
            {/* Acciones del header */}
            <div className="hidden md:flex items-center gap-4">
              <ModeToggle />
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Atom className="h-5 w-5" />
              </Button>
              {/* Dropdown del usuario */}
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
