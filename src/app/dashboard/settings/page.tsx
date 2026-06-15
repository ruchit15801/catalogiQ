"use client";

import { useState } from "react";
import { useAppData } from "../../lib/store";

export default function Settings() {
  const { data, resetData } = useAppData();
  const [name, setName] = useState("Manish Kumar");
  const [email, setEmail] = useState("manish@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [marketplace, setMarketplace] = useState("meesho");
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    resetData();
    setShowReset(false);
  };

  return (
    <div className="animate-fade-up max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Account Settings</h1>
        <p className="text-[#475569] mt-1 text-sm">Manage your profile, preferences, and data</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2"><i className="ti ti-user text-[#7C3AED]"></i> Profile</h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6 pb-6 border-b border-[#f1f5f9]">
            <div className="w-20 h-20 bg-[#EDE9FE] text-[#7C3AED] rounded-2xl flex items-center justify-center text-3xl font-bold shrink-0">MK</div>
            <div className="flex-1">
              <div className="text-base font-bold text-[#0f172a]">{name}</div>
              <div className="text-sm text-[#64748b]">{email}</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div><label className="block text-sm font-semibold text-[#0f172a] mb-2">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-control" /></div>
            <div><label className="block text-sm font-semibold text-[#0f172a] mb-2">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-control" /></div>
            <div><label className="block text-sm font-semibold text-[#0f172a] mb-2">Phone</label><input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-control" /></div>
            <div><label className="block text-sm font-semibold text-[#0f172a] mb-2">Default Marketplace</label>
              <select value={marketplace} onChange={(e) => setMarketplace(e.target.value)} className="input-control"><option value="meesho">Meesho</option><option value="flipkart">Flipkart</option><option value="amazon">Amazon India</option></select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2"><i className="ti ti-bell text-[#F59E0B]"></i> Notifications</h3>
          <div className="flex items-center justify-between">
            <div><div className="font-semibold text-[#0f172a]">Email Notifications</div><div className="text-sm text-[#64748b]">Receive emails about optimization results</div></div>
            <button type="button" onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors relative ${notifications ? 'bg-[#7C3AED]' : 'bg-[#cbd5e1]'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-0.5 transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
            </button>
          </div>
        </div>

        {/* Data Usage Stats — real-time */}
        <div className="bg-white p-6 md:p-8 rounded-xl border border-[#e2e8f0] shadow-sm">
          <h3 className="text-lg font-bold text-[#0f172a] mb-6 flex items-center gap-2"><i className="ti ti-database text-[#10B981]"></i> Your Data</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-[#f8fafc] rounded-xl"><div className="text-2xl font-bold text-[#0f172a]">{data.optimizations.length}</div><div className="text-xs text-[#64748b]">Optimizations</div></div>
            <div className="text-center p-3 bg-[#f8fafc] rounded-xl"><div className="text-2xl font-bold text-[#0f172a]">{data.products.length}</div><div className="text-xs text-[#64748b]">Products</div></div>
            <div className="text-center p-3 bg-[#f8fafc] rounded-xl"><div className="text-2xl font-bold text-[#0f172a]">{data.projects.length}</div><div className="text-xs text-[#64748b]">Projects</div></div>
            <div className="text-center p-3 bg-[#f8fafc] rounded-xl"><div className="text-2xl font-bold text-[#0f172a]">{data.aiGenerations.length}</div><div className="text-xs text-[#64748b]">AI Gens</div></div>
          </div>
          <button type="button" onClick={() => setShowReset(true)} className="text-sm font-semibold text-[#EF4444] hover:underline"><i className="ti ti-trash mr-1"></i> Reset All Data</button>
          {showReset && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border-2 border-red-200">
              <p className="text-sm text-[#991B1B] mb-3 font-semibold">Are you sure? This will delete all optimizations, products, and projects.</p>
              <div className="flex gap-3">
                <button type="button" onClick={handleReset} className="text-sm font-bold text-white bg-[#EF4444] px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">Yes, Reset Everything</button>
                <button type="button" onClick={() => setShowReset(false)} className="text-sm font-semibold text-[#64748b] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button type="submit" className="btn btn-primary w-full sm:w-auto px-8 py-3.5">
            {saved ? <><i className="ti ti-check"></i> Saved!</> : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
