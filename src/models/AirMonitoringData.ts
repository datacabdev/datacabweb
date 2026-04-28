import mongoose, { Schema, Document } from "mongoose";

export interface IAirMonitoringData extends Document {
  date: Date;
  location: string;
  community: string;
  longitude: number;
  latitude: number;
  deviceUid: string;
  deviceUrl: string;
  order: number;
}

const AirMonitoringDataSchema = new Schema<IAirMonitoringData>(
  {
    date: { type: Date, default: Date.now },
    location: { type: String, default: "" },
    community: { type: String, default: "" },
    longitude: { type: Number, default: 0 },
    latitude: { type: Number, default: 0 },
    deviceUid: { type: String, required: true, unique: true },
    deviceUrl: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.AirMonitoringData || mongoose.model<IAirMonitoringData>("AirMonitoringData", AirMonitoringDataSchema);
