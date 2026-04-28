"use client";
import { useState, useEffect, useCallback } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

interface AirReading {
  aqi: number;
  pm01_0: number;
  pm02_5: number;
  pm10_0: number;
  temperature: number;
  pressure: number;
  voltage: number;
  humidity: number;
}

interface Device {
  _id: string;
  location: string;
  community: string;
  latitude: number;
  longitude: number;
  deviceUid: string;
  deviceUrl: string;
}

const containerStyle = { width: "100%", height: "100%" };
const center = { lat: 4.8156, lng: 7.0498 };

export default function MapComponent() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [selected, setSelected] = useState<Device | null>(null);
  const [reading, setReading] = useState<AirReading | null>(null);
  const [loadingReading, setLoadingReading] = useState(false);

  useEffect(() => {
    fetch("/api/air-data")
      .then((r) => r.json())
      .then((data) => setDevices(Array.isArray(data) ? data : []))
      .catch(() => setDevices([]));
  }, []);

  const handleMarkerClick = useCallback(async (device: Device) => {
    setSelected(device);
    setReading(null);
    if (!device.deviceUrl) return;
    setLoadingReading(true);
    try {
      const res = await fetch(`/api/air-reading?deviceUrl=${encodeURIComponent(device.deviceUrl)}`);
      const data = await res.json();
      const readings: AirReading[] = Array.isArray(data) ? data : [];
      setReading(readings.length > 0 ? readings[readings.length - 1] : null);
    } catch {
      setReading(null);
    } finally {
      setLoadingReading(false);
    }
  }, []);

  return (
    <div className="h-[300px] sm:h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden shadow-sm">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={7}>
          {devices.map((device) => (
            <Marker
              key={device._id}
              position={{ lat: device.latitude, lng: device.longitude }}
              onClick={() => handleMarkerClick(device)}
              icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            />
          ))}

          {selected && (
            <InfoWindow
              position={{ lat: selected.latitude, lng: selected.longitude }}
              onCloseClick={() => { setSelected(null); setReading(null); }}
            >
              <div className="bg-blue-600 text-white p-3 rounded-lg w-44 text-sm space-y-1">
                <p className="font-bold text-base leading-tight">{selected.location}</p>
                {selected.community && (
                  <p className="text-blue-100 text-xs">{selected.community}</p>
                )}
                {loadingReading ? (
                  <p className="text-blue-200 text-xs pt-1">Loading readings…</p>
                ) : reading ? (
                  <>
                    <p>AQI: <span className="font-semibold">{reading.aqi ?? "—"}</span></p>
                    <p>PM1.0: {reading.pm01_0 ?? "—"}</p>
                    <p>PM2.5: {reading.pm02_5 ?? "—"}</p>
                    <p>PM10: {reading.pm10_0 ?? "—"}</p>
                    <p>Temp: {reading.temperature != null ? `${reading.temperature}°C` : "—"}</p>
                    <p>Humidity: {reading.humidity != null ? `${reading.humidity}%` : "—"}</p>
                    <p>Pressure: {reading.pressure ?? "—"}</p>
                  </>
                ) : (
                  <p className="text-blue-200 text-xs pt-1">No readings available</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
