import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AirMonitoringData from "@/models/AirMonitoringData";

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

async function extractDeviceData(deviceUrl: string) {
  const res = await fetch(deviceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Failed to fetch device URL: ${res.status}`);
  const html = await res.text();

  const latMatch = html.match(/\blat:\s*([\d.]+)/);
  const lonMatch = html.match(/\blon:\s*([\d.]+)/);
  const locationMatch = html.match(/\blocation:\s*"([^"]+)"/);
  const serialMatch = html.match(/\bserial_number:\s*"([^"]+)"/);

  if (!latMatch || !lonMatch) {
    throw new Error("Could not extract coordinates from device URL.");
  }

  const lat = parseFloat(latMatch[1]);
  const lon = parseFloat(lonMatch[1]);
  const locationName = locationMatch?.[1] ?? "";
  const serialNumber = serialMatch?.[1] ?? "";

  let community = serialNumber;
  let state = "";
  if (serialNumber.includes(",")) {
    const parts = serialNumber.split(",").map((p) => p.trim());
    community = toTitleCase(parts.slice(0, -1).join(", "));
    state = toTitleCase(parts[parts.length - 1]);
  }

  const location = [toTitleCase(locationName), state].filter(Boolean).join(" ");
  return { latitude: lat, longitude: lon, location, community };
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  const { deviceUid, deviceUrl, order } = await req.json();

  if (!deviceUid || !deviceUrl) {
    return NextResponse.json({ error: "deviceUid and deviceUrl are required" }, { status: 400 });
  }

  try {
    const { latitude, longitude, location, community } = await extractDeviceData(deviceUrl);
    const updated = await AirMonitoringData.findByIdAndUpdate(
      id,
      { deviceUid, deviceUrl, latitude, longitude, location, community, date: new Date(), ...(order !== undefined && { order: Number(order) }) },
      { new: true }
    );
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch device data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectToDatabase();
  const { id } = await params;
  await AirMonitoringData.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
