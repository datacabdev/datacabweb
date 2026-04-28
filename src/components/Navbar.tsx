"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Multimedia", href: "/multimedia" },
  { label: "News", href: "/news" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/datacablogo.svg" alt="Datacab" width={40} height={40} />
          <span className="font-bold text-sm tracking-widest text-gray-900">DATACAB</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex">
          <Link
            href="/air-quality"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-md transition-colors"
          >
            Check Air Quality
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 space-y-3 pt-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium ${
                pathname === l.href ? "text-blue-600" : "text-gray-700"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/air-quality"
            onClick={() => setOpen(false)}
            className="block bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-md text-center"
          >
            Check Air Quality
          </Link>
        </div>
      )}
    </header>
  );
}
