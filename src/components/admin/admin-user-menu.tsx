"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut } from "lucide-react";

export function AdminUserMenu({
  name,
  email,
  role,
}: {
  name: string | null;
  email: string | null;
  role: string | null;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (name ?? email ?? "A").slice(0, 1).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-admin-bg"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-admin-accent text-xs font-semibold text-white">
          {initials}
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-xs font-medium text-admin-text">{name ?? email}</span>
          <span className="block text-[10px] uppercase tracking-wide text-admin-text-muted">{role}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-admin-text-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-sm border border-admin-border bg-admin-surface py-1 shadow-lg">
          <div className="border-b border-admin-border px-3 py-2">
            <p className="text-xs font-medium text-admin-text">{email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-admin-text hover:bg-admin-bg"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
