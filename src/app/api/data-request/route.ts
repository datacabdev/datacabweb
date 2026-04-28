import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DataRequest from "@/models/DataRequest";

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const { name, email, organization, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const request = await DataRequest.create({ name, email, organization, message });
  return NextResponse.json({ success: true, id: request._id }, { status: 201 });
}

export async function GET() {
  await connectToDatabase();
  const requests = await DataRequest.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(requests);
}
