"use client";
import { useRef, useState } from "react";
import { CloudUpload, X } from "lucide-react";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploadField({ value, onChange, label = "Image" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file: File) => {
    if (file.size > 30 * 1024 * 1024) { setError("File must be less than 30MB"); return; }
    setError(""); setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else setError("Upload failed");
    } catch {
      setError("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}

      {value ? (
        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <Image src={value} alt="Uploaded" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
          >
            <X size={14} className="text-red-500" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center gap-2 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <CloudUpload size={32} className="text-gray-400" />
              <p className="text-sm text-gray-500">
                Drop your image file here{" "}
                <span className="text-blue-600 underline">browse here</span>
              </p>
              <p className="text-xs text-gray-400">Maximum upload file size less than 30mb</p>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
          />
        </div>
      )}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
