import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

let migrationRan = false;

async function runOrderMigration() {
  if (migrationRan) return;
  migrationRan = true;
  try {
    const [AirMonitoringData, News, Multimedia] = await Promise.all([
      import("@/models/AirMonitoringData").then((m) => m.default),
      import("@/models/News").then((m) => m.default),
      import("@/models/Multimedia").then((m) => m.default),
    ]);
    await Promise.all([
      AirMonitoringData.updateMany({ order: { $exists: false } }, { $set: { order: 0 } }),
      News.updateMany({ order: { $exists: false } }, { $set: { order: 0 } }),
      Multimedia.updateMany({ order: { $exists: false } }, { $set: { order: 0 } }),
    ]);
  } catch {
    // non-fatal — app continues normally
  }
}

export async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  runOrderMigration();
  return cached.conn;
}
