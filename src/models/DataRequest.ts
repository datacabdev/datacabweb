import mongoose, { Schema, Document } from "mongoose";

export interface IDataRequest extends Document {
  name: string;
  email: string;
  organization: string;
  message: string;
  status: "pending" | "reviewed" | "resolved";
}

const DataRequestSchema = new Schema<IDataRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    organization: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["pending", "reviewed", "resolved"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.models.DataRequest || mongoose.model<IDataRequest>("DataRequest", DataRequestSchema);
