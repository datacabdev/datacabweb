export default function DeviceLoading() {
  return (
    <div className="flex flex-col items-center justify-center" style={{ height: "calc(100vh - 64px)" }}>
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
      <p className="text-gray-500 text-sm">Loading device data…</p>
    </div>
  );
}
