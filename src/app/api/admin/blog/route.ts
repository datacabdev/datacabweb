import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 8;
  const query = search ? { title: new RegExp(search, "i") } : {};
  const [posts, total] = await Promise.all([
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
  return NextResponse.json({ posts, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  if (!body.slug) {
    body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
  }
  const post = await News.create(body);
  return NextResponse.json(post, { status: 201 });
}
