import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AirMonitoringData from "@/models/AirMonitoringData";

interface ReadingData {
  lat: number;
  lon: number;
  location: string;
  serial_number?: string;
}

function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

async function extractDeviceData(deviceUrl: string): Promise<{
  latitude: number;
  longitude: number;
  location: string;
  community: string;
}> {
  const res = await fetch(deviceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Failed to fetch device URL: ${res.status}`);
  const html = await res.text();

  // Extract the embedded readings JSON from the SvelteKit __sveltekit data block
  // Pattern: readings: [{ lat: ..., lon: ..., location: "...", serial_number: "..." }]
  const latMatch = html.match(/\blat:\s*([\d.]+)/);
  const lonMatch = html.match(/\blon:\s*([\d.]+)/);
  const locationMatch = html.match(/\blocation:\s*"([^"]+)"/);
  const serialMatch = html.match(/\bserial_number:\s*"([^"]+)"/);

  if (!latMatch || !lonMatch) {
    throw new Error("Could not extract coordinates from device URL. Please verify the URL is correct.");
  }

  const reading: ReadingData = {
    lat: parseFloat(latMatch[1]),
    lon: parseFloat(lonMatch[1]),
    location: locationMatch?.[1] ?? "",
    serial_number: serialMatch?.[1] ?? "",
  };

  // serial_number format: "OTUABAGI COMMUNITY, BAYELSA STATE"
  // → community = "OTUABAGI COMMUNITY", state = "BAYELSA STATE"
  let community = reading.serial_number ?? "";
  let state = "";

  if (reading.serial_number?.includes(",")) {
    const parts = reading.serial_number.split(",").map((p) => p.trim());
    community = toTitleCase(parts.slice(0, -1).join(", "));
    state = toTitleCase(parts[parts.length - 1]);
  }

  // Location: "Ogbia Bayelsa State"
  const location = [toTitleCase(reading.location), state].filter(Boolean).join(" ");

  return { latitude: reading.lat, longitude: reading.lon, location, community };
}

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const query = search
    ? { $or: [{ location: new RegExp(search, "i") }, { community: new RegExp(search, "i") }, { deviceUid: new RegExp(search, "i") }] }
    : {};
  const matchStage = Object.keys(query).length ? [{ $match: query }] : [];
  const data = await AirMonitoringData.aggregate([
    ...matchStage,
    { $addFields: { _s: { $ifNull: ["$order", 9999] } } },
    { $sort: { _s: 1, date: -1 } },
    { $project: { _s: 0 } },
  ]);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const { deviceUid, deviceUrl } = await req.json();

  if (!deviceUid || !deviceUrl) {
    return NextResponse.json({ error: "deviceUid and deviceUrl are required" }, { status: 400 });
  }

  const existing = await AirMonitoringData.findOne({ deviceUid });
  if (existing) {
    return NextResponse.json({ error: `Device "${deviceUid}" already exists.` }, { status: 409 });
  }

  try {
    const { latitude, longitude, location, community } = await extractDeviceData(deviceUrl);
    const record = await AirMonitoringData.create({
      deviceUid,
      deviceUrl,
      latitude,
      longitude,
      location,
      community,
      date: new Date(),
    });
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    if ((err as { code?: number }).code === 11000) {
      return NextResponse.json({ error: `Device "${deviceUid}" already exists.` }, { status: 409 });
    }
    const message = err instanceof Error ? err.message : "Failed to fetch device data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
