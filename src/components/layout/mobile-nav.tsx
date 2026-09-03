"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  Columns3,
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { href: "/dasbor", label: "Dasbor", icon: LayoutDashboard },
  { href: "/lamaran", label: "Lamaran", icon: FileText },
  { href: "/kanban", label: "Kanban", icon: Columns3 },
  { href: "/statistik", label: "Statistik", icon: BarChart3 },
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

const bottomNavItems = [
  { href: "/dasbor", label: "Dasbor", icon: LayoutDashboard },
  { href: "/lamaran", label: "Lamaran", icon: FileText },
  { href: "/kanban", label: "Kanban", icon: Columns3 },
  { href: "/statistik", label: "Statistik", icon: BarChart3 },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  return (
    <>
      <div className="md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          aria-label="Buka Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-200"
            onClick={() => setOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-[270px] bg-background border-r border-border p-5 flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm">
                  <Briefcase className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-base font-bold tracking-tight">MyJobTrack</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                aria-label="Tutup Menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 flex-1">
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary/10 text-primary font-semibold shadow-xs"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-3 pt-4 border-t border-border/60">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-medium text-muted-foreground">Tema Tampilan</span>
                <ThemeToggle />
              </div>
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Keluar dari Akun</span>
              </button>
            </div>
          </div>
        </>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="grid grid-cols-5 items-center h-14 px-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium transition-colors",
                  isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4 transition-transform", isActive && "scale-110")} />
                <span className="truncate max-w-[60px] text-center">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <Menu className="h-4 w-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>
    </>
  );
}
