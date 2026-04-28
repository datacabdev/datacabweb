"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, ArrowUpRight } from "lucide-react";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [subtitle, setSubtitle] = useState("");

  useEffect(() => {
    fetch("/api/content?title=Environmental News")
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
    const res = await fetch(`/api/news?page=${page}&search=${encodeURIComponent(query)}&limit=6`);
    const data = await res.json();
    setPosts(data.news || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  }, [page, query]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(search);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Environmental News</h1>
        {subtitle && (
          <p className="text-gray-500 text-sm mb-8 max-w-xl">{subtitle}</p>
        )}

        <form onSubmit={handleSearch} className="flex gap-3 mb-10 max-w-lg">
          <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-4 py-2.5 bg-white">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for data..."
              className="w-full text-sm outline-none"
            />
          </div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors">
            Search
          </button>
        </form>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-gray-100 rounded-xl mb-3" />
                <div className="h-3 bg-gray-100 rounded w-24 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full mb-1" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center py-20 text-gray-400">
            {query ? `No results for "${query}"` : "No news articles yet."}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <article key={post._id} className="group">
                <Link href={`/news/${post._id}`}>
                  <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4">
                    {post.image ? (
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                    )}
                  </div>
                </Link>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
                  <Calendar size={12} />
                  <span>
                    {new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <h2 className="font-bold text-gray-900 text-base leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  <Link href={`/news/${post._id}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{post.content?.replace(/<[^>]*>/g, "")}</p>
                <Link href={`/news/${post._id}`} className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline">
                  Read more <ArrowUpRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        )}

        {!loading && total > 0 && pages > 1 && (
          <div className="flex justify-end items-center gap-2 mt-10">
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
    </div>
  );
}
