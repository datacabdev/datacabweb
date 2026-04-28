"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export default function MultimediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [subtitle, setSubtitle] = useState("");
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch("/api/content?title=Multimedia")
      .then((r) => r.json())
      .then((d) => {
        if (d?.content) {
          setSubtitle(d.content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim());
        }
      })
      .catch(() => {});
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/multimedia?page=${page}`);
    const data = await res.json();
    setItems(data.items || []);
    setPages(data.pages || 1);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const openLightbox = (item: MediaItem, index: number) => {
    setLightbox(item);
    setLightboxIndex(index);
  };

  const closeLightbox = () => setLightbox(null);

  const prevImage = () => {
    const newIndex = (lightboxIndex - 1 + items.length) % items.length;
    setLightbox(items[newIndex]);
    setLightboxIndex(newIndex);
  };

  const nextImage = () => {
    const newIndex = (lightboxIndex + 1) % items.length;
    setLightbox(items[newIndex]);
    setLightboxIndex(newIndex);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!lightbox) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevImage();
      if (e.key === "ArrowRight") nextImage();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, lightboxIndex, items]);

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-3">Multimedia</h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mb-10 max-w-xl">{subtitle}</p>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center py-20 text-gray-400">No media available yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {items.map((item, index) => (
              <button
                key={item._id}
                onClick={() => openLightbox(item, index)}
                className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Image
                  src={item.thumbnail || item.url}
                  alt={item.title || "Media"}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {item.title && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-black text-center line-clamp-3 leading-snug">{item.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {pages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 border border-gray-200 rounded-lg text-sm flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
            >
              ‹
            </button>
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${page === i + 1 ? "bg-blue-600 text-white" : "border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="w-8 h-8 border border-gray-200 rounded-lg text-sm flex items-center justify-center disabled:opacity-40 hover:bg-gray-50"
            >
              ›
            </button>
          </div>
        )}
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 z-10"
          >
            <X size={18} className="text-gray-700" />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center z-10"
              >
                <ChevronLeft size={20} className="text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center z-10"
              >
                <ChevronRight size={20} className="text-white" />
              </button>
            </>
          )}

          <div
            className="relative max-w-4xl w-full max-h-[80vh] aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.url || lightbox.thumbnail}
              alt={lightbox.title || "Media"}
              fill
              className="object-contain"
            />
            {lightbox.title && (
              <p className="absolute bottom-0 left-0 right-0 text-center text-white text-sm bg-black/40 py-2 px-4">
                {lightbox.title}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
