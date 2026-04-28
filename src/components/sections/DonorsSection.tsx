import Image from "next/image";

const donorsList = [
  { name: "United Nations Democracy Fund", icon: "/un12.png" },
  { name: "Association For Progressive Communications", icon: "/dn1.jpg" },
  { name: "Collaborative Media Advocacy Platform", icon: "/dn2.jpg" },
  { name: "Environmental Rights Action", icon: "/dn3.png" },
  { name: "French Embassy in Nigeria", icon: "/dn4.jpg" },
  { name: "Global Green Grants Funds", icon: "/dn5.jpg" },
  { name: "Home Of Mother Earth Foundation", icon: "/dn6.jpg" },
  { name: "Leighday and Co Solicitors UK", icon: "/dn7.jpg" },
  { name: "Lush Charity", icon: "/dn8.jpg" },
  { name: "Meliore Foundation", icon: "/dn9.jpg" },
  { name: "Mozilla Foundation", icon: "/dn10.webp" },
  { name: "National Democratic Institute", icon: "/dn11.png" },
  { name: "National Endowment for Democracy", icon: "/dn12.png" },
  { name: "Open Culture Foundation", icon: "/dn13.png" },
  { name: "New Media Advocacy Project", icon: "/dn14.png" },
  { name: "Stakeholder Democracy Network", icon: "/dn15.png" },
  { name: "United States Consulate General Lagos", icon: "/dn16.png" },
];

export default function DonorsSection() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Our Donors</h2>
        <div className="flex flex-wrap justify-center items-start gap-8 lg:gap-10">
          {donorsList.map((donor, i) => (
            <div key={i} className="flex flex-col items-center gap-3 w-[140px] sm:w-[160px] lg:w-[180px]">
              <div className="relative w-full h-[50px]">
                <Image
                  src={donor.icon}
                  alt={donor.name}
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs text-center text-gray-700 font-semibold leading-snug">{donor.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
