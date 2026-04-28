import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import SiteSettings from "@/models/SiteSettings";

const defaults = {
  hero: {
    title: "STRENGTHENING ENVIRONMENTAL ADVOCACY THROUGH DATA SIMPLIFICATION FOR EVIDENCE BASED ACTION",
    subtitle:
      "The Media Awareness and Justice Initiative through the DATACAB portal collects, analyzes and simplifies real time environmental data, presenting them in clear infographic forms and formats. Our overall aim is to foster citizen and stakeholder participation in environmental monitoring, reporting and engagements using evidence-based data to drive informed advocacy, help key stakeholders identify targeted interventions and informative policy development across Nigeria",
    ctaText: "Check Air Quality",
  },
  whatWeDo: {
    heading: "WHAT WE DO",
    description:
      "Using solar based environmental monitoring devices located in rural and urban communities, we collect real time environmental data, and transform this large and complex environmental data into simply infographic, data visualisation and geo-mapping formats with a view to support actionable insights. Our goal is to empower communities and other relevant stakeholders with the information they need to advocate for sustainable environmental solutions and the development of effective environmental policies across Nigeria.",
    features: [
      "Real time Air Quality Reporting",
      "Presentation of P.M 1.0, 2.5, 10 levels, humidity and temperature data.",
      "Analysis and Infographic presentation of collected environmental data.",
      "Collected Data Analysis",
      "Air Quality Index (AQI) MAP.",
    ],
  },
  dataCasting: {
    heading: "DATA CASTING FOR BIODIVERSITY",
    description:
      "The Data Casting Biodiversity initiative uses Raspberry PI based boards, Low-cost environmental sensors and AI enabled DATA analytics simplification tools to reinforce the use of qualitative and quantitative data for evidence based engagements amongst relevant stakeholders such as civil society organizations, newsrooms, communities, academia and relevant government agencies and stakeholders. Using a simplified data analysis platform, DATACAB targets the total reinvigoration of grassroot participation in environmental protection and climate change adaptation. The DATACAB platform is optimised for mobile and desktop based devices. The portal provides a simplified user interface that support the collection, analysis and visualisation of real time environmental data. This is to facilitate evidence based engagements amongst stakeholders, support qualitative environmental insights and advance the campaign for Inclusive environmental policies that protect people and the planet.",
    stats: { statesReached: 3, communitiesReached: 18, devicesDeployed: 18 },
    chartData: [
      { month: "Jan", value: 150 },
      { month: "Feb", value: 200 },
      { month: "Mar", value: 300 },
      { month: "Apr", value: 400 },
      { month: "May", value: 500 },
      { month: "Jun", value: 600 },
      { month: "Jul", value: 400 },
      { month: "Aug", value: 400 },
      { month: "Sep", value: 100 },
      { month: "Oct", value: 100 },
      { month: "Nov", value: 500 },
    ],
  },
  mapHighlights: {
    heading: "MAP HIGHLIGHTS",
    subtitle: "Location highlight of where DataCab has collected data and set up devices for data collection.",
    pins: [
      { lat: 4.8156, lng: 7.0498, label: "Port Harcourt 1" },
      { lat: 4.8241, lng: 7.0362, label: "Port Harcourt 2" },
      { lat: 4.8093, lng: 7.0612, label: "Port Harcourt 3" },
      { lat: 4.7988, lng: 7.0445, label: "Eleme" },
      { lat: 4.8315, lng: 7.0189, label: "Obio Akpor" },
      { lat: 4.7756, lng: 7.0823, label: "Okrika" },
    ],
  },
  maji: {
    heading: "MEDIA AWARENESS AND JUSTICE INITIATIVE (MAJI)",
    paragraphs: [
      "The Media Awareness and Justice Initiative (MAJI) is an innovative, youth led non-governmental organization that builds the capacity of young people and women from marginalised communities to use innovative ICT tools, alternative media platforms and collaborative strategies to protect their environment, support gender equality, while promoting human rights.",
      "Our mission is to work with groups and social movements working together for social, economic, cultural and environmental justice by helping them use media and communication technologies to inform, organise, mobilise and further their struggles to create a better world.",
      "We use participatory strategies to create awareness, sensitise people and increase community voice. In collaboration with our target groups, we create platforms for sustained participatory interaction among relevant stakeholders.",
    ],
    visitSiteUrl: "https://maji.org.ng",
    images: [],
  },
  appBanner: {
    heading: "Experience seamless access to reliable data solutions at your fingertips.",
    subtitle: "Don't miss out on real-time updates and streamlined communication – download the app today and stay ahead in the digital world!",
    appStoreUrl: "#",
    playStoreUrl: "#",
  },
};

export async function GET(req: Request) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key) {
    const setting = await SiteSettings.findOne({ key }).lean();
    const value = setting ? (setting as { value: unknown }).value : defaults[key as keyof typeof defaults];
    return NextResponse.json({ key, value });
  }

  const all: Record<string, unknown> = { ...defaults };
  const saved = await SiteSettings.find().lean();
  for (const s of saved) {
    all[(s as { key: string }).key] = (s as { key: string; value: unknown }).value;
  }
  return NextResponse.json(all);
}

export async function PUT(req: Request) {
  await connectToDatabase();
  const { key, value } = await req.json();
  const setting = await SiteSettings.findOneAndUpdate({ key }, { value }, { upsert: true, new: true });
  return NextResponse.json(setting);
}
