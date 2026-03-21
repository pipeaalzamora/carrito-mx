import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) throw new Error('MONGODB_URI no está definida');

let cached = (global as any)._mongoose || { conn: null, promise: null };
(global as any)._mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 30000,
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
