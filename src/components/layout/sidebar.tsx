"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Columns3,
  BarChart3,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  return (
    <aside className="hidden md:flex w-[240px] flex-shrink-0 flex-col border-r border-border/60 sticky top-0 h-screen px-3.5 py-5 bg-card/50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2.5 pb-5 mb-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-sm">
          <Briefcase className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-base font-bold tracking-tight">MyJobTrack</span>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {isActive && (
                <span className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-full bg-primary" />
              )}
              <item.icon className="h-[17px] w-[17px] flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}

        <div className="h-px bg-border/60 my-3.5 mx-1" />

        {navBottom.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-[17px] w-[17px] flex-shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="flex flex-col gap-3 pt-3 border-t border-border/60">
        <div className="flex items-center justify-between px-2.5">
          <span className="text-xs text-muted-foreground">Tema</span>
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="h-[17px] w-[17px] flex-shrink-0" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
