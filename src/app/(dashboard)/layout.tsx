import { SidebarProvider } from "@/components/layout/sidebar-context";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col min-w-0 transition-all duration-300">
          <Header />
          <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

