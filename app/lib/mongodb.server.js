import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Mongo URI exists:", !!MONGODB_URI);
console.log("Mongo URI:", MONGODB_URI?.replace(/\/\/.*@/, "//****@"));

if (!MONGODB_URI) {
  throw new Error("MongoDB URI not found");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
