"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface MAJIData {
  heading: string;
  paragraphs: string[];
  visitSiteUrl: string;
  images: string[];
}

const carouselImages = [
  { src: "/pic1.jpg", alt: "Air monitoring hardware device" },
  { src: "/pic2.jpg", alt: "Airnote air quality sensor" },
  { src: "/pic3.jpg", alt: "Field worker checking water infrastructure" },
  { src: "/pic4.jpg", alt: "Gas flaring in the Niger Delta" },
  { src: "/pic5.jpg", alt: "Oil pipeline fire with black smoke" },
  { src: "/pic6.jpg", alt: "Field worker mounting air sensor" },
];

export default function MAJISection({ data }: { data: MAJIData }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % carouselImages.length);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + carouselImages.length) % carouselImages.length);
  const next = () => setCurrent((c) => (c + 1) % carouselImages.length);

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase mb-6">{data.heading}</h2>
          <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
            {data.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <Link
            href={data.visitSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-md transition-colors"
          >
            Visit Site
          </Link>
        </div>

        <div className="relative">
          <div className="relative w-full overflow-hidden rounded-xl shadow-lg bg-gray-100">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {carouselImages.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-full aspect-[4/3] relative">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:bg-gray-50"
          >
            <ChevronRight size={18} />
          </button>

          <div className="flex justify-center gap-1.5 mt-3">
            {carouselImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-blue-600" : "bg-gray-300"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
