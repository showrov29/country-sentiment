import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import askGemini from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    const body = await req.json();
    const tweets = Array.isArray(body?.tweets) ? body.tweets : [];
    
    // Direct call to Gemini for the advanced analysis structure
    // We pass the raw tweets/comments array
    const resultString = await askGemini(tweets);
    
    // Parse the JSON string returned by Gemini
    let result;
    try {
        const start = resultString.indexOf('{');
        const end = resultString.lastIndexOf('}') + 1;
        result = JSON.parse(resultString.slice(start, end));
    } catch (parseError) {
        console.error("JSON Parse Error", parseError);
        // Fallback or re-throw
        result = { error: "Failed to parse AI response" };
    }

    try {
      const database = await db();
      if (database) {
        await database.collection('analyses').insertOne({ result, createdAt: new Date() });
      }
    } catch (e) {
        console.log("DB Insert failed", e);
    }

    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e?.message || 'Analyze failed' }, { status: 500 });
  }
}
