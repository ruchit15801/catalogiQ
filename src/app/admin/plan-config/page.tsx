"use client";

import { useState, useEffect } from "react";
import { useAppData, type PlanConfig, DEFAULT_PLAN_CONFIG } from "../../lib/store";

// ── small helper ───────────────────────────────────────────────
function Toggle({
  checked, onChange, label, sub,
}: { checked: boolean; onChange: (v: boolean) => void; label: string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div>
        <div className="text-sm font-semibold text-[#0f172a]">{label}</div>
        {sub && <div className="text-xs text-[#64748b] mt-0.5">{sub}</div>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-[#7C3AED]" : "bg-[#cbd5e1]"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </button>
    </div>
  );
}

function NumberField({
  label, sub, value, onChange, min = 1, max = 100,
}: { label: string; sub?: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div>
        <div className="text-sm font-semibold text-[#0f172a]">{label}</div>
        {sub && <div className="text-xs text-[#64748b] mt-0.5">{sub}</div>}
      </div>
      <input
        type="number"
        min={min} max={max}
        value={value}
        onChange={(e) => onChange(Math.max(min, Math.min(max, Number(e.target.value))))}
        className="w-20 px-3 py-1.5 text-sm font-bold border border-[#cbd5e1] rounded-lg text-center focus:border-[#7C3AED] focus:outline-none"
      />
    </div>
  );
}

function SelectField({
  label, sub, value, options, onChange,
}: { label: string; sub?: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div>
        <div className="text-sm font-semibold text-[#0f172a]">{label}</div>
        {sub && <div className="text-xs text-[#64748b] mt-0.5">{sub}</div>}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-1.5 text-sm border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

// ── main component ────────────────────────────────────────────
export default function PlanConfigAdmin() {
  const { data, updatePlanConfig } = useAppData();
  const [config, setConfig] = useState<PlanConfig>(data.planConfig ?? DEFAULT_PLAN_CONFIG);
  const [saved, setSaved] = useState(false);

  // Sync if store changes externally
  useEffect(() => { setConfig(data.planConfig ?? DEFAULT_PLAN_CONFIG); }, [data.planConfig]);

  const setFree = (patch: Partial<PlanConfig["free"]>) =>
    setConfig((prev) => ({ ...prev, free: { ...prev.free, ...patch } }));

  const setPaid = (patch: Partial<PlanConfig["paid"]>) =>
    setConfig((prev) => ({ ...prev, paid: { ...prev.paid, ...patch } }));

  const handleSave = () => {
    updatePlanConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setConfig(DEFAULT_PLAN_CONFIG);
    updatePlanConfig(DEFAULT_PLAN_CONFIG);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const shippingOptions = [
    { value: "real",     label: "Real (Optimized lowest)" },
    { value: "medium",   label: "Medium (50% of savings)" },
    { value: "baseline", label: "Baseline (Original cost)" },
  ];

  return (
    <div className="animate-fade-up max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Plan Configuration</h1>
          <p className="text-[#475569] mt-1 text-sm">
            Control what Free and Paid users see in the Shipping Optimizer — changes apply instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-semibold border border-[#e2e8f0] rounded-xl text-[#64748b] hover:bg-[#f8fafc] transition-colors"
          >
            <i className="ti ti-refresh mr-1"></i> Reset Defaults
          </button>
          <button
            onClick={handleSave}
            className={`px-5 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
              saved ? "bg-[#10B981] text-white" : "bg-[#7C3AED] hover:bg-[#5B21B6] text-white shadow-lg shadow-[#7C3AED]/20"
            }`}
          >
            {saved ? <><i className="ti ti-check"></i> Saved!</> : <><i className="ti ti-device-floppy"></i> Save Changes</>}
          </button>
        </div>
      </div>

      {/* Live Preview Banner */}
      <div className="bg-[#0A0A14] rounded-xl p-4 mb-6 flex flex-wrap items-center gap-6 text-white">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest">Live Config Preview</div>
        <div className="flex flex-wrap gap-4 text-xs">
          <span><span className="text-[#64748b]">Free shows:</span> <span className="font-bold text-[#F59E0B]">{config.free.resultsReturned} results</span></span>
          <span><span className="text-[#64748b]">Images:</span> <span className={`font-bold ${config.free.showImages ? "text-[#10B981]" : "text-[#EF4444]"}`}>{config.free.showImages ? "Visible" : "Blurred"}</span></span>
          <span><span className="text-[#64748b]">Savings:</span> <span className={`font-bold ${config.free.showSavings ? "text-[#10B981]" : "text-[#EF4444]"}`}>{config.free.showSavings ? "Visible" : "Locked"}</span></span>
          <span><span className="text-[#64748b]">Download:</span> <span className={`font-bold ${config.free.showDownload ? "text-[#10B981]" : "text-[#EF4444]"}`}>{config.free.showDownload ? "Enabled" : "Locked"}</span></span>
          <span className="text-[#A78BFA]">|</span>
          <span><span className="text-[#64748b]">Paid shows:</span> <span className="font-bold text-[#10B981]">{config.paid.resultsReturned} results</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── FREE PLAN ─────────────────────────────────────── */}
        <div className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#f8fafc] border-b border-[#e2e8f0] px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#f1f5f9] border border-[#e2e8f0] flex items-center justify-center">
              <i className="ti ti-lock text-[#64748b]"></i>
            </div>
            <div>
              <div className="font-bold text-[#0f172a]">Free Plan</div>
              <div className="text-xs text-[#64748b]">Limits shown to free users</div>
            </div>
            <span className="ml-auto text-xs font-bold bg-[#f1f5f9] text-[#64748b] px-2 py-1 rounded-lg">FREE</span>
          </div>
          <div className="px-5">
            <NumberField
              label="Variants Generated"
              sub="Total variants created server-side"
              value={config.free.variantsGenerated}
              onChange={(v) => setFree({ variantsGenerated: v })}
              min={3} max={20}
            />
            <NumberField
              label="Results Returned"
              sub="How many ranked results user sees"
              value={config.free.resultsReturned}
              onChange={(v) => setFree({ resultsReturned: v })}
              min={1} max={10}
            />
            <SelectField
              label="Shipping Cost Display"
              sub="Which shipping value to show on cards"
              value={config.free.shippingDisplay}
              options={shippingOptions}
              onChange={(v) => setFree({ shippingDisplay: v as "real" | "medium" | "baseline" })}
            />
            <Toggle
              label="Show Variant Images"
              sub="If OFF, images are blurred with lock overlay"
              checked={config.free.showImages}
              onChange={(v) => setFree({ showImages: v })}
            />
            <Toggle
              label="Show Savings Value"
              sub="₹X/order saved — if OFF, shows 'Savings locked'"
              checked={config.free.showSavings}
              onChange={(v) => setFree({ showSavings: v })}
            />
            <Toggle
              label="Show Download Button"
              sub="If OFF, shows 'Upgrade' button instead"
              checked={config.free.showDownload}
              onChange={(v) => setFree({ showDownload: v })}
            />
            <Toggle
              label="Show Confidence %"
              sub="AI confidence score on image overlay"
              checked={config.free.showConfidence}
              onChange={(v) => setFree({ showConfidence: v })}
            />
            <div className="py-3">
              <label className="block text-sm font-semibold text-[#0f172a] mb-1">Lock Overlay Text</label>
              <input
                type="text"
                value={config.free.watermarkLabel}
                onChange={(e) => setFree({ watermarkLabel: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none"
                placeholder="e.g. Upgrade to view"
              />
            </div>
          </div>
        </div>

        {/* ── PAID PLAN ─────────────────────────────────────── */}
        <div className="bg-white border border-[#7C3AED]/30 rounded-xl shadow-sm overflow-hidden">
          <div className="bg-[#EDE9FE] border-b border-[#7C3AED]/20 px-5 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#7C3AED] flex items-center justify-center">
              <i className="ti ti-star text-white"></i>
            </div>
            <div>
              <div className="font-bold text-[#0f172a]">Paid Plan</div>
              <div className="text-xs text-[#5B21B6]">Full access configuration</div>
            </div>
            <span className="ml-auto text-xs font-bold bg-[#7C3AED] text-white px-2 py-1 rounded-lg">PAID</span>
          </div>
          <div className="px-5">
            <NumberField
              label="Variants Generated"
              sub="Total variants created server-side"
              value={config.paid.variantsGenerated}
              onChange={(v) => setPaid({ variantsGenerated: v })}
              min={3} max={20}
            />
            <NumberField
              label="Results Returned"
              sub="How many ranked results user sees"
              value={config.paid.resultsReturned}
              onChange={(v) => setPaid({ resultsReturned: v })}
              min={1} max={10}
            />
            <SelectField
              label="Shipping Cost Display"
              sub="Which shipping value to show on cards"
              value={config.paid.shippingDisplay}
              options={shippingOptions}
              onChange={(v) => setPaid({ shippingDisplay: v as "real" | "medium" | "baseline" })}
            />
            <Toggle
              label="Show Variant Images"
              sub="Real generated images visible"
              checked={config.paid.showImages}
              onChange={(v) => setPaid({ showImages: v })}
            />
            <Toggle
              label="Show Savings Value"
              sub="₹X/order saved — actual optimized savings"
              checked={config.paid.showSavings}
              onChange={(v) => setPaid({ showSavings: v })}
            />
            <Toggle
              label="Show Download Button"
              sub="Allow downloading 512×512 optimized images"
              checked={config.paid.showDownload}
              onChange={(v) => setPaid({ showDownload: v })}
            />
            <Toggle
              label="Show Confidence %"
              sub="AI confidence score on image overlay"
              checked={config.paid.showConfidence}
              onChange={(v) => setPaid({ showConfidence: v })}
            />
          </div>
        </div>
      </div>

      {/* ── Upsell Text ──────────────────────────────────────── */}
      <div className="mt-6 bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
        <h3 className="font-bold text-[#0f172a] mb-4 flex items-center gap-2">
          <i className="ti ti-speakerphone text-[#7C3AED]"></i> Upsell Banner Text
          <span className="text-xs font-normal text-[#64748b] ml-1">(shown to free users above variant grid)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Headline</label>
            <input
              type="text"
              value={config.upsellTitle}
              onChange={(e) => setConfig((prev) => ({ ...prev, upsellTitle: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#64748b] uppercase mb-1.5">Description</label>
            <input
              type="text"
              value={config.upsellDesc}
              onChange={(e) => setConfig((prev) => ({ ...prev, upsellDesc: e.target.value }))}
              className="w-full px-3 py-2.5 text-sm border border-[#cbd5e1] rounded-lg focus:border-[#7C3AED] focus:outline-none"
            />
          </div>
        </div>
        {/* Live Preview */}
        <div className="mt-4 p-4 rounded-xl border-2 border-dashed border-[#7C3AED]/40 bg-[#EDE9FE]/30 flex items-center gap-3">
          <i className="ti ti-lock text-2xl text-[#7C3AED]"></i>
          <div className="flex-1">
            <div className="font-bold text-[#5B21B6] text-sm">{config.upsellTitle || "—"}</div>
            <div className="text-xs text-[#7C3AED] mt-0.5">{config.upsellDesc || "—"}</div>
          </div>
          <span className="shrink-0 bg-[#7C3AED] text-white text-xs font-bold px-3 py-2 rounded-lg">Upgrade ↗</span>
        </div>
      </div>

      {/* ── Summary Table ─────────────────────────────────────── */}
      <div className="mt-6 bg-[#0A0A14] rounded-xl p-5 text-white">
        <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest mb-4">Config Summary</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a2e]">
                <th className="text-left py-2 px-3 text-xs text-[#64748b] font-bold">Feature</th>
                <th className="text-center py-2 px-3 text-xs text-[#64748b] font-bold">Free Plan</th>
                <th className="text-center py-2 px-3 text-xs text-[#7C3AED] font-bold">Paid Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a2e]">
              {[
                { label: "Variants Generated", free: config.free.variantsGenerated, paid: config.paid.variantsGenerated, type: "num" },
                { label: "Results Shown", free: config.free.resultsReturned, paid: config.paid.resultsReturned, type: "num" },
                { label: "Variant Images", free: config.free.showImages, paid: config.paid.showImages, type: "bool" },
                { label: "Savings Value", free: config.free.showSavings, paid: config.paid.showSavings, type: "bool" },
                { label: "Download Button", free: config.free.showDownload, paid: config.paid.showDownload, type: "bool" },
                { label: "Confidence %", free: config.free.showConfidence, paid: config.paid.showConfidence, type: "bool" },
                { label: "Shipping Display", free: config.free.shippingDisplay, paid: config.paid.shippingDisplay, type: "text" },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="py-2.5 px-3 text-[#94a3b8] text-xs">{row.label}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.type === "bool"
                      ? <span className={`text-xs font-bold ${row.free ? "text-[#10B981]" : "text-[#EF4444]"}`}>{row.free ? "✓ ON" : "✗ OFF"}</span>
                      : <span className="text-xs font-bold text-[#F59E0B]">{String(row.free)}</span>
                    }
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.type === "bool"
                      ? <span className={`text-xs font-bold ${row.paid ? "text-[#10B981]" : "text-[#EF4444]"}`}>{row.paid ? "✓ ON" : "✗ OFF"}</span>
                      : <span className="text-xs font-bold text-[#A78BFA]">{String(row.paid)}</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Save button bottom */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          className={`px-6 py-3 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
            saved ? "bg-[#10B981] text-white" : "bg-[#7C3AED] hover:bg-[#5B21B6] text-white shadow-lg shadow-[#7C3AED]/20"
          }`}
        >
          {saved ? <><i className="ti ti-check"></i> Saved!</> : <><i className="ti ti-device-floppy"></i> Save Changes</>}
        </button>
      </div>
    </div>
  );
}
