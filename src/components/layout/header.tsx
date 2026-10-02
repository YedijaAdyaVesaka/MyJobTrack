"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Settings,
  LogOut,
  CheckCircle2,
  PanelLeft,
  Calendar,
  Briefcase,
} from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderSearch } from "./header-search";
import { createClient } from "@/lib/supabase/client";
import { useSidebar } from "@/components/layout/sidebar-context";
import type { JobApplication } from "@/lib/types";

export function Header({ title }: { title?: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>("U");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ignore = false;
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!ignore && user?.email) {
          setEmail(user.email);
          setInitial(user.email.charAt(0).toUpperCase());
        }
        const { data: apps } = await supabase
          .from("job_applications")
          .select("*")
          .eq("is_deleted", false)
          .order("applied_date", { ascending: false });

        if (!ignore && apps) {
          setApplications(apps);
        }
      } catch (err) {
        console.error("Error loading header data:", err);
      }
    }
    loadData();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target as Node)) {
        setShowNotifMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/masuk");
  };

  const upcomingFollowUps = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return applications.filter((a) => {
      if (!a.follow_up_date) return false;
      const d = new Date(a.follow_up_date);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() >= today.getTime();
    }).slice(0, 4);
  }, [applications]);

  const interviewAlerts = useMemo(() => {
    return applications.filter((a) => a.status === "interview").slice(0, 3);
  }, [applications]);

  const hasNotifications = upcomingFollowUps.length > 0 || interviewAlerts.length > 0;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/70 backdrop-blur-xl px-4 md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <button
          onClick={toggleSidebar}
          title={isCollapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          className="max-md:hidden md:flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
      </div>
      <div className="flex items-center gap-2">
        {/* Real-time Search Engine */}
        <HeaderSearch />

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowUserMenu(false);
            }}
            title="Notifikasi & Agenda"
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
          >
            <Bell className="h-[17px] w-[17px]" />
            {hasNotifications && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-border/60 bg-popover p-3 text-popover-foreground shadow-2xl z-50 animate-slide-up">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                <span className="text-xs font-semibold">Notifikasi & Agenda</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {upcomingFollowUps.length + interviewAlerts.length} Agenda
                </span>
              </div>

              <div className="flex flex-col gap-2 text-xs max-h-72 overflow-y-auto">
                {upcomingFollowUps.map((app) => (
                  <div
                    key={`followup-${app.id}`}
                    onClick={() => {
                      router.push(`/lamaran?q=${encodeURIComponent(app.company_name)}`);
                      setShowNotifMenu(false);
                    }}
                    className="flex gap-2.5 rounded-xl p-2.5 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/20 transition-colors cursor-pointer"
                  >
                    <Calendar className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-xs">{app.company_name}</p>
                      <p className="text-[11px] text-muted-foreground">Follow-up: {app.position}</p>
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                        Jadwal: {new Date(app.follow_up_date!).toLocaleDateString("id-ID", { day: "numeric", month: "long" })}
                      </p>
                    </div>
                  </div>
                ))}

                {interviewAlerts.map((app) => (
                  <div
                    key={`interview-${app.id}`}
                    onClick={() => {
                      router.push(`/lamaran?q=${encodeURIComponent(app.company_name)}`);
                      setShowNotifMenu(false);
                    }}
                    className="flex gap-2.5 rounded-xl p-2.5 bg-amber-500/5 hover:bg-amber-500/10 border border-amber-500/20 transition-colors cursor-pointer"
                  >
                    <Briefcase className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-xs">{app.company_name}</p>
                      <p className="text-[11px] text-muted-foreground">Tahap Wawancara: {app.position}</p>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                        Sedang Berjalan
                      </span>
                    </div>
                  </div>
                ))}

                {!hasNotifications && (
                  <div className="flex gap-2.5 rounded-xl p-3 bg-muted/40 text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-xs">Semua Lamaran Terkendali</p>
                      <p className="text-[11px] text-muted-foreground">Belum ada agenda follow-up mendesak untuk saat ini.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Profile Avatar & Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifMenu(false);
            }}
            className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-xs font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {initial}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border/60 bg-popover p-1.5 text-popover-foreground shadow-xl z-50 animate-slide-up">
              <div className="px-3 py-2 border-b border-border mb-1">
                <p className="text-xs font-medium text-foreground truncate">{email || "Pengguna MyJobTrack"}</p>
                <p className="text-[11px] text-muted-foreground">Akun Terverifikasi</p>
              </div>
              <Link
                href="/pengaturan"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                <Settings className="h-4 w-4" />
                Pengaturan Akun
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
