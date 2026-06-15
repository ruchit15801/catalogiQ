"use client";

import { useState } from "react";
import { useAppData, genId, calculateShippingSlab } from "../../lib/store";

export default function CatalogManager() {
  const { data, addProduct, removeProduct, toggleProductOptimized } = useAppData();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formWeight, setFormWeight] = useState("400");
  const [formMarketplace, setFormMarketplace] = useState("meesho");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const weight = Number(formWeight);
    const slab = calculateShippingSlab(weight, formMarketplace);
    addProduct({
      id: genId(),
      name: formName.trim(),
      sku: formSku.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`,
      images: Math.floor(Math.random() * 6 + 3),
      optimized: false,
      weight: `${weight}g`,
      slab: slab.slab,
      marketplace: formMarketplace,
      addedAt: Date.now(),
    });
    setFormName("");
    setFormSku("");
    setFormWeight("400");
    setShowForm(false);
  };

  const filtered = data.products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
  const optimizedCount = data.products.filter(p => p.optimized).length;
  const pendingCount = data.products.length - optimizedCount;

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">Catalog Manager</h1>
          <p className="text-[#475569] mt-1 text-sm">{data.products.length} products • {optimizedCount} optimized • {pendingCount} pending</p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-sm flex-1 sm:flex-none"><i className="ti ti-plus"></i> Add Product</button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-5 md:p-6 rounded-xl border-2 border-[#7C3AED] shadow-lg mb-6 animate-fade-up">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">Add Product to Catalog</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Product Name" className="input-control" required />
            <input type="text" value={formSku} onChange={(e) => setFormSku(e.target.value)} placeholder="SKU (auto-generated)" className="input-control" />
            <input type="number" value={formWeight} onChange={(e) => setFormWeight(e.target.value)} placeholder="Weight (g)" className="input-control" required min={1} />
            <select value={formMarketplace} onChange={(e) => setFormMarketplace(e.target.value)} className="input-control"><option value="meesho">Meesho</option><option value="flipkart">Flipkart</option><option value="amazon">Amazon</option></select>
          </div>
          <button type="submit" className="btn btn-primary mt-4">Add to Catalog</button>
        </form>
      )}

      <div className="mb-6">
        <input type="text" placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-control max-w-md" />
      </div>

      {data.products.length === 0 ? (
        <div className="text-center py-16 text-[#64748b] bg-white rounded-xl border border-dashed border-[#cbd5e1]">
          <i className="ti ti-box-off text-5xl mb-4 block text-[#cbd5e1]"></i>
          <p className="font-medium text-lg text-[#0f172a]">Catalog is empty</p>
          <p className="text-sm mt-1">Add your first product to start tracking optimization</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Product</th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase hidden md:table-cell">SKU</th>
                <th className="text-left px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase hidden sm:table-cell">Marketplace</th>
                <th className="text-center px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Weight</th>
                <th className="text-center px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Status</th>
                <th className="text-center px-4 md:px-6 py-4 text-xs font-bold text-[#64748b] uppercase w-12"></th>
              </tr></thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc] transition-colors">
                    <td className="px-4 md:px-6 py-4">
                      <div className="font-semibold text-sm text-[#0f172a]">{product.name}</div>
                      <div className="text-xs text-[#64748b] md:hidden mt-0.5">{product.sku}</div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-[#475569] font-mono hidden md:table-cell">{product.sku}</td>
                    <td className="px-4 md:px-6 py-4 text-sm text-[#475569] hidden sm:table-cell">{product.marketplace}</td>
                    <td className="px-4 md:px-6 py-4 text-sm font-semibold text-center text-[#0f172a]">{product.weight}</td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <button onClick={() => toggleProductOptimized(product.id)} className="cursor-pointer">
                        {product.optimized ? (
                          <span className="text-xs font-bold bg-[#D1FAE5] text-[#065F46] px-3 py-1 rounded-full"><i className="ti ti-check mr-1"></i>Optimized</span>
                        ) : (
                          <span className="text-xs font-bold bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full">Pending</span>
                        )}
                      </button>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-center">
                      <button onClick={() => removeProduct(product.id)} className="text-[#64748b] hover:text-[#EF4444] transition-colors" title="Remove"><i className="ti ti-trash text-lg"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
