import mongoose, { Schema, Document } from "mongoose";

export interface IWebsiteContent extends Document {
  title: string;
  content: string;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.WebsiteContent || mongoose.model<IWebsiteContent>("WebsiteContent", WebsiteContentSchema);
