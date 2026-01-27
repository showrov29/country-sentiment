import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { askGemini, generateSyntheticComments } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const encoder = new TextEncoder();

  // Create a streaming response
  const stream = new ReadableStream({
    async start(controller) {
      // Helper to send progress events
      const send = (data) => {
        controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
      };

      try {
        // Step 1: Initialization
        send({ progress: 10, status: "Connecting to secure AI grid..." });
        
        // Step 2: Generate Synthetic Data (Instead of Mock)
        send({ progress: 30, status: "Generative AI: Simulating social conversations..." });
        const rawComments = await generateSyntheticComments();
        
        if (!rawComments || rawComments.length === 0) {
            throw new Error("Failed to generate social data.");
        }

        send({ progress: 50, status: `Synthesized ${rawComments.length} polarized interactions...` });

        // Step 3: Analyze Data
        // Map to efficient format { t, l }
        const finalSample = rawComments.map(c => ({ 
            t: c.text, 
            l: c.likes || 0
        }));

        await new Promise(r => setTimeout(r, 500)); // Pacing
        send({ progress: 70, status: "Gemini 2.0 Flash: Analyzing sentiment (Bangla)..." });
        
        // Call Gemini Analyzer
        const resultString = await askGemini(finalSample);
        
        send({ progress: 90, status: "Translating and structuring insights..." });

        // Parse Result
        let result;
        try {
            const start = resultString.indexOf('{');
            const end = resultString.lastIndexOf('}') + 1;
            result = JSON.parse(resultString.slice(start, end));
        } catch (parseError) {
            console.error("JSON Parse Error", parseError);
            result = { error: "Failed to parse AI response" };
        }

        // DB Insert (Fire & Forget)
        try {
            const database = await db();
            if (database) {
                await database.collection('analyses').insertOne({ result, createdAt: new Date() });
            }
        } catch (e) {
            console.log("DB Insert failed", e);
        }

        // Final Result Payload
        send({ progress: 100, status: "Complete", result });
        controller.close();

      } catch (error) {
        console.error("Stream Error", error);
        send({ error: error.message || "Internal Server Error" });
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
