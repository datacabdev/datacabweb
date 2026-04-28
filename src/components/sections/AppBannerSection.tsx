import Image from "next/image";

interface AppBannerData {
  heading: string;
  subtitle: string;
  appStoreUrl: string;
  playStoreUrl: string;
}

export default function AppBannerSection({ data }: { data: AppBannerData }) {
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-600 rounded-2xl px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-10 overflow-hidden">
          <div className="text-white max-w-xl">
            <h2 className="text-2xl sm:text-3xl font-black leading-snug mb-3">{data.heading}</h2>
            <p className="text-blue-100 text-sm mb-8">{data.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <a
                href={data.appStoreUrl}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Get It on AppStore
              </a>
              <a
                href={data.playStoreUrl}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-3 rounded-lg transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M3 20.5v-17c0-.83.94-1.3 1.6-.8l14 8.5c.6.37.6 1.23 0 1.6l-14 8.5c-.66.5-1.6.03-1.6-.8z" />
                </svg>
                Download On Playstore
              </a>
            </div>
          </div>

          <div className="flex-shrink-0 flex items-end justify-center">
            <div className="relative w-48 h-72 sm:w-56 sm:h-80 lg:w-64 lg:h-96">
              <Image
                src="/dataApp.png"
                alt="Datacab mobile app"
                fill
                className="object-contain object-bottom drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
