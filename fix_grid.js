const fs = require('fs');
const path = 'd:/Work/catalogiQ/catalogiq-next/src/app/dashboard/optimizer/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// ── New variant card function (reusable) ──────────────────────────────────
const VARIANT_CARD = `
function VariantCard({ v, isPaid, planConfig, zone, downloadVariant, setPlan, activeCfg }: {
  v: VariantResult;
  isPaid: boolean;
  planConfig: typeof DEFAULT_PLAN_CONFIG;
  zone: string;
  downloadVariant: (b: string, n: string) => void;
  setPlan: (p: 'free' | 'paid') => void;
  activeCfg: typeof DEFAULT_PLAN_CONFIG.paid;
}) {
  const tierColors = {
    lowest: { bg: 'bg-[#10B981]', text: 'text-[#10B981]', border: 'border-[#10B981]/30', light: 'bg-[#D1FAE5]', label: '🟢 Lowest Cost' },
    medium: { bg: 'bg-[#F59E0B]', text: 'text-[#F59E0B]', border: 'border-[#F59E0B]/30', light: 'bg-[#FEF3C7]', label: '🟡 Medium Cost' },
    higher: { bg: 'bg-[#EF4444]', text: 'text-[#EF4444]', border: 'border-[#EF4444]/30', light: 'bg-[#FEE2E2]', label: '🔴 Higher Cost' },
  };
  const tc = tierColors[v.costTier ?? 'lowest'];

  return (
    <div className={\`bg-white border-2 \${v.isBestPick ? 'border-[#7C3AED]' : 'border-[#e2e8f0]'} rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 group relative\`}>
      {/* Image */}
      <div className="h-52 relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: v.bgColor }}>
        {v.isBestPick && <div className="absolute top-3 left-3 bg-[#7C3AED] text-white text-xs px-3 py-1 rounded-lg font-bold z-10"><i className="ti ti-star-filled mr-1"></i>Best Pick</div>}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className={\`text-[9px] px-1.5 py-0.5 rounded font-black \${v.styleGroup === 'B' ? 'bg-orange-500/90 text-white' : 'bg-blue-500/90 text-white'}\`}>Style {v.styleGroup}</span>
          <span className="bg-black/70 text-white text-[10px] px-2 py-1 rounded-lg font-bold">#{v.rank} · {v.shippingOptScore}/100</span>
        </div>
        {v.imageBase64 ? (
          <img src={v.imageBase64} alt={v.variantName} className="w-full h-full object-contain transition-transform group-hover:scale-105" />
        ) : (
          <i className="ti ti-photo text-4xl text-white/50"></i>
        )}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white text-xs px-2 py-1 rounded-lg z-10 font-mono">{v.coverage}% · {v.fileSizeKB}KB</div>
        {/* Shipping cost badge */}
        <div className="absolute bottom-3 right-3 flex flex-col items-end gap-1 z-10">
          <div className={\`flex items-center gap-1 \${tc.bg} text-white text-xs px-2.5 py-1.5 rounded-lg font-black shadow-lg\`}>
            <i className="ti ti-truck-delivery"></i> ₹{v.predictedCharge}
          </div>
          {v.savingsPerOrder > 0 && (
            <div className="bg-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded font-black">Save ₹{v.savingsPerOrder}</div>
          )}
        </div>
      </div>
      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-[#0f172a] text-sm truncate">{v.variantName}</div>
          <span className={\`text-[10px] font-black px-2 py-0.5 rounded-full \${tc.light} \${tc.text}\`}>{tc.label}</span>
        </div>
        <div className="text-[10px] text-[#64748b] mb-3 capitalize">{v.bgComplexity} · {v.bgType.replace(/_/g,' ')}</div>
        {/* Score bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] font-bold text-[#64748b] mb-1">
            <span>Shipping Opt. Score</span><span className="text-[#7C3AED]">{v.shippingOptScore}/100</span>
          </div>
          <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#7C3AED] to-[#10B981] rounded-full" style={{ width: \`\${v.shippingOptScore}%\` }}></div>
          </div>
        </div>
        {/* Score chips */}
        <div className="grid grid-cols-3 gap-1 text-[10px] mb-3">
          <div className="bg-[#EDE9FE] rounded-lg p-1.5 text-center"><div className="text-[#7C3AED] font-black">{v.coverageScore}</div><div className="text-[#5B21B6]">Coverage</div></div>
          <div className="bg-[#FEF3C7] rounded-lg p-1.5 text-center"><div className="text-[#D97706] font-black">{v.bgScore}</div><div className="text-[#92400E]">BG</div></div>
          <div className="bg-[#D1FAE5] rounded-lg p-1.5 text-center"><div className="text-[#10B981] font-black">{v.edgeConfusionScore}</div><div className="text-[#065F46]">Edge</div></div>
        </div>
        {/* Shipping info row */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Slab: </span><span className="font-bold">{v.predictedSlab}</span></div>
          <div className={\`p-2 rounded-lg \${tc.light} border \${tc.border}\`}><span className="text-[#64748b]">Meesho: </span><span className={\`font-black \${tc.text}\`}>₹{v.predictedCharge}</span></div>
          <div className="p-2 bg-[#f8fafc] rounded-lg"><span className="text-[#64748b]">Wt: </span><span className="font-bold">{v.shipping.chargeableWeight}g</span></div>
          <div className={\`p-2 rounded-lg \${v.savingsPerOrder > 0 ? 'bg-[#D1FAE5]' : 'bg-[#f8fafc]'}\`}>
            <span className="text-[#64748b]">Save: </span>
            <span className={\`font-bold \${v.savingsPerOrder > 0 ? 'text-[#10B981]' : ''}\`}>₹{v.savingsPerOrder}/order</span>
          </div>
        </div>
        {/* Download */}
        {activeCfg.showDownload ? (
          <button onClick={() => downloadVariant(v.imageBase64, v.variantId)} disabled={!v.imageBase64}
            className="w-full bg-[#7C3AED] hover:bg-[#5B21B6] text-white font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1 disabled:opacity-40">
            <i className="ti ti-download"></i> Download 512×512
          </button>
        ) : (
          <button onClick={() => setPlan('paid')}
            className="w-full bg-[#f8fafc] border border-dashed border-[#7C3AED]/50 hover:bg-[#EDE9FE] text-[#7C3AED] font-semibold py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-1">
            <i className="ti ti-lock"></i> Unlock — Upgrade to Paid
          </button>
        )}
      </div>
    </div>
  );
}
`;

