"use client";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Device {
  _id: string;
  location: string;
}

const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  datasets: [
    {
      label: "Data Reach",
      data: [100, 200, 300, 400, 500, 600, 400, 300, 200, 100, 300, 500],
      backgroundColor: "#4165EB",
      borderRadius: 10,
      barThickness: 10,
    },
  ],
};

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: { display: true, text: "Air Monitoring Activity" },
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      min: 0,
      max: 600,
      ticks: { stepSize: 100 },
      grid: { display: true, color: "rgba(0,0,0,0.1)" },
    },
  },
};

function extractContent(html: string): { h2Text: string; pTexts: string[] } {
  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/);
  const h2Text = h2Match ? h2Match[1].replace(/<[^>]+>/g, "") : "";

  const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/g);
  const pTexts = pMatches
    ? pMatches.map((p) => p.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()).filter(Boolean)
    : [];

  return { h2Text, pTexts };
}

export default function DataCastingSection() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(true);
  const [h2Text, setH2Text] = useState("");
  const [pTexts, setPTexts] = useState<string[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);

  useEffect(() => {
    fetch("/api/air-data")
      .then((r) => r.json())
      .then((d) => { setDevices(Array.isArray(d) ? d : []); setLoadingDevices(false); })
      .catch(() => setLoadingDevices(false));

    fetch("/api/content?title=About Us")
      .then((r) => r.json())
      .then((d) => {
        if (d?.content) {
          const extracted = extractContent(d.content);
          setH2Text(extracted.h2Text);
          setPTexts(extracted.pTexts);
        }
        setLoadingContent(false);
      })
      .catch(() => setLoadingContent(false));
  }, []);

  const uniqueStates = new Set(
    devices.map((d) => {
      const parts = d.location?.trim().split(" ") ?? [];
      return parts.length >= 2 ? parts.slice(-2).join(" ") : d.location;
    })
  ).size;

  const statesReached = devices.length > 0 ? uniqueStates : 0;
  const communitiesReached = devices.length;
  const devicesDeployed = devices.length;

  return (
    <section id="about" className="bg-white py-10 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row justify-between items-center gap-[60px] lg:gap-[80px]">

        {/* Left: content from admin */}
        <div className="w-full lg:w-[50%] flex flex-col gap-2">
          {loadingContent ? (
            <div className="space-y-3">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-3/4" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-full" />
              <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6" />
            </div>
          ) : h2Text || pTexts.length > 0 ? (
            <>
              {h2Text && (
                <h2 className="text-[20px] lg:text-[32px] lg:leading-[38px] font-bold uppercase">
                  {h2Text}
                </h2>
              )}
              <div className="text-[16px] lg:text-[18px] font-medium lg:leading-[28px] flex flex-col gap-2">
                {pTexts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Content not available</p>
          )}
        </div>

        {/* Right: chart + bubbles */}
        <div className="w-full lg:w-[50%] flex justify-center">
          <div className="relative w-full max-w-[550px]">
            {/* Chart card */}
            <div className="flex justify-center items-center w-full h-[300px] sm:h-[350px] bg-white shadow-[4px_8px_20px_5px_rgba(65,101,235,0.5)] rounded-xl relative px-6 sm:px-8">
              <Bar data={chartData} options={chartOptions} />
            </div>

            {/* Bubble: States Reached */}
            <div className="absolute bottom-[54px] lg:bottom-20 -right-[20px] lg:-right-[70px] w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full bg-blue-600 shadow-lg flex flex-col items-center justify-center text-white z-30">
              <span className="text-[10px] lg:text-[20px] font-bold leading-none">
                {loadingDevices ? "…" : statesReached}
              </span>
              <span className="text-[10px] lg:text-[12px] text-center leading-tight">States</span>
              <span className="text-[10px] lg:text-[12px] text-center leading-tight">Reached</span>
            </div>

            {/* Bubble: Communities Reached */}
            <div className="absolute -bottom-10 lg:-bottom-20 -right-[20px] lg:-right-[40px] w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] rounded-full bg-blue-600 shadow-lg flex flex-col items-center justify-center text-white z-20">
              <span className="text-[12px] lg:text-[24px] font-bold leading-none">
                {loadingDevices ? "…" : communitiesReached}
              </span>
              <span className="text-[10px] lg:text-[12px] text-center leading-tight">Communities</span>
              <span className="text-[10px] lg:text-[12px] text-center leading-tight">Reached</span>
            </div>

            {/* Bubble: Devices Deployed */}
            <div className="absolute -bottom-20 lg:-bottom-40 right-[60px] w-[100px] h-[100px] lg:w-[140px] lg:h-[140px] rounded-full bg-blue-600 shadow-lg flex flex-col items-center justify-center text-white z-10">
              <span className="text-[16px] lg:text-[32px] font-bold leading-none">
                {loadingDevices ? "…" : devicesDeployed}
              </span>
              <span className="text-[10px] lg:text-[12px] text-center leading-tight">Devices</span>
              <span className="text-[10px] lg:text-[12px] text-center leading-tight">Deployed</span>
            </div>

            {/* Spacer for bottom bubbles */}
            <div className="h-28 lg:h-44" />
          </div>
        </div>
      </div>
    </section>
  );
}
