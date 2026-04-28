import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<NextResponse>((resolve) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto", folder: "datacab" }, (error, result) => {
        if (error || !result) {
          resolve(NextResponse.json({ error: "Upload failed" }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ url: result.secure_url, publicId: result.public_id }));
        }
      })
      .end(buffer);
  });
}
