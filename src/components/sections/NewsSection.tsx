"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

interface NewsItem {
  _id: string;
  title: string;
  content: string;
  image: string;
  date: string;
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "");
}

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/news/${item._id}`} className="group block">
      <div className="relative w-full h-[180px] rounded-[14px] overflow-hidden bg-gray-100 mb-4">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        )}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-2">
        <Calendar size={12} />
        <span>
          {new Date(item.date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
      <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {item.title}
      </h3>
      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
        {stripHtml(item.content || "")}
      </p>
      <span className="text-blue-600 text-xs font-semibold flex items-center gap-1">
        Read more <ArrowRight size={12} />
      </span>
    </Link>
  );
}

export default function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/news?limit=3").then((r) => r.json()),
      fetch("/api/content?title=Environmental News").then((r) => r.json()),
    ])
      .then(([newsData, contentData]) => {
        setNews(Array.isArray(newsData) ? newsData : []);
        if (contentData?.content) {
          setSubtitle(
            contentData.content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
          );
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-gray-50 py-10 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl lg:text-3xl font-black text-gray-900 uppercase">
            Environmental News
          </h2>
          {!loading && news.length > 0 && (
            <Link
              href="/news"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
            >
              See all <ArrowRight size={16} />
            </Link>
          )}
        </div>

        {subtitle && <p className="text-gray-500 text-sm mb-6">{subtitle}</p>}

        {loading ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[19px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="w-full h-[180px] bg-gray-200 animate-pulse rounded-[14px]" />
                <div className="h-3 bg-gray-200 animate-pulse rounded w-28" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : news.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-y-[30px] md:gap-[19px]">
            {news.map((item) => (
              <NewsCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-center text-red-500 mt-10">Content not available</p>
        )}
      </div>
    </section>
  );
}
