"use client";
import { useState } from "react";

interface Props {
  src: string;
  title: string;
}

export default function DeviceIframe({ src, title }: Props) {
  const [loaded, setLoaded] = useState(false);

  // Clip the airnote navbar (≈56px) by pulling the iframe up and hiding overflow
  const AIRNOTE_NAV_HEIGHT = 56;

  return (
    <div className="relative overflow-hidden" style={{ height: `calc(100vh - 64px)` }}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#F5F6FB] z-10">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading device data…</p>
        </div>
      )}
      <iframe
        src={src}
        title={title}
        className="w-full border-0 block"
        style={{
          marginTop: -AIRNOTE_NAV_HEIGHT,
          height: `calc(100vh - 64px + ${AIRNOTE_NAV_HEIGHT}px)`,
        }}
        allow="fullscreen"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}
