import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface MediaItem {
  _id: string;
  title: string;
  url: string;
  thumbnail: string;
  type: string;
}

export default function MultimediaSection({ items, subtitle }: { items: MediaItem[]; subtitle?: string }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Multimedia</h2>
          <Link href="/multimedia" className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1">
            See all <ArrowUpRight size={16} />
          </Link>
        </div>
        {subtitle && <p className="text-gray-500 text-sm mb-8">{subtitle}</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {items.slice(0, 8).map((item) => (
            <Link key={item._id} href={`/multimedia`} className="relative group aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <Image
                src={item.thumbnail || item.url}
                alt={item.title || "Media"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.title && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-sm font-black text-center line-clamp-3 leading-snug">{item.title}</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
