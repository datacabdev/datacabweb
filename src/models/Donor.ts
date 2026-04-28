import mongoose, { Schema, Document } from "mongoose";

export interface IDonor extends Document {
  name: string;
  logo: string;
  order: number;
  published: boolean;
}

const DonorSchema = new Schema<IDonor>(
  {
    name: { type: String, required: true },
    logo: { type: String, default: "" },
    order: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Donor || mongoose.model<IDonor>("Donor", DonorSchema);
