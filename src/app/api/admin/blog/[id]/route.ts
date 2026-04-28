import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import News from "@/models/News";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await req.json();
  const updated = await News.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await News.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
