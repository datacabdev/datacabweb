import mongoose, { Schema, Document } from "mongoose";

export interface INews extends Document {
  title: string;
  content: string;
  image: string;
  date: Date;
  slug: string;
  published: boolean;
  order: number;
}

const NewsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    slug: { type: String, required: true, unique: true },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.News || mongoose.model<INews>("News", NewsSchema);
