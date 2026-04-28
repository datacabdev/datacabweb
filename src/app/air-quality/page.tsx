"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import MapComponent from "@/components/MapComponent";
import DonorsSection from "@/components/sections/DonorsSection";

interface Device {
  _id: string;
  location: string;
  community: string;
  latitude: number;
  longitude: number;
  deviceUid: string;
  deviceUrl: string;
}

const DATA_PER_PAGE = 9;

function AQCard({ item }: { item: Device }) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleClick = () => {
    if (navigating) return;
    setNavigating(true);
    router.push(`/air-quality/${item._id}`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={navigating}
      className="relative bg-white rounded-[20px] border border-gray-100 px-[10px] py-[13px] lg:px-[24px] lg:py-[12px] flex items-center gap-4 w-full text-left transition-shadow disabled:opacity-70"
      style={{ boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)" }}
    >
      {navigating && (
        <div className="absolute inset-0 bg-white/70 rounded-[20px] flex items-center justify-center z-10">
          <div className="w-6 h-6 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <div className="shrink-0">
        <Image src="/iconn.png" alt="device" width={70} height={70} className="rounded-[14px] object-cover" />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] text-gray-500 font-[400] truncate">{item.location}</p>
        <p className="text-[16px] font-[700] text-gray-900 line-clamp-2 leading-snug mt-0.5">
          {item.community}
        </p>
      </div>
    </button>
  );
}

export default function AirQualityPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [filtered, setFiltered] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Air Reading");
  const [pageDesc, setPageDesc] = useState("");
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterLocation, setFilterLocation] = useState("");
  const [filterCommunity, setFilterCommunity] = useState("");
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    Promise.all([
      fetch("/api/air-data").then((r) => r.json()),
      fetch("/api/content?title=Air Reading").then((r) => r.json()),
    ]).then(([devicesData, contentData]) => {
      const list = Array.isArray(devicesData) ? devicesData : [];
      setDevices(list);
      setFiltered(list);
      if (contentData?.title) setPageTitle(contentData.title);
      if (contentData?.content) {
        setPageDesc(contentData.content.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim());
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Search
  useEffect(() => {
    if (!search) {
      setFiltered(devices);
      setCurrentPage(1);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      devices.filter(
        (d) =>
          d.location?.toLowerCase().includes(q) ||
          d.community?.toLowerCase().includes(q)
      )
    );
    setCurrentPage(1);
  }, [search, devices]);

  const locationOptions = Array.from(new Set(devices.map((d) => d.location).filter(Boolean)));
  const communityOptions = Array.from(new Set(devices.map((d) => d.community).filter(Boolean)));

  const applyFilter = () => {
    const result = devices.filter((d) => {
      const locMatch = !filterLocation || d.location === filterLocation;
      const comMatch = !filterCommunity || d.community === filterCommunity;
      return locMatch && comMatch;
    });
    setFiltered(result);
    setCurrentPage(1);
    setShowFilter(false);
    setIsFilterActive(true);
  };

  const clearFilter = () => {
    setFilterLocation("");
    setFilterCommunity("");
    setFiltered(devices);
    setIsFilterActive(false);
    setShowFilter(false);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filtered.length / DATA_PER_PAGE);
  const currentItems = filtered.slice((currentPage - 1) * DATA_PER_PAGE, currentPage * DATA_PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F5F6FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Title & description from admin content */}
        <h1 className="font-[700] text-[32px] text-gray-900">{pageTitle}</h1>
        {pageDesc && (
          <p className="my-4 text-[#757575] text-[18px] font-[500] md:w-[50%]">{pageDesc}</p>
        )}

        {/* Search + Filter */}
        <div className="flex items-center gap-4 mt-4">
          <div className="relative flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 h-[46px] w-full sm:w-[323px]">
            <Search size={17} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for data..."
              className="text-sm outline-none w-full bg-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3">
                <X size={16} className="text-red-400" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`h-[46px] px-4 flex items-center gap-2 border rounded-lg text-sm font-medium transition-colors ${
              showFilter || isFilterActive
                ? "border-blue-500 text-blue-600 bg-white"
                : "border-gray-200 text-gray-600 bg-white"
            }`}
          >
            <Image src="/funel.svg" alt="filter" width={17} height={17} />
            Filter
          </button>
        </div>

        {/* Filter dropdown */}
        {showFilter && (
          <div className="relative mt-2 z-50">
            <div className="bg-white shadow-lg rounded-xl p-6 w-full">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select location</option>
                    {locationOptions.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="md:w-1/4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                  <select
                    value={filterCommunity}
                    onChange={(e) => setFilterCommunity(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select community</option>
                    {communityOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4 flex justify-end gap-3">
                <button
                  onClick={clearFilter}
                  className="w-[140px] h-[48px] border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={applyFilter}
                  disabled={!filterLocation && !filterCommunity}
                  className="w-[140px] h-[48px] bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-semibold"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cards grid */}
        {loading ? (
          <div className="my-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[19px]">
            {Array.from({ length: DATA_PER_PAGE }).map((_, i) => (
              <div key={i} className="w-full h-[90px] bg-gray-200 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          <div className="my-10 grid grid-cols-1 gap-y-[19px] md:gap-[19px] md:grid-cols-2 xl:grid-cols-3">
            {currentItems.map((item) => (
              <AQCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-[14px] font-bold text-gray-500 my-10">Not found</p>
        )}

        {/* Pagination */}
        {!loading && filtered.length > DATA_PER_PAGE && (
          <div className="flex justify-end items-center gap-2 mt-2 mb-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 bg-white"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm transition-colors ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center disabled:opacity-40 hover:bg-gray-50 bg-white"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Map section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-16 max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 uppercase text-center mb-2">MAP HIGHLIGHTS</h2>
        <p className="text-center text-gray-500 text-sm mb-8">
          Location highlight of where DataCab has collected data and set up devices for data collection.
        </p>
        <MapComponent />
      </div>

      {/* Donors */}
      <DonorsSection />
    </div>
  );
}
