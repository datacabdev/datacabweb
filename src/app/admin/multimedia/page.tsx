"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, X, Pencil } from "lucide-react";
import Toast from "@/components/admin/Toast";
import Image from "next/image";
import ImageUploadField from "@/components/admin/ImageUploadField";

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  type: string;
  order?: number;
}

export default function MultimediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", type: "image", order: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/multimedia?search=${encodeURIComponent(search)}&page=${page}`);
    const data = await res.json();
    setItems(data.items || []);
    setPages(data.pages || 1);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm({ title: "", url: "", type: "image", order: "" }); setEditId(null); setShowModal(true); };
  const openEdit = (item: MediaItem) => {
    setForm({ title: item.title || "", url: item.url, type: item.type, order: item.order != null ? String(item.order) : "" });
    setEditId(item._id); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.url) { alert("Please upload an image first"); return; }
    setSaving(true);
    const payload = { ...form, thumbnail: form.url, order: form.order !== "" ? Number(form.order) : 0 };
    const res = await fetch(editId ? `/api/admin/multimedia/${editId}` : "/api/admin/multimedia", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setToast({ message: editId ? "Image updated successfully" : "Image uploaded successfully", type: "success" });
      setShowModal(false);
      setForm({ title: "", url: "", type: "image", order: "" }); setEditId(null); load();
    } else {
      const data = await res.json().catch(() => ({}));
      setToast({ message: data.error ?? "Failed to save image", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/admin/multimedia/${id}`, { method: "DELETE" });
    if (res.ok) setToast({ message: "Image deleted", type: "success" });
    else setToast({ message: "Failed to delete image", type: "error" });
    load();
  };

  return (
    <>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Multimedia</h1>

        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search size={14} className="text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search images by title..." className="text-sm outline-none w-full" />
          </div>
          <button onClick={openCreate} className="ml-auto flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            <Plus size={14} /> Upload Image
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(8).fill(0).map((_, i) => <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-16 text-gray-400 text-sm">No media uploaded yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item) => (
              <div key={item._id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <Image src={item.url} alt={item.title || "Media"} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.title && (
                    <p className="text-white text-sm font-black text-center line-clamp-3 leading-snug">{item.title}</p>
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => openEdit(item)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-50">
                    <Pencil size={12} className="text-blue-500" />
                  </button>
                  <button onClick={() => handleDelete(item._id)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50">
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-5">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 border border-gray-200 rounded-lg text-sm flex items-center justify-center disabled:opacity-40">‹</button>
            {Array.from({ length: pages }, (_, i) => (
              <button key={i + 1} onClick={() => setPage(i + 1)} className={`w-8 h-8 rounded-lg text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{i + 1}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="w-8 h-8 border border-gray-200 rounded-lg text-sm flex items-center justify-center disabled:opacity-40">›</button>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Edit Image" : "Upload Image"}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Enter image title" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <ImageUploadField value={form.url} onChange={(url) => setForm((p) => ({ ...p, url }))} label="" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                  placeholder="0 = first"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end">
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
                  {saving ? "Saving..." : editId ? "Save Changes" : "Upload Image"}
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
