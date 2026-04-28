"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, Pencil, X } from "lucide-react";
import dynamic from "next/dynamic";
import Toast from "@/components/admin/Toast";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false, loading: () => <div className="h-40 bg-[#EBEBEB] rounded-lg animate-pulse" /> });

interface ContentItem {
  _id: string;
  title: string;
  content: string;
}

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/content?search=${encodeURIComponent(search)}`);
    setItems(await res.json());
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ title: "", content: "" }); setEditId(null); setShowModal(true); };
  const openEdit = (item: ContentItem) => { setForm({ title: item.title, content: item.content }); setEditId(item._id); setShowModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch(editId ? `/api/admin/content/${editId}` : "/api/admin/content", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      setToast({ message: editId ? "Content updated successfully" : "Content created successfully", type: "success" });
      setShowModal(false); load();
    } else {
      const data = await res.json().catch(() => ({}));
      setToast({ message: data.error ?? "Failed to save content", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this content?")) return;
    const res = await fetch(`/api/admin/content/${id}`, { method: "DELETE" });
    if (res.ok) setToast({ message: "Content deleted", type: "success" });
    else setToast({ message: "Failed to delete content", type: "error" });
    load();
  };

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 120);

  return (
    <>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Website Content</h1>

        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search size={14} className="text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="text-sm outline-none w-full" />
          </div>
          <button onClick={openCreate} className="ml-auto flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            <Plus size={14} /> Upload Content
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-16 text-gray-400 text-sm">No content yet. Click &quot;Upload Content&quot; to add.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <div key={item._id} className="bg-[#F5F6FB] rounded-xl p-4 relative group">
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(item._id)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50">
                    <Trash2 size={12} className="text-gray-400 hover:text-red-500" />
                  </button>
                  <button onClick={() => openEdit(item)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-50">
                    <Pencil size={12} className="text-gray-400 hover:text-blue-500" />
                  </button>
                </div>
                <p className="text-sm font-semibold text-gray-700 mb-2">{item.title}</p>
                <div className="text-sm font-bold text-gray-900 mb-1 line-clamp-1" dangerouslySetInnerHTML={{ __html: item.content.split("</h")[0] || item.title }} />
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">{stripHtml(item.content)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-lg">←</button>
                <h2 className="text-lg font-bold text-gray-900">{editId ? "Edit Content" : "Upload Website Content"}</h2>
              </div>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Where do you want to see this content displayed?
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Enter title"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <RichTextEditor value={form.content} onChange={(html) => setForm((p) => ({ ...p, content: html }))} />
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
                  {saving ? "Saving..." : "Upload Content"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
