import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "6");
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  // Legacy: if only "limit" passed with no "page", return flat array for homepage
  if (searchParams.has("limit") && !searchParams.has("page") && !search) {
    const news = await News.aggregate([
      { $match: { published: true } },
      { $addFields: { _s: { $ifNull: ["$order", 9999] } } },
      { $sort: { _s: 1, date: -1 } },
      { $limit: limit },
      { $project: { _s: 0 } },
    ]);
    return NextResponse.json(news);
  }

  const query = search
    ? { published: true, $or: [{ title: new RegExp(search, "i") }, { content: new RegExp(search, "i") }] }
    : { published: true };

  const [news, total] = await Promise.all([
    News.aggregate([
      { $match: query },
      { $addFields: { _s: { $ifNull: ["$order", 9999] } } },
      { $sort: { _s: 1, date: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { _s: 0 } },
    ]),
    News.countDocuments(query),
  ]);

  return NextResponse.json({ news, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const news = await News.create(body);
  return NextResponse.json(news, { status: 201 });
}
