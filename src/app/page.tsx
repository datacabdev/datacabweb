import { connectToDatabase } from "@/lib/mongodb";
import { defaultSettings } from "@/lib/defaults";
import HeroSection from "@/components/sections/HeroSection";
import WhatWeDoSection from "@/components/sections/WhatWeDoSection";
import DataCastingSection from "@/components/sections/DataCastingSection";
import MapSection from "@/components/sections/MapSection";
import MAJISection from "@/components/sections/MAJISection";
import AppBannerSection from "@/components/sections/AppBannerSection";
import NewsSection from "@/components/sections/NewsSection";
import MultimediaSection from "@/components/sections/MultimediaSection";
import DonorsSection from "@/components/sections/DonorsSection";
import RequestDataSection from "@/components/sections/RequestDataSection";

async function getData() {
  try {
    await connectToDatabase();

    const [SiteSettings, Multimedia, WebsiteContent] = await Promise.all([
      import("@/models/SiteSettings").then((m) => m.default),
      import("@/models/Multimedia").then((m) => m.default),
      import("@/models/WebsiteContent").then((m) => m.default),
    ]);

    const [savedSettings, multimedia, multimediaContent] = await Promise.all([
      SiteSettings.find().lean(),
      Multimedia.aggregate([
        { $match: { published: true } },
        { $addFields: { _s: { $ifNull: ["$order", 9999] } } },
        { $sort: { _s: 1, createdAt: -1 } },
        { $limit: 8 },
        { $project: { _s: 0 } },
      ]),
      WebsiteContent.findOne({ title: /^multimedia$/i }).lean() as Promise<{ content: string } | null>,
    ]);

    const settings = { ...defaultSettings } as Record<string, unknown>;
    for (const s of savedSettings as Array<{ key: string; value: unknown }>) {
      settings[s.key] = s.value;
    }

    const multimediaSubtitle = multimediaContent
      ? multimediaContent.content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim()
      : "";

    return { settings, multimedia, multimediaSubtitle };
  } catch {
    return {
      settings: defaultSettings as Record<string, unknown>,
      multimedia: [],
      multimediaSubtitle: "",
    };
  }
}

export const revalidate = 60;

export default async function HomePage() {
  const { settings: s, multimedia, multimediaSubtitle } = await getData();

  return (
    <main>
      <HeroSection data={s.hero as typeof defaultSettings.hero} />
      <DataCastingSection />
      <WhatWeDoSection />
      <MapSection data={s.mapHighlights as typeof defaultSettings.mapHighlights} />
      <MAJISection data={s.maji as typeof defaultSettings.maji} />
      <AppBannerSection data={s.appBanner as typeof defaultSettings.appBanner} />
      <NewsSection />
      <MultimediaSection items={multimedia as Parameters<typeof MultimediaSection>[0]["items"]} subtitle={multimediaSubtitle} />
      <DonorsSection />
      <RequestDataSection />
    </main>
  );
}
