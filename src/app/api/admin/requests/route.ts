import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import DataRequest from "@/models/DataRequest";

export async function GET() {
  await connectToDatabase();
  const requests = await DataRequest.find().sort({ createdAt: -1 }).lean();
  return NextResponse.json(requests);
}
