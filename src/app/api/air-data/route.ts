import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AirMonitoringData from "@/models/AirMonitoringData";

export async function GET() {
  try {
    await connectToDatabase();
    const data = await AirMonitoringData.aggregate([
      { $addFields: { _s: { $ifNull: ["$order", 9999] } } },
      { $sort: { _s: 1, date: -1 } },
      { $project: { _s: 0 } },
    ]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
