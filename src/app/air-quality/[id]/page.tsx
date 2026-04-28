import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import DeviceIframe from "./DeviceIframe";

async function getDevice(id: string) {
  try {
    await connectToDatabase();
    const AirMonitoringData = (await import("@/models/AirMonitoringData")).default;
    const device = await AirMonitoringData.findById(id).lean() as {
      _id: unknown;
      deviceUrl: string;
      community: string;
      location: string;
    } | null;
    return device;
  } catch {
    return null;
  }
}

export default async function DevicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const device = await getDevice(id);

  if (!device) notFound();

  return (
    <DeviceIframe
      src={device.deviceUrl}
      title={device.community || "Air Quality Device"}
    />
  );
}
