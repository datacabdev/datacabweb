import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Multimedia from "@/models/Multimedia";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "8");
  const page = parseInt(searchParams.get("page") || "1");

  // Legacy flat response for homepage
  if (searchParams.has("limit") && !searchParams.has("page")) {
    const items = await Multimedia.find({ published: true }).sort({ order: 1, createdAt: -1 }).limit(limit).lean();
    return NextResponse.json(items);
  }

  const [items, total] = await Promise.all([
    Multimedia.find({ published: true }).sort({ order: 1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
    Multimedia.countDocuments({ published: true }),
  ]);

  return NextResponse.json({ items, total, pages: Math.ceil(total / limit) });
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const item = await Multimedia.create(body);
  return NextResponse.json(item, { status: 201 });
}
