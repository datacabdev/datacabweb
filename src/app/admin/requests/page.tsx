"use client";
import { useEffect, useState, useCallback } from "react";
import { Trash2, ChevronDown } from "lucide-react";

interface DataRequest {
  _id: string;
  name: string;
  email: string;
  organization: string;
  message: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  reviewed: "bg-blue-50 text-blue-700 border-blue-200",
  resolved: "bg-green-50 text-green-700 border-green-200",
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<DataRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/requests");
    setRequests(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status: status as DataRequest["status"] } : r));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request?")) return;
    await fetch(`/api/admin/requests/${id}`, { method: "DELETE" });
    setRequests((prev) => prev.filter((r) => r._id !== id));
  };

  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-2xl p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-xl font-bold text-gray-900">Data Requests</h1>
          {pending > 0 && (
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {pending} pending
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <p className="text-center py-16 text-gray-400 text-sm">No requests yet</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r._id} className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpanded(expanded === r._id ? null : r._id)}
                >
                  <ChevronDown
                    size={16}
                    className={`text-gray-400 shrink-0 transition-transform ${expanded === r._id ? "rotate-180" : ""}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400 truncate">{r.email}{r.organization ? ` · ${r.organization}` : ""}</p>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0 hidden sm:block">
                    {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border shrink-0 ${STATUS_STYLES[r.status]}`}>
                    {r.status}
                  </span>
                </div>

                {/* Expanded detail */}
                {expanded === r._id && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Message</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">{r.message}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Update status</p>
                        <select
                          value={r.status}
                          onChange={(e) => updateStatus(r._id, e.target.value)}
                          className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                      <a
                        href={`mailto:${r.email}`}
                        className="mt-4 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1.5 rounded-lg"
                      >
                        Reply via Email
                      </a>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="mt-4 ml-auto flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
