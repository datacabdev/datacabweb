import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/mongodb";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
}

async function getContact() {
  try {
    await connectToDatabase();
    const WebsiteContent = (await import("@/models/WebsiteContent")).default;
    const [phone, email, address] = await Promise.all([
      WebsiteContent.findOne({ title: /^phone$/i }).lean() as Promise<{ content: string } | null>,
      WebsiteContent.findOne({ title: /^email$/i }).lean() as Promise<{ content: string } | null>,
      WebsiteContent.findOne({ title: /^address$/i }).lean() as Promise<{ content: string } | null>,
    ]);
    return {
      phone: phone ? stripHtml(phone.content) : "07081036103",
      email: email ? stripHtml(email.content) : "support@maji.org.ng",
      address: address ? stripHtml(address.content) : "No 12, Ohaeto Street, Dline, Port Harcourt, Rivers State",
    };
  } catch {
    return {
      phone: "07081036103",
      email: "support@maji.org.ng",
      address: "No 12, Ohaeto Street, Dline, Port Harcourt, Rivers State",
    };
  }
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Multimedia", href: "/multimedia" },
  { label: "News", href: "/news" },
  { label: "Air Quality", href: "/air-quality" },
];

export default async function Footer() {
  const { phone, email, address } = await getContact();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="flex items-start gap-3">
            <Image src="/datacablogo.svg" alt="Datacab" width={48} height={48} className="mt-1" />
            <span className="font-bold text-xl tracking-widest text-gray-900 mt-3">DATACAB</span>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-blue-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Media Awareness and Justice Initiative (MAJI)</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="mt-0.5">📧</span>
                <div>
                  <p className="font-medium text-gray-700">Email</p>
                  <a href={`mailto:${email}`} className="hover:text-blue-600">{email}</a>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5">📍</span>
                <div>
                  <p className="font-medium text-gray-700">Address</p>
                  <p>{address}</p>
                </div>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5">📞</span>
                <div>
                  <p className="font-medium text-gray-700">Phone</p>
                  <a href={`tel:${phone}`} className="hover:text-blue-600">{phone}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-500">© {year} Datacab. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {[
              { Icon: FacebookIcon, href: "#" },
              { Icon: LinkedInIcon, href: "#" },
              { Icon: XIcon, href: "#" },
              { Icon: YoutubeIcon, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-600 transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
