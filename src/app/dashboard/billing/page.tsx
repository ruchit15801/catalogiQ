"use client";

import { useState } from "react";

export default function Billing() {
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    { id: "free", name: "Free", price: "₹0", period: "/mo", images: "20 Images", features: ["Basic Tools", "5 Research Searches"] },
    { id: "starter", name: "Starter", price: "₹299", period: "/mo", images: "500 Images", features: ["Unlimited Research", "Basic AI"] },
    { id: "pro", name: "Pro", price: "₹999", period: "/mo", images: "Unlimited", features: ["Advanced AI", "Bulk Processing", "Priority Support"], current: true },
    { id: "agency", name: "Agency", price: "₹2999", period: "/mo", images: "Unlimited + API", features: ["Team Access", "White Label", "Dedicated Support"] },
  ];

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0f172a]">Billing & Plan</h1>
        <p className="text-[#475569] mt-1 text-sm">Manage your subscription and payment methods.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="text-sm font-semibold text-[#64748b] mb-1">Current Plan</div>
            <div className="text-2xl font-bold text-[#0f172a]">Pro Plan <span className="text-lg text-[#7C3AED]">- ₹999/mo</span></div>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-sm font-semibold text-[#64748b] mb-1">Next Billing Date</div>
            <div className="text-lg font-bold text-[#0f172a]">July 11, 2026</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {plans.map((plan) => (
          <div key={plan.id} className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${plan.current ? 'border-[#7C3AED] bg-[#EDE9FE]/30 shadow-md' : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'}`} onClick={() => setSelectedPlan(plan.id)}>
            {plan.current && <div className="text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest mb-3">Current Plan</div>}
            <h3 className="text-lg font-bold text-[#0f172a] mb-1">{plan.name}</h3>
            <div className="text-2xl font-black text-[#0f172a] mb-4">{plan.price}<span className="text-sm font-medium text-[#64748b]">{plan.period}</span></div>
            <div className="text-sm font-semibold text-[#7C3AED] mb-3">{plan.images}</div>
            <ul className="space-y-2">
              {plan.features.map((f, i) => (
                <li key={i} className="text-sm text-[#475569] flex items-center gap-2"><i className="ti ti-check text-[#10B981]"></i> {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl border border-[#e2e8f0] shadow-sm">
        <h3 className="text-lg font-bold text-[#0f172a] mb-4">Payment Method</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-8 bg-[#0A0A14] rounded-md flex items-center justify-center text-white text-xs font-bold">VISA</div>
            <div>
              <div className="text-sm font-semibold text-[#0f172a]">•••• •••• •••• 4242</div>
              <div className="text-xs text-[#64748b]">Expires 12/2028</div>
            </div>
          </div>
          <button className="text-sm font-semibold text-[#7C3AED] hover:underline">Update Card</button>
        </div>
      </div>
    </div>
  );
}
