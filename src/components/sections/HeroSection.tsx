import Link from "next/link";

interface HeroData {
  title: string;
  subtitle: string;
  ctaText: string;
}

export default function HeroSection({ data }: { data: HeroData }) {
  return (
    <section className="relative bg-[#eef0ff] overflow-hidden py-20 px-4 sm:px-6 lg:px-8 text-center">
      {/* Circuit board SVG pattern */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M10 40 H30 M50 40 H70 M40 10 V30 M40 50 V70" stroke="#5b6ef5" strokeWidth="1" fill="none" />
              <circle cx="40" cy="40" r="3" fill="#5b6ef5" />
              <circle cx="10" cy="40" r="2" fill="#5b6ef5" />
              <circle cx="70" cy="40" r="2" fill="#5b6ef5" />
              <circle cx="40" cy="10" r="2" fill="#5b6ef5" />
              <circle cx="40" cy="70" r="2" fill="#5b6ef5" />
              <path d="M30 40 Q35 30 40 30" stroke="#5b6ef5" strokeWidth="1" fill="none" />
              <path d="M40 30 Q45 30 50 40" stroke="#5b6ef5" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <h1 className="text-[24px] md:text-[32px] lg:text-[48px] font-[700] lg:leading-[57px] text-gray-900 uppercase mb-6">
          {data.title}
        </h1>
        <p className="text-[16px] lg:text-[18px] font-[500] lg:leading-[28px] text-gray-700 max-w-3xl mx-auto mb-8">
          {data.subtitle}
        </p>
        <Link
          href="/air-quality"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md transition-colors"
        >
          {data.ctaText}
        </Link>
      </div>
    </section>
  );
}
