"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LayoutGrid, Image as ImageIcon, PenLine, Shield, LogOut, ChevronRight, X, Inbox } from "lucide-react";
import Image from "next/image";

const navItems = [
  { href: "/admin/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { href: "/admin/multimedia", icon: ImageIcon, label: "Multimedia" },
  { href: "/admin/blog", icon: PenLine, label: "Blog" },
  { href: "/admin/content", icon: Shield, label: "Content" },
  { href: "/admin/requests", icon: Inbox, label: "Requests" },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ mobileOpen, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onMobileClose}
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-100",
          "md:relative md:inset-auto md:z-auto md:translate-x-0 md:transition-[width] md:duration-300",
          "transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "w-[220px]",
          collapsed ? "md:w-[72px]" : "md:w-[100px]",
        ].join(" ")}
      >
        <div className="flex items-center pt-5 pb-4 border-b border-gray-100 px-4 md:flex-col md:items-center md:px-0">
          <Image src="/datacablogo.svg" alt="Datacab" width={36} height={36} />
          <span className={`font-black tracking-widest text-gray-800 ml-3 text-sm md:ml-0 md:mt-1 md:text-[10px] ${collapsed ? "md:hidden" : ""}`}>
            DATACAB
          </span>
          <button className="ml-auto md:hidden text-gray-400 hover:text-gray-600" onClick={onMobileClose}>
            <X size={20} />
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center py-3 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
        </button>

        <nav className="flex-1 flex flex-col gap-1 px-2 pt-2 md:items-center md:gap-2">
          {navItems.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                title={label}
                onClick={onMobileClose}
                className={`flex items-center gap-3 md:flex-col md:gap-1 w-full py-3 px-3 md:px-0 rounded-xl transition-colors ${
                  active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <Icon size={20} />
                <span className={`text-sm md:text-[9px] font-medium ${collapsed ? "md:hidden" : ""}`}>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col pb-5 px-2 md:items-center">
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-3 md:flex-col md:gap-1 w-full py-3 px-3 md:px-0 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
            <span className={`text-sm md:text-[9px] font-medium ${collapsed ? "md:hidden" : ""}`}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
