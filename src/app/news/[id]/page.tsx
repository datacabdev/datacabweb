import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ArrowUpRight } from "lucide-react";

export const revalidate = 60;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;

  await connectToDatabase();

  const post = await News.findById(id).lean() as {
    _id: string; title: string; image: string;
    content: string; date: string;
  } | null;

  if (!post) notFound();

  const related = await News.find({ published: true, _id: { $ne: id } })
    .sort({ date: -1 })
    .limit(3)
    .lean() as Array<{ _id: string; title: string; image: string; content: string; date: string }>;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main article */}
          <article className="lg:col-span-2">
            {post.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-gray-100">
                <Image src={post.image} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
              <Calendar size={13} />
              <span>
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">
              {post.title}
            </h1>


            <div
              className="prose-content text-gray-700 text-sm leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: post.content || "" }}
            />
          </article>

          {/* You May Also Like */}
          {related.length > 0 && (
            <aside className="lg:col-span-1">
              <h2 className="text-xl font-bold text-gray-900 mb-6">You May Also Like</h2>
              <div className="space-y-6">
                {related.map((item) => (
                  <article key={String(item._id)} className="group">
                    <Link href={`/news/${item._id}`}>
                      <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        )}
                      </div>
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1.5">
                      <Calendar size={11} />
                      <span>{new Date(item.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                      <Link href={`/news/${item._id}`}>{item.title}</Link>
                    </h3>
                    {item.content && (
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.content.replace(/<[^>]*>/g, "")}</p>
                    )}
                    <Link href={`/news/${item._id}`} className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:underline">
                      Read more <ArrowUpRight size={12} />
                    </Link>
                  </article>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
