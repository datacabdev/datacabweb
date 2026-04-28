import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Multimedia from "@/models/Multimedia";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const body = await req.json();
  const updated = await Multimedia.findByIdAndUpdate(id, body, { new: true });
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await Multimedia.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
