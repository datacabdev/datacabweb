"use client";
import { useEffect, useState, useCallback } from "react";
import { Search, Filter, Download, Plus, Trash2, MoreVertical, Copy, X, Pencil } from "lucide-react";
import Toast from "@/components/admin/Toast";

interface AirRecord {
  _id: string;
  date: string;
  location: string;
  community: string;
  longitude: number;
  latitude: number;
  deviceUid: string;
  deviceUrl: string;
  order: number;
}

const emptyForm = { deviceUid: "", deviceUrl: "", order: "" };

export default function DashboardPage() {
  const [records, setRecords] = useState<AirRecord[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/air-data?search=${encodeURIComponent(search)}`);
    setRecords(await res.json());
    setLoading(false);
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(emptyForm); setEditId(null); setSaveError(""); setShowModal(true); };
  const openEdit = (r: AirRecord) => {
    setForm({ deviceUid: r.deviceUid, deviceUrl: r.deviceUrl, order: r.order != null ? String(r.order) : "" });
    setEditId(r._id); setSaveError(""); setShowModal(true); setActiveMenu(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError("");
    const res = await fetch(editId ? `/api/admin/air-data/${editId}` : "/api/admin/air-data", {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, order: form.order !== "" ? Number(form.order) : 0 }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setSaveError(data.error ?? "Something went wrong");
      setToast({ message: data.error ?? "Something went wrong", type: "error" });
      return;
    }
    setShowModal(false);
    setToast({ message: editId ? "Device updated successfully" : "Device added successfully", type: "success" });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record?")) return;
    const res = await fetch(`/api/admin/air-data/${id}`, { method: "DELETE" });
    setActiveMenu(null);
    if (res.ok) setToast({ message: "Device deleted", type: "success" });
    else setToast({ message: "Failed to delete device", type: "error" });
    load();
  };

  const downloadCSV = () => {
    const headers = ["Date", "Location", "Community", "Longitude", "Latitude", "Device Uid", "Device URL"];
    const rows = records.map((r) => [r.date?.slice(0, 10), r.location, r.community, r.longitude, r.latitude, r.deviceUid, r.deviceUrl]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "air-monitoring.csv"; a.click();
  };

  return (
    <>
    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-5">Air Monitoring Data</h1>

        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white w-full sm:w-56">
            <Search size={14} className="text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search for data..." className="text-sm outline-none w-full" />
          </div>
          <button className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={14} /> Filter
          </button>
          <button onClick={downloadCSV} className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Download size={14} /> Download
          </button>
          <button onClick={openCreate} className="ml-auto flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            <Plus size={14} /> Upload data
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-left font-medium text-gray-500 w-6"><input type="checkbox" /></th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Date</th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Location</th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Community</th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Longitude</th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Latitude</th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Device Uid</th>
                <th className="py-3 pr-6 text-left font-medium text-gray-500">Order</th>
                <th className="py-3 w-16" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-400 text-sm">Loading...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={8} className="py-10 text-center text-gray-400 text-sm">No records found</td></tr>
              ) : records.map((r) => (
                <tr key={r._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 pr-4"><input type="checkbox" /></td>
                  <td className="py-3 pr-6 text-gray-700">{r.date?.slice(0, 10)}</td>
                  <td className="py-3 pr-6 text-gray-700 max-w-[140px] truncate">{r.location}</td>
                  <td className="py-3 pr-6 text-gray-700 max-w-[140px] truncate">{r.community}</td>
                  <td className="py-3 pr-6 text-gray-700">{r.longitude}</td>
                  <td className="py-3 pr-6 text-gray-700">{r.latitude}</td>
                  <td className="py-3 pr-6 text-gray-700 max-w-[120px] truncate">{r.deviceUid}</td>
                  <td className="py-3 pr-6 text-gray-700">{r.order ?? 0}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1 relative">
                      <button onClick={() => navigator.clipboard.writeText(r.deviceUid)} className="p-1 hover:bg-gray-100 rounded" title="Copy UID">
                        <Copy size={13} className="text-gray-400" />
                      </button>
                      <button onClick={() => setActiveMenu(activeMenu === r._id ? null : r._id)} className="p-1 hover:bg-gray-100 rounded">
                        <MoreVertical size={13} className="text-gray-400" />
                      </button>
                      {activeMenu === r._id && (
                        <div className="absolute right-0 top-7 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1 w-28">
                          <button onClick={() => openEdit(r)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                            <Pencil size={12} /> Edit
                          </button>
                          <button onClick={() => handleDelete(r._id)} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">{editId ? "Edit Device" : "Add Device"}</h2>
              <button onClick={() => setShowModal(false)}><X size={18} className="text-gray-400" /></button>
            </div>

            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Enter the Device UID and Device URL. Location, coordinates, and community will be automatically extracted from the device dashboard.
            </p>

            {saveError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
                {saveError}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Device UID
                </label>
                <input
                  required
                  value={form.deviceUid}
                  onChange={(e) => setForm((p) => ({ ...p, deviceUid: e.target.value }))}
                  placeholder="e.g. 863740067..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <span className="text-red-500">*</span> Device URL
                </label>
                <input
                  required
                  value={form.deviceUrl}
                  onChange={(e) => setForm((p) => ({ ...p, deviceUrl: e.target.value }))}
                  placeholder="https://airnote.live/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={form.order}
                  onChange={(e) => setForm((p) => ({ ...p, order: e.target.value }))}
                  placeholder="0 = first"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-lg text-sm flex items-center gap-2"
                >
                  {saving && (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {saving ? "Fetching data…" : editId ? "Save Changes" : "Add Device"}
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
