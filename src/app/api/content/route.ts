import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WebsiteContent from "@/models/WebsiteContent";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title");
  if (title) {
    const item = await WebsiteContent.findOne({ title: new RegExp(`^${title}$`, "i") }).lean();
    return NextResponse.json(item ?? null);
  }
  const items = await WebsiteContent.find({}).sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}