// Insert VariantCard before "// ── Searchable category dropdown"
content = content.replace(
  '// ── Searchable category dropdown',
  VARIANT_CARD + '\n// ── Searchable category dropdown'
);

// ── New variants grid section ─────────────────────────────────────────────
const OLD_GRID_START = '              {/* Plan Toggle */}';
const OLD_GRID_END = '              </div>\n            </div>\n          )}\n\n        </div>\n      </div>\n    </div>\n  );\n}';

const NEW_GRID = `              {/* Plan Toggle */}
              <div className="flex items-center justify-between bg-white border border-[#e2e8f0] rounded-xl p-4 shadow-sm">
                <div>
                  <div className="font-bold text-[#0f172a] text-sm">Plan Mode</div>
                  <div className="text-xs text-[#64748b] mt-0.5">
                    {isPaid ? \`Paid — all \${apiResult.results.length} variants, sorted cheapest → highest\` : \`Free — showing 5 cheapest shipping variants\`}
                  </div>
                </div>
                <div className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-xl">
                  <button onClick={() => setPlan('free')} className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${!isPaid ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}\`}>
                    <i className="ti ti-lock mr-1"></i>Free (5)
                  </button>
                  <button onClick={() => setPlan('paid')} className={\`px-4 py-2 rounded-lg text-xs font-bold transition-all \${isPaid ? 'bg-[#7C3AED] text-white shadow-sm' : 'text-[#64748b] hover:text-[#0f172a]'}\`}>
                    <i className="ti ti-star mr-1"></i>Paid (20)
                  </button>
                </div>
              </div>

              {/* Variants — grouped by cost tier (Lowest → Medium → Higher) */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-lg font-bold text-[#0f172a]">
                    {isPaid ? 'All 20 Variants' : 'Top 5 Cheapest Variants'}
                    <span className={\`ml-2 text-xs font-bold px-2 py-0.5 rounded-lg \${isPaid ? 'bg-[#7C3AED] text-white' : 'bg-[#f1f5f9] text-[#64748b]'}\`}>
                      {isPaid ? '★ Paid' : 'Free'}
                    </span>
                  </h2>
                  <span className="text-xs font-semibold text-[#64748b]">{apiResult.totalGenerated} generated</span>
                </div>

                {/* Free upsell */}
                {!isPaid && (
                  <div className="mb-5 p-4 rounded-xl border-2 border-dashed border-[#7C3AED]/40 bg-[#EDE9FE]/30 flex items-center gap-3">
                    <i className="ti ti-lock text-2xl text-[#7C3AED]"></i>
                    <div className="flex-1">
                      <div className="font-bold text-[#5B21B6] text-sm">{planConfig.upsellTitle}</div>
                      <div className="text-xs text-[#7C3AED] mt-0.5">{planConfig.upsellDesc}</div>
                    </div>
                    <button onClick={() => setPlan('paid')} className="shrink-0 bg-[#7C3AED] text-white text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#5B21B6] transition-colors">Upgrade ↗</button>
                  </div>
                )}

                {/* Tier sections — paid shows all 3 tiers, free just shows cards */}
                {isPaid ? (
                  ['lowest', 'medium', 'higher'].map(tier => {
                    const tierVariants = apiResult.results.filter(v => v.costTier === tier);
                    if (tierVariants.length === 0) return null;
                    const tierInfo = {
                      lowest: { label: '🟢 Lowest Shipping Cost', desc: 'Best images — drops to cheapest slab', bg: 'bg-[#D1FAE5]', border: 'border-[#10B981]/30', text: 'text-[#065F46]' },
                      medium: { label: '🟡 Medium Shipping Cost', desc: 'Good images — one slab below baseline', bg: 'bg-[#FEF3C7]', border: 'border-[#F59E0B]/30', text: 'text-[#92400E]' },
                      higher: { label: '🔴 Higher Shipping Cost', desc: 'Lower-ranked images — near baseline cost', bg: 'bg-[#FEE2E2]', border: 'border-[#EF4444]/30', text: 'text-[#991B1B]' },
                    }[tier as 'lowest' | 'medium' | 'higher']!;
                    return (
                      <div key={tier} className="mb-8">
                        <div className={\`flex items-center gap-3 px-4 py-3 rounded-xl border mb-4 \${tierInfo.bg} \${tierInfo.border}\`}>
                          <span className={\`font-black text-sm \${tierInfo.text}\`}>{tierInfo.label}</span>
                          <span className={\`text-xs \${tierInfo.text} opacity-70\`}>— {tierInfo.desc}</span>
                          <span className={\`ml-auto text-xs font-bold \${tierInfo.text}\`}>{tierVariants.length} variants</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                          {tierVariants.map(v => (
                            <VariantCard key={v.variantId} v={v} isPaid={isPaid} planConfig={planConfig} zone={zone} downloadVariant={downloadVariant} setPlan={setPlan} activeCfg={activeCfg} />
                          ))}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {apiResult.results.slice(0, 5).map(v => (
                      <VariantCard key={v.variantId} v={v} isPaid={isPaid} planConfig={planConfig} zone={zone} downloadVariant={downloadVariant} setPlan={setPlan} activeCfg={activeCfg} />
                    ))}
                  </div>
                )}
              </div>

              {/* Zone Rate Table */}
              <div className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm overflow-x-auto">
                <h3 className="text-sm font-bold text-[#0f172a] mb-4">Zone Rates — Best Variant (₹ per shipment)</h3>
                <table className="w-full text-sm">
                  <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                    <th className="text-left px-4 py-3 text-xs font-bold text-[#64748b]">Zone</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Forward</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">RTO</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-[#64748b]">Total (RTO@15%)</th>
                  </tr></thead>
                  <tbody>
                    {(["local", "regional", "national"] as const).map((z) => {
                      const r = apiResult.results[0].shipping.rates;
                      const rtoImpact = Math.round(r.rto * 2 * 0.15);
                      return (
                        <tr key={z} className={\`border-b border-[#f1f5f9] \${z === zone ? 'bg-[#EDE9FE]/20' : ''}\`}>
                          <td className="px-4 py-3 font-semibold capitalize">{z} {z === zone && <span className="text-[10px] text-[#7C3AED] font-bold ml-1">SELECTED</span>}</td>
                          <td className="px-4 py-3 text-center font-bold">₹{r[z]}</td>
                          <td className="px-4 py-3 text-center text-[#64748b]">₹{r.rto}</td>
                          <td className="px-4 py-3 text-center font-bold text-[#EF4444]">₹{r[z] + rtoImpact}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}`;

// Find from Plan Toggle to end of results section and replace
const startIdx = content.indexOf(OLD_GRID_START);
if (startIdx === -1) { console.error('START not found'); process.exit(1); }
const endIdx = content.indexOf(OLD_GRID_END, startIdx);
if (endIdx === -1) { console.error('END not found'); process.exit(1); }

content = content.slice(0, startIdx) + NEW_GRID;

fs.writeFileSync(path, content, 'utf8');
console.log('✓ Done — tiered variant grid replaced');
