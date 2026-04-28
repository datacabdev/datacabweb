import mongoose, { Schema, Document } from "mongoose";

export interface IMultimedia extends Document {
  title: string;
  type: "image" | "video";
  url: string;
  thumbnail: string;
  published: boolean;
  order: number;
}

const MultimediaSchema = new Schema<IMultimedia>(
  {
    title: { type: String, default: "" },
    type: { type: String, enum: ["image", "video"], default: "image" },
    url: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Multimedia || mongoose.model<IMultimedia>("Multimedia", MultimediaSchema);
