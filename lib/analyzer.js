import dayjs from 'dayjs';
import { askGemini } from './gemini';

const LEX = {
  angry: ['angry','mad','furious','rage','corrupt','scam','hate','disgust','protest','fail'],
  sad: ['sad','tragic','rip','condolences','mourning','depressed','loss','disaster'],
  happy: ['happy','great','love','awesome','congrats','win','progress','celebrate','proud'],
};

function lexClassify(text = '') {
  const t = text.toLowerCase();
  const score = { angry: 0, sad: 0, happy: 0, neutral: 0 };
  for (const k of ['angry','sad','happy']) {
    for (const w of LEX[k]) if (t.includes(w)) score[k]++;
  }
  const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0][0];
  return score[best] > 0 ? best : 'neutral';
}

function bucketByDay(labeled) {
  const by = {};
  for (const t of labeled) {
    const d = dayjs(t.created_at).format('YYYY-MM-DD');
    by[d] ||= { angry: 0, sad: 0, happy: 0, neutral: 0 };
    by[d][t.label] += 1;
  }
  return Object.entries(by)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, counts]) => ({ date, counts }));
}

export async function analyzeTweetsGemini(tweets) {
  if (!tweets?.length) return { totals: { angry:0, sad:0, happy:0, neutral:0 }, byDay: [], reasons: [], sample: [] };

  const prelim = tweets.map(t => ({ ...t, label: lexClassify(t.text) }));
  const totals = { angry:0, sad:0, happy:0, neutral:0 };
  for (const t of prelim) totals[t.label] += 1;
  const byDay = bucketByDay(prelim.map(t => ({ created_at: t.created_at, label: t.label })));
  const sample = prelim.slice(0, 20).map(t => ({ id: t.id, text: t.text, created_at: t.created_at, label: t.label }));

  let reasons = [];
  try {
    const payload = prelim.slice(0, 200).map(t => ({ text: t.text, label: t.label }));
    const instruction =
`You are a social media sentiment analyst.
Given up to 200 tweets with preliminary labels {angry|sad|happy|neutral}, return ONLY compact JSON with:
{
  "reasons": [ { "label": one_of_labels, "explanation": "1-2 sentences", "topHashtags": [], "topKeywords": [] } ]
}`;
    const prompt = `${instruction}
TWEETS_JSON=${JSON.stringify(payload)}`;
    const out = await askGemini(prompt);
    const start = out.indexOf('{');
    const end = out.lastIndexOf('}') + 1;
    const parsed = JSON.parse(out.slice(start, end));
    reasons = parsed?.reasons || [];
  } catch { /* fallback silent */ }

  return { totals, byDay, reasons, sample };
}