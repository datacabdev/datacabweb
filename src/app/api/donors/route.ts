import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Donor from "@/models/Donor";

export async function GET() {
  await connectToDatabase();
  const donors = await Donor.find({ published: true }).sort({ order: 1 }).lean();
  return NextResponse.json(donors);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();
  const donor = await Donor.create(body);
  return NextResponse.json(donor, { status: 201 });
}
