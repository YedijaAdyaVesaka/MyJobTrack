"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Columns3,
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/layout/sidebar-context";

const navItems = [
  { href: "/dasbor", label: "Dasbor", icon: LayoutDashboard },
  { href: "/lamaran", label: "Lamaran", icon: FileText },
  { href: "/kanban", label: "Kanban Board", icon: Columns3 },
  { href: "/statistik", label: "Statistik", icon: BarChart3 },
];

const navBottom = [
  { href: "/pengaturan", label: "Pengaturan", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-shrink-0 flex-col border-r border-border/60 sticky top-0 h-screen bg-card/50 transition-all duration-300 ease-in-out z-20 relative",
        isCollapsed ? "w-[68px] px-2 py-4" : "w-[240px] px-3.5 py-4"
      )}
    >
      {/* Floating Edge Toggle Button */}
      <button
        onClick={toggleSidebar}
        title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
        className="absolute -right-3 top-5 z-30 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm hover:bg-accent hover:text-foreground transition-colors cursor-pointer"
      >
        <ChevronLeft className={cn("h-3.5 w-3.5 transition-transform duration-300", isCollapsed && "rotate-180")} />
      </button>

      {/* Logo Header */}
      <div
        className={cn(
          "flex items-center pb-4 mb-2 border-b border-border/40 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "px-1"
        )}
      >
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <Briefcase className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-bold tracking-tight text-foreground whitespace-nowrap">
              MyJobTrack
            </span>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1 flex-1 pt-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 group",
                isCollapsed ? "px-0 justify-center" : "px-3.5",
                isActive
                  ? "bg-muted/80 text-primary font-semibold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary"
                />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}

        <div className="h-px bg-border/60 my-3 mx-1" />

        {navBottom.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 group",
                isCollapsed ? "px-0 justify-center" : "px-3.5",
                isActive
                  ? "bg-muted/80 text-primary font-semibold shadow-2xs"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-primary"
                />
              )}
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/60">
        {!isCollapsed ? (
          <div className="flex items-center justify-between px-3">
            <span className="text-sm font-medium text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}

        <button
          onClick={handleLogout}
          title={isCollapsed ? "Keluar" : undefined}
          className={cn(
            "flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200 cursor-pointer group",
            isCollapsed ? "px-0 justify-center" : "px-3.5"
          )}
        >
          <LogOut className="h-4 w-4 shrink-0 transition-colors group-hover:text-destructive" />
          {!isCollapsed && <span>Keluar</span>}
        </button>
      </div>
    </aside>
  );
}
