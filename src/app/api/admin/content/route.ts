import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import WebsiteContent from "@/models/WebsiteContent";

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const query = search ? { title: new RegExp(search, "i") } : {};
  const items = await WebsiteContent.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const item = await WebsiteContent.create(body);
  return NextResponse.json(item, { status: 201 });
}
