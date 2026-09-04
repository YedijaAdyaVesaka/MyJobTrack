"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Settings, LogOut, CheckCircle2, X, PanelLeft } from "lucide-react";
import { MobileNav } from "./mobile-nav";
import { createClient } from "@/lib/supabase/client";
import { useSidebar } from "@/components/layout/sidebar-context";

export function Header({ title }: { title?: string }) {
  const [email, setEmail] = useState<string | null>(null);
  const [initial, setInitial] = useState<string>("U");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setEmail(user.email);
        setInitial(user.email.charAt(0).toUpperCase());
      }
    };
    fetchUser();
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/lamaran`);
      setShowSearchInput(false);
    }
  };

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
        {/* Quick Search */}
        <div className="relative">
          {showSearchInput ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1">
              <input
                type="text"
                placeholder="Cari..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-8 w-36 md:w-48 rounded-md border border-input bg-background px-2.5 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowSearchInput(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowSearchInput(true)}
              title="Cari"
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <Search className="h-[17px] w-[17px]" />
            </button>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowUserMenu(false);
            }}
            title="Notifikasi"
            className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Bell className="h-[17px] w-[17px]" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-border/60 bg-popover p-3 text-popover-foreground shadow-xl z-50 animate-slide-up">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                <span className="text-xs font-semibold">Notifikasi & Agenda</span>
                <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">Terbaru</span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <div className="flex gap-2.5 rounded-lg p-2 hover:bg-muted/50 transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Sistem MyJobTrack Siap Pakai</p>
                    <p className="text-[11px] text-muted-foreground">Pantau seluruh lamaran kerja kamu secara terstruktur.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
                className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors text-left"
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
