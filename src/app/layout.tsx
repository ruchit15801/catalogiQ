"use client";

import "./globals.css";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AppProvider } from "./lib/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'CatalogIQ';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Don't show public navbar on dashboard/admin routes since they have their own sidebar layouts
  const isAppRoute = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <html lang="en">
      <head>
        <title>{appName} - AI Catalog Optimization & Shipping Cost Reduction</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.44.0/tabler-icons.min.css" />
      </head>
      <body>
        <AppProvider>
        {!isAppRoute && (
          <nav className="fixed w-full z-50 transition-all duration-300" style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-20">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight text-[#0A0A14] hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 bg-[#7C3AED] rounded-xl flex items-center justify-center shadow-lg shadow-[#7C3AED]/30">
                      <svg width="20" height="20" viewBox="0 0 38 38" fill="none">
                          <rect x="8" y="8" width="10" height="10" rx="2" fill="rgba(255,255,255,0.3)"/>
                          <rect x="20" y="8" width="10" height="10" rx="2" fill="rgba(255,255,255,0.6)"/>
                          <rect x="8" y="20" width="10" height="10" rx="2" fill="rgba(255,255,255,0.6)"/>
                          <rect x="20" y="20" width="10" height="10" rx="2" fill="#fff"/>
                      </svg>
                  </div>
                  {appName.replace('IQ', '')}<span className="text-[#7C3AED]">IQ</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                  <Link href="/" className="text-sm font-semibold text-[#475569] hover:text-[#7C3AED] transition-colors">Home</Link>
                  <Link href="/features" className="text-sm font-semibold text-[#475569] hover:text-[#7C3AED] transition-colors">Features</Link>
                  <Link href="/tools" className="text-sm font-semibold text-[#475569] hover:text-[#7C3AED] transition-colors">Tools</Link>
                  <Link href="/pricing" className="text-sm font-semibold text-[#475569] hover:text-[#7C3AED] transition-colors">Pricing</Link>
                  <Link href="/about" className="text-sm font-semibold text-[#475569] hover:text-[#7C3AED] transition-colors">About</Link>
                </div>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                  <Link href="/signin" className="text-sm font-semibold text-[#0f172a] hover:text-[#7C3AED] transition-colors px-4 py-2">Log in</Link>
                  <Link href="/dashboard" className="bg-[#0A0A14] hover:bg-[#7C3AED] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md">Dashboard</Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                  <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-[#0f172a] p-2 focus:outline-none">
                    <i className={`ti ${mobileMenuOpen ? 'ti-x' : 'ti-menu-2'} text-3xl`}></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`md:hidden absolute top-20 left-0 w-full bg-white border-b border-[#e2e8f0] shadow-xl transition-all duration-300 ease-in-out origin-top ${mobileMenuOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}>
              <div className="px-6 pt-4 pb-8 space-y-4 flex flex-col">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#0f172a] hover:text-[#7C3AED] py-2 border-b border-[#f1f5f9]">Home</Link>
                <Link href="/features" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#0f172a] hover:text-[#7C3AED] py-2 border-b border-[#f1f5f9]">Features</Link>
                <Link href="/tools" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#0f172a] hover:text-[#7C3AED] py-2 border-b border-[#f1f5f9]">Tools Directory</Link>
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#0f172a] hover:text-[#7C3AED] py-2 border-b border-[#f1f5f9]">Pricing</Link>
                <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-lg font-semibold text-[#0f172a] hover:text-[#7C3AED] py-2 border-b border-[#f1f5f9]">About Us</Link>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <Link href="/signin" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary w-full">Log In</Link>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary w-full">Dashboard</Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        <main className={!isAppRoute ? "pt-20 min-h-[calc(100vh-400px)]" : ""}>
          {children}
        </main>

        {!isAppRoute && (
          <footer className="bg-[#0A0A14] text-white pt-24 pb-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED] opacity-10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16 border-b border-white/10 pb-16">
                    <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 text-2xl font-bold text-white mb-6">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                                <svg width="20" height="20" viewBox="0 0 38 38" fill="none">
                                    <rect x="8" y="8" width="10" height="10" rx="2" fill="rgba(124, 58, 237, 0.3)"/>
                                    <rect x="20" y="8" width="10" height="10" rx="2" fill="rgba(124, 58, 237, 0.6)"/>
                                    <rect x="8" y="20" width="10" height="10" rx="2" fill="rgba(124, 58, 237, 0.6)"/>
                                    <rect x="20" y="20" width="10" height="10" rx="2" fill="var(--color-primary)"/>
                                </svg>
                            </div>
                            {appName.replace('IQ', '')}<span className="text-[#A78BFA]">IQ</span>
                        </div>
                        <p className="text-[#94a3b8] text-base leading-relaxed max-w-sm mb-8">The AI Operating System for Modern E-commerce Sellers. Reduce shipping costs, generate high-converting SEO content, and scale your margins instantly.</p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#7C3AED] hover:text-white transition-all"><i className="ti ti-brand-twitter text-xl"></i></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#7C3AED] hover:text-white transition-all"><i className="ti ti-brand-linkedin text-xl"></i></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#7C3AED] hover:text-white transition-all"><i className="ti ti-brand-youtube text-xl"></i></a>
                        </div>
                    </div>
                    <div>
                        <div className="text-white font-bold mb-6 text-lg tracking-wide">Platform</div>
                        <ul className="space-y-4">
                            <li><Link href="/dashboard/optimizer" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Shipping Optimizer</Link></li>
                            <li><Link href="/dashboard/ai-studio" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">AI Content Studio</Link></li>
                            <li><Link href="/tools" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">All Seller Tools</Link></li>
                            <li><Link href="/pricing" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Pricing</Link></li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-white font-bold mb-6 text-lg tracking-wide">Company</div>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Contact</Link></li>
                            <li><a href="#" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Careers</a></li>
                            <li><a href="#" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Blog</a></li>
                        </ul>
                    </div>
                    <div>
                        <div className="text-white font-bold mb-6 text-lg tracking-wide">Legal</div>
                        <ul className="space-y-4">
                            <li><Link href="/privacy" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/privacy" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="text-[#94a3b8] hover:text-[#A78BFA] transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[#64748b] text-sm">
                    <div>&copy; 2026 {appName}. All rights reserved.</div>
                    <div className="flex items-center gap-2">
                        <span>Made with AI</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
                        <span>Systems Normal</span>
                    </div>
                </div>
              </div>
          </footer>
        )}
        </AppProvider>
      </body>
    </html>
  );
}
