"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { LogOut, ChevronDown } from "lucide-react";
import type { Session } from "next-auth";

interface UserMenuProps {
  session: Session;
  compact?: boolean;
}

export function UserMenu({ session, compact }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      case "editor":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (compact) {
    return (
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-muted/80 transition-all duration-200 active:scale-95"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center text-sm font-semibold shadow-sm ring-2 ring-background">
            {getInitials(session.user.name || "User")}
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
              }`}
          />
        </button>

        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 mt-2 w-64 rounded-xl border bg-card/95 backdrop-blur-sm shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-semibold shadow-sm">
                    {getInitials(session.user.name || "User")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {session.user.email}
                    </p>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-2 ${getRoleBadgeColor(
                        session.user.role
                      )}`}
                    >
                      {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/auth/login" })}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-all duration-200 active:scale-[0.98]"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-semibold shadow-sm ring-2 ring-background">
          {getInitials(session.user.name || "User")}
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{session.user.name}</p>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mt-1 ${getRoleBadgeColor(
              session.user.role
            )}`}
          >
            {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-2 right-2 mb-2 rounded-xl border bg-card/95 backdrop-blur-sm shadow-xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="p-4 border-b">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
                className="cursor-pointer w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-white transition-all duration-200 active:scale-95"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
