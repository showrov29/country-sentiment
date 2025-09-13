import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { analyzeTweetsGemini } from '@/lib/analyzer';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const tweets = Array.isArray(body?.tweets) ? body.tweets : [];
    const result = await analyzeTweetsGemini(tweets);

    try {
      const database = await db();
      await database.collection('analyses').insertOne({ result, createdAt: new Date() });
    } catch {}

    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || 'Analyze failed' }, { status: 500 });
  }
}