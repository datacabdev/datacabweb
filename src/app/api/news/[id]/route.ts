import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;

  const post = await News.findById(id).lean();
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const related = await News.find({ published: true, _id: { $ne: id } })
    .sort({ date: -1 })
    .limit(3)
    .lean();

  return NextResponse.json({ post, related });
}
