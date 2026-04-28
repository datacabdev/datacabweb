"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F0F2FA] overflow-hidden">
      <AdminSidebar
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 h-14 flex items-center shrink-0">
          <button
            className="md:hidden mr-3 text-gray-600 hover:text-gray-900"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 leading-tight">Datacab</p>
              <p className="text-xs text-gray-400 leading-tight">ADMIN</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-400 mt-1">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
              </svg>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
