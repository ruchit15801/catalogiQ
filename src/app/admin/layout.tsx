"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";

const adminNavItems = [
  { section: "Core", items: [
    { href: "/admin", icon: "ti-layout-dashboard", label: "Admin Overview" },
    { href: "/admin/users", icon: "ti-users", label: "User Management" },
    { href: "/admin/jobs", icon: "ti-photo-bolt", label: "Image Jobs" },
  ]},
  { section: "Financial", items: [
    { href: "/admin/subscriptions", icon: "ti-receipt", label: "Subscriptions" },
    { href: "/admin/credits", icon: "ti-coins", label: "Credit Management" },
  ]},
  { section: "Platform Data", items: [
    { href: "/admin/research", icon: "ti-database", label: "Research Database" },
    { href: "/admin/analytics", icon: "ti-chart-bar", label: "Deep Analytics" },
  ]},
  { section: "Configuration", items: [
    { href: "/admin/ai-config", icon: "ti-brain", label: "AI Configuration" },
    { href: "/admin/cms", icon: "ti-news", label: "Content (CMS)" },
  ]},
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-5 border-b border-[#1a1a2e] shrink-0">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-white" onClick={() => setSidebarOpen(false)}>
          <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center">
            <i className="ti ti-shield-lock text-white"></i>
          </div>
          Catalog<span className="text-[#A78BFA]">IQ</span> <span className="text-[#64748b] text-sm ml-1">Admin</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {adminNavItems.map((group) => (
          <div key={group.section}>
            <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.15em] mb-2 px-3 mt-5">{group.section}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-lg transition-all ${
                  isActive(item.href) ? 'bg-[#1a1a2e] text-[#A78BFA]' : 'text-[#94a3b8] hover:bg-[#1a1a2e] hover:text-white'
                }`}
              >
                <i className={`ti ${item.icon} text-lg`}></i> {item.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#1a1a2e] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm">SA</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-white truncate">Super Admin</div>
            <div className="text-xs text-[#64748b]">admin@catalogiq.com</div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#0A0A14] text-white border-r border-[#1a1a2e] flex-col hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-72 bg-[#0A0A14] text-white flex flex-col shadow-2xl z-10 animate-slide-in">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[#0f172a] p-1.5 rounded-lg hover:bg-[#f1f5f9]">
              <i className="ti ti-menu-2 text-2xl"></i>
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-[#0f172a]">Super Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm font-medium text-[#10B981] bg-[#D1FAE5] px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span> <span className="hidden sm:inline">Systems</span> OK
            </span>
            <button className="text-[#64748b] hover:text-[#0f172a] transition-colors"><i className="ti ti-bell text-xl"></i></button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
