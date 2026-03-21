import mongoose from 'mongoose';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = (global as any).mongoose || { conn: null, promise: null };
(global as any).mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
