// lib/db.js — MongoDB client
// ==============================
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is required');

let client; let clientPromise;
if (!global._mongoClientPromise) {
  client = new MongoClient(uri, { ignoreUndefined: true });
  global._mongoClientPromise = client.connect();
}
clientPromise = global._mongoClientPromise;

export async function db() {
  const c = await clientPromise;
  return c.db();
}