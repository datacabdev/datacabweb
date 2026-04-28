import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const deviceUrl = searchParams.get("deviceUrl");

  if (!deviceUrl) {
    return NextResponse.json({ error: "deviceUrl required" }, { status: 400 });
  }

  try {
    const res = await fetch(deviceUrl, { next: { revalidate: 60 } });
    if (!res.ok) return NextResponse.json([], { status: 200 });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
