"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppData, genId, timeAgo } from "../../lib/store";

export default function Projects() {
  const { data, addProject, removeProject } = useAppData();
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newMarketplace, setNewMarketplace] = useState("meesho");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addProject({ id: genId(), name: newName.trim(), marketplace: newMarketplace, createdAt: Date.now(), items: 0, optimized: 0 });
    setNewName("");
    setShowForm(false);
  };

  const filtered = data.projects.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Calculate savings per project from optimization history
  const projectSavings = (projectName: string) => {
    return data.optimizations.filter(o => o.projectName === projectName).reduce((s, o) => s + o.savings, 0);
  };

  return (
    <div className="animate-fade-up max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">My Projects</h1>
          <p className="text-[#475569] mt-1 text-sm">{data.projects.length} projects • {data.optimizations.length} total optimizations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary text-sm w-full sm:w-auto"><i className="ti ti-plus"></i> New Project</button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white p-5 md:p-6 rounded-xl border-2 border-[#7C3AED] shadow-lg mb-6 animate-fade-up">
          <h3 className="text-lg font-bold text-[#0f172a] mb-4">Create New Project</h3>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px_auto] gap-4">
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Project Name (e.g., Saree Summer 2026)" className="input-control" required />
            <select value={newMarketplace} onChange={(e) => setNewMarketplace(e.target.value)} className="input-control"><option value="meesho">Meesho</option><option value="flipkart">Flipkart</option><option value="amazon">Amazon</option></select>
            <button type="submit" className="btn btn-primary shrink-0">Create</button>
          </div>
        </form>
      )}

      <div className="mb-6">
        <input type="text" placeholder="Search projects..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-control max-w-md" />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#64748b] bg-white rounded-xl border border-dashed border-[#cbd5e1]">
          <i className="ti ti-folder-off text-5xl mb-4 block text-[#cbd5e1]"></i>
          <p className="font-medium text-lg text-[#0f172a]">No projects yet</p>
          <p className="text-sm mt-1">Click "New Project" to create your first catalog project</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((project) => {
            const savings = projectSavings(project.name);
            return (
              <div key={project.id} className="bg-white p-5 md:p-6 rounded-xl border border-[#e2e8f0] hover:border-[#A78BFA] hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base md:text-lg font-bold text-[#0f172a] truncate group-hover:text-[#7C3AED] transition-colors">{project.name}</h3>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-[#64748b]">
                      <span><i className="ti ti-building-store mr-1"></i>{project.marketplace}</span>
                      <span><i className="ti ti-clock mr-1"></i>{timeAgo(project.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    {savings > 0 && <div className="text-right"><div className="text-lg font-bold text-[#10B981]">₹{savings}</div><div className="text-xs text-[#64748b]">saved</div></div>}
                    <Link href="/dashboard/optimizer" className="btn btn-secondary text-xs py-2 px-3"><i className="ti ti-wand"></i> Optimize</Link>
                    <button onClick={() => removeProject(project.id)} className="text-[#64748b] hover:text-[#EF4444] transition-colors p-2" title="Delete"><i className="ti ti-trash text-lg"></i></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
