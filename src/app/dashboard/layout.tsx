"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppData } from "../lib/store";

const navItems = [
  { section: "Overview", items: [
    { href: "/dashboard", icon: "ti-layout-dashboard", label: "Dashboard Home" },
    { href: "/dashboard/projects", icon: "ti-folder", label: "My Projects" },
  ]},
  { section: "Tools", items: [
    { href: "/dashboard/optimizer", icon: "ti-wand", label: "Shipping Optimizer", badge: "Core" },
    { href: "/dashboard/catalog", icon: "ti-box", label: "Catalog Manager" },
    { href: "/dashboard/research", icon: "ti-search", label: "Research Center" },
    { href: "/dashboard/ai-studio", icon: "ti-robot", label: "AI Content Studio" },
    { href: "/dashboard/tools/profit", icon: "ti-coin-rupee", label: "Profit Calculator" },
  ]},
  { section: "Account", items: [
    { href: "/dashboard/reports", icon: "ti-report-analytics", label: "Monthly Reports" },
    { href: "/dashboard/billing", icon: "ti-credit-card", label: "Billing & Plan" },
    { href: "/dashboard/settings", icon: "ti-settings", label: "Settings" },
  ]},
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data } = useAppData();
  const creditsRemaining = data.planCredits - data.totalCreditsUsed;

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-5 border-b border-[#e2e8f0] shrink-0">
        <Link href="/" className="flex items-center gap-2.5 text-xl font-bold text-[#0A0A14]" onClick={() => setSidebarOpen(false)}>
          <div className="w-8 h-8 bg-[#7C3AED] rounded-lg flex items-center justify-center shadow-md shadow-[#7C3AED]/20">
            <svg width="16" height="16" viewBox="0 0 38 38" fill="none">
                <rect x="8" y="8" width="10" height="10" rx="2" fill="rgba(255,255,255,0.3)"/>
                <rect x="20" y="8" width="10" height="10" rx="2" fill="rgba(255,255,255,0.6)"/>
                <rect x="8" y="20" width="10" height="10" rx="2" fill="rgba(255,255,255,0.6)"/>
                <rect x="20" y="20" width="10" height="10" rx="2" fill="#fff"/>
            </svg>
          </div>
          Catalog<span className="text-[#7C3AED]">IQ</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="text-[10px] font-bold text-[#94a3b8] uppercase tracking-[0.15em] mb-2 px-3 mt-5">{group.section}</div>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 text-[13px] font-semibold rounded-lg transition-all ${
                  isActive(item.href)
                    ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-sm'
                    : 'text-[#475569] hover:bg-[#f8fafc] hover:text-[#0f172a]'
                }`}
              >
                <i className={`ti ${item.icon} text-lg`}></i> 
                <span className="flex-1">{item.label}</span>
                {item.badge && <span className="text-[10px] bg-[#10B981] text-white px-2 py-0.5 rounded-full font-bold">{item.badge}</span>}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#e2e8f0] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#EDE9FE] text-[#7C3AED] flex items-center justify-center font-bold text-sm">MK</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#0f172a] truncate">Manish K.</div>
            <div className="text-xs text-[#64748b]">Pro Plan</div>
          </div>
          <Link href="/signin" className="text-[#64748b] hover:text-[#EF4444] transition-colors" title="Logout"><i className="ti ti-logout text-lg"></i></Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e2e8f0] flex-col hidden md:flex">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)}></div>
          <aside className="relative w-72 bg-white flex flex-col shadow-2xl z-10 animate-slide-in">
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
            <h1 className="text-lg md:text-xl font-semibold text-[#0f172a]">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs md:text-sm font-medium text-[#475569] bg-[#f1f5f9] px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <i className="ti ti-coins text-[#F59E0B]"></i> <span className="hidden sm:inline">{creditsRemaining}</span> Credits
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
