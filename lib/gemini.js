import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Primary & Fallback Models
const PRIMARY_MODEL = 'gemini-3-flash-preview';
const FALLBACK_MODEL = 'gemini-2.0-flash';

/**
 * Helper: Tries primary model, falls back to stable if overloaded/error.
 */
async function generateWithFallback(prompt, config) {
  try {
    // Attempt Primary
    return await ai.models.generateContent({
      model: PRIMARY_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config
    });
  } catch (error) {
    // Check if error is recoverable (e.g., 503 Overloaded, 404 Not Found)
    console.warn(`⚠️ Primary model (${PRIMARY_MODEL}) failed: ${error.message}`);
    console.log(`🔄 Switching to fallback model (${FALLBACK_MODEL})...`);
    
    // Attempt Fallback
    return await ai.models.generateContent({
      model: FALLBACK_MODEL,
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config
    });
  }
}

/**
 * GENERATOR: Creates synthetic YouTube comments about BD politics
 */
export async function generateSyntheticComments() {
  const prompt = `
    Generate 50 realistic, highly polarized, and emotional YouTube comments regarding current Bangladeshi politics (e.g., Interim Government, Elections, Commodity Prices, Law & Order, Political Parties).
    
    Requirements:
    1. Language: Mix of Bangla (Unicode) and Tanglish (Bangla written in English).
    2. Sentiment: Varied (Angry, Hopeful, Frustrated, Sarcastic, Supportive).
    3. Entities: Mention real figures/parties (e.g., Dr. Yunus, Army, BNP, Jamaat, Awami League, Students).
    4. Format: Return ONLY a valid JSON array of objects: [{ "text": "...", "likes": Number (0-5000) }].
    5. Do not include markdown formatting or explanations. Just the JSON.
  `;

  try {
    const response = await generateWithFallback(prompt, { responseMimeType: 'application/json' });
    return JSON.parse(response.candidates[0].content.parts[0].text);
  } catch (e) {
    console.error("Generator Error", e);
    return [];
  }
}

/**
 * ANALYZER: Processes comments and returns Bangla insights
 */
export async function askGemini(finalSample) {
  const prompt = `
Role: Expert Political Analyst for Bangladesh.
Task: Analyze these YouTube comments (t=text, l=likes) and provide a deep sentiment report.
Data: ${JSON.stringify(finalSample)}

Constraints:
1. **LANGUAGE:** All output text (summaries, reasons, themes, demands) MUST be in **BANGLA** (বাংলা).
2. **TONE:** Professional, journalistic, and objective.

Output Schema (JSON):
{
  "analysis": {
    "overall_sentiment": "String (Bangla). 2-3 sentences summarizing the public mood.",
    "reasons_for_sentiment": ["String (Bangla). **Bold Title**: Explanation."],
    "demands": ["String (Bangla). **Bold Title**: Specific demand."]
  },
  "statistical_data": {
    "entity_sentiments": [
      {
        "entity": "String (Bangla/English Name)",
        "positive_comments": Number,
        "negative_comments": Number,
        "total_likes_positive": Number,
        "total_likes_negative": Number
      }
    ],
    "top_themes": [
      {
        "theme": "String (Bangla Topic)",
        "comment_count": Number,
        "total_likes": Number
      }
    ]
  }
}
`;

  const response = await generateWithFallback(prompt, { responseMimeType: 'application/json' });
  return response.candidates[0].content.parts[0].text;
}
