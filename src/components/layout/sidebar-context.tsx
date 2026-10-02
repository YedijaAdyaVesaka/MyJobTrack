"use client";

import { createContext, useContext, useState, useSyncExternalStore } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setIsCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  return localStorage.getItem("sidebar_collapsed") === "true";
}

function getServerSnapshot() {
  return false;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isStoredCollapsed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [localCollapsed, setLocalCollapsed] = useState<boolean | null>(null);

  const isCollapsed = localCollapsed ?? isStoredCollapsed;

  const setIsCollapsed = (collapsed: boolean) => {
    setLocalCollapsed(collapsed);
    localStorage.setItem("sidebar_collapsed", String(collapsed));
  };

  const toggleSidebar = () => {
    const next = !isCollapsed;
    setLocalCollapsed(next);
    localStorage.setItem("sidebar_collapsed", String(next));
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setIsCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
