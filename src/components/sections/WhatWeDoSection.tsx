"use client";
import { useEffect, useState } from "react";
import { BarChart2, Thermometer, Globe, PieChart, MapPin } from "lucide-react";

const icons = [BarChart2, Thermometer, Globe, PieChart, MapPin];

const services = [
  "Real time Air Quality Reporting",
  "Presentation of P.M 1.0, 2.5, 10 levels, humidity and temperature data.",
  "Analysis and Infographic presentation of collected environmental data.",
  "Collected Data Analysis",
  "Air Quality Index (AQI) MAP.",
];

function extractContent(html: string): { h2Text: string; pTexts: string[] } {
  const h2Match = html.match(/<h2[^>]*>(.*?)<\/h2>/);
  const h2Text = h2Match ? h2Match[1].replace(/<[^>]+>/g, "") : "";

  const pMatches = html.match(/<p[^>]*>(.*?)<\/p>/g);
  const pTexts = pMatches
    ? pMatches.map((p) => p.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim()).filter(Boolean)
    : [];

  return { h2Text, pTexts };
}

export default function WhatWeDoSection() {
  const [h2Text, setH2Text] = useState("");
  const [pTexts, setPTexts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content?title=What We Do")
      .then((r) => r.json())
      .then((d) => {
        if (d?.content) {
          const extracted = extractContent(d.content);
          setH2Text(extracted.h2Text);
          setPTexts(extracted.pTexts);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="about" className="bg-white py-10 lg:py-[40px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-10 lg:gap-[80px]">

        {/* Left: content from admin */}
        <div className="w-full lg:w-[50%] flex flex-col gap-2">
          {loading ? (
            <div className="space-y-3">
              <div className="h-8 bg-gray-100 animate-pulse rounded w-1/2" />
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
              <div className="text-[16px] lg:text-[18px] font-[500] lg:leading-[28px] flex flex-col gap-2">
                {pTexts.map((text, i) => (
                  <p key={i}>{text}</p>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-400">Content not available</p>
          )}
        </div>

        {/* Right: services list */}
        <div className="w-full lg:w-[50%]">
          <div className="flex flex-col gap-[15px]">
            {services.map((service, i) => {
              const Icon = icons[i % icons.length];
              return (
                <div key={i} className="flex gap-6 items-center">
                  <div className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <p className="text-[16px] lg:text-[18px] font-[500] lg:leading-[28px] text-gray-700">
                    {service}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
