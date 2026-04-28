import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Multimedia from "@/models/Multimedia";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 8;
  const query = search ? { title: new RegExp(search, "i") } : {};
  const [items, total] = await Promise.all([
    Multimedia.aggregate([
      { $match: query },
      { $addFields: { _s: { $ifNull: ["$order", 9999] } } },
      { $sort: { _s: 1, createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
      { $project: { _s: 0 } },
    ]),
    Multimedia.countDocuments(query),
  ]);
  return NextResponse.json({ items, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const item = await Multimedia.create(body);
  return NextResponse.json(item, { status: 201 });
}
