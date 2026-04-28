"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Plus, Trash2, Pencil, X } from "lucide-react";
import Toast from "@/components/admin/Toast";
import Image from "next/image";
import ImageUploadField from "@/components/admin/ImageUploadField";
import dynamic from "next/dynamic";

const RichTextEditor = dynamic(() => import("@/components/admin/RichTextEditor"), { ssr: false, loading: () => <div className="h-40 bg-[#EBEBEB] rounded-lg animate-pulse" /> });

interface BlogPost {
  _id: string;
  title: string;
  image: string;
  content: string;
  date?: string;
  order?: number;
}

const emptyForm = { title: "", image: "", content: "", order: "" };

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/blog?search=${encodeURIComponent(search)}&page=${page}`);
    const data = await res.json();
    setPosts(data.posts || []); setPages(data.pages || 1);
    setLoading(false);
  }, [search, page]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (p: BlogPost) => {
    setForm({ title: p.title, image: p.image || "", content: p.content || "", order: p.order != null ? String(p.order) : "" });
    setEditId(p._id); setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    const res = await fetch(editId ? `/api/admin/blog/${editId}` : "/api/admin/blog", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: form.order !== "" ? Number(form.order) : 0 }),
    });
    setSaving(false);
    if (res.ok) {
      setToast({ message: editId ? "Blog post updated successfully" : "Blog post created successfully", type: "success" });
      setShowModal(false); load();
    } else {
      const data = await res.json().catch(() => ({}));
      setToast({ message: data.error ?? "Failed to save blog post", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) setToast({ message: "Blog post deleted", type: "success" });
    else setToast({ message: "Failed to delete blog post", type: "error" });
    load();
  };

  return (
    <>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Blog</h1>

        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64">
            <Search size={14} className="text-gray-400" />
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search..." className="text-sm outline-none w-full" />
          </div>
          <button onClick={openCreate} className="ml-auto flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            <Plus size={14} /> Upload Blog
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => <div key={i} className="aspect-[3/2] bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-16 text-gray-400 text-sm">No blog posts yet</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {posts.map((post) => (
              <div key={post._id} className="relative group bg-gray-100 rounded-xl overflow-hidden">
                <div className="relative aspect-[3/2]">
                  {post.image ? (
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(post._id)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-red-50">
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                  <button onClick={() => openEdit(post)} className="w-7 h-7 bg-white rounded-full flex items-center justify-center shadow hover:bg-blue-50">
                    <Pencil size={12} className="text-blue-500" />
                  </button>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-800 line-clamp-2 leading-snug">{post.title}</p>
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
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 my-4">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><span className="text-lg">←</span></button>
                <h2 className="text-lg font-bold text-gray-900">{editId ? "Edit Blog" : "Upload Blog"}</h2>
              </div>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <ImageUploadField value={form.image} onChange={(url) => setForm((p) => ({ ...p, image: url }))} label="Cover Image" />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
                <input required value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="Enter blog title" className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Blog Content</label>
                <RichTextEditor value={form.content} onChange={(html) => setForm((p) => ({ ...p, content: html }))} />
              </div>
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
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm">
                  {saving ? "Saving..." : editId ? "Save Changes" : "Upload Blog"}
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
