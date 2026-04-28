"use client";
import dynamic from "next/dynamic";

interface MapSectionData {
  heading: string;
  subtitle: string;
  pins: { lat: number; lng: number; label: string }[];
}

const MapComponent = dynamic(() => import("../MapComponent"), {
  ssr: false,
  loading: () => <div className="h-[300px] sm:h-[400px] md:h-[500px] bg-gray-100 animate-pulse rounded-xl" />,
});

export default function MapSection({ data }: { data: MapSectionData }) {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 uppercase text-center mb-2">{data.heading}</h2>
        <p className="text-center text-gray-500 text-sm mb-8">{data.subtitle}</p>
        <MapComponent />
      </div>
    </section>
  );
}
