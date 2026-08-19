import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
// @ts-ignore
const cached: Cache = global.mongooseCache || { conn: null, promise: null };
// @ts-ignore
global.mongooseCache = cached;

export async function connectDB() {
  // Validate lazily so importing this module during `next build` never crashes.
  if (!MONGODB_URI) throw new Error("Missing MONGODB_URI");
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  cached.conn = await cached.promise;
  return cached.conn;
}

