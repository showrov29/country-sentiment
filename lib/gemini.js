import { GoogleGenAI } from '@google/genai';

export default async function askGemini(groupedArray) {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const model = 'gemini-2.5-flash';

  // Merge your "system" instructions into the user role
  const prompt = `
You are an expert data analyst. Given the YouTube comments data, provide a concise summary of the overall sentiment expressed in the comments. Identify common themes, positive/negative sentiments, and structure the output in JSON.

Here is the data:
${JSON.stringify(groupedArray)}

Return the result strictly in the following JSON format:
{
  "analysis": {
    "overall_sentiment": "The overall sentiment among Bangladeshi YouTube commenters is highly polarized, primarily reflecting strong support for Islamic political figures and parties (Shishir Monir, Mirza Galib, Jamaat-e-Islami, Chhatra Shibir) and their intellectual discourse. There is also significant religious solidarity with global Muslim causes like Palestine and Hamas. Conversely, there is widespread negative sentiment towards mainstream opposition parties (BNP, Chhatra Dal) due to perceived ineffectiveness, electoral misconduct, and a lack of integrity. A prominent frustration is directed at media figures perceived as biased or politically manipulative, particularly concerning the historical 1971 Liberation War narrative, which many feel is exploited for political gain.",
    "reasons_for_sentiment": [
      "**Intellectual Acuity & Eloquence:** Strong positive sentiment towards figures like Shishir Monir and Mirza Galib is driven by their articulate, logical, and calm presentation of arguments, which is seen as a refreshing change from typical political discourse. Commenters express admiration for their knowledge and ability to counter challenging questions effectively.",
      "**Support for Islamic/Ideological Politics:** A significant segment of commenters expresses strong support for Jamaat-e-Islami and Chhatra Shibir, often linking it to religious values and aspirations for an 'Islamic Bangladesh.' This support is also fueled by appreciation for the social work attributed to student organizations like Chhatra Shibir.",
      "**Frustration with Political Manipulation of History:** Many commenters are 'tired' of the continuous political exploitation of the 1971 Liberation War, often referred to as 'chetona bebsha' (the business of consciousness/sentiment). They feel this historical event is used as a political tool to discredit opponents, rather than fostering genuine national unity or historical understanding.",
      "**Disillusionment with Mainstream Opposition (BNP/Chhatra Dal):** Negative sentiment towards BNP and Chhatra Dal stems from perceived electoral failures (their vote boycotts are seen as excuses for defeat), a lack of shame in admitting loss, and a general impression of ineffective or superficial political strategies ('table-thumping roars,' 'no achievement, only boycott').",
      "**Perceived Media Bias:** A strong negative reaction is directed at media presenters (specifically Nikol from Jamuna TV) who are seen as aggressive, biased, or having a 'chulkany' (itchy) obsession with certain political narratives, especially regarding Jamaat-e-Islami and the 1971 issue. This indicates a desire for objective and fair journalism.",
      "**Religious Solidarity & Faith:** Deep religious conviction is evident in the strong support for Palestine and Hamas, with many attributing their survival to divine intervention (e.g., 'Namaj saved them') and expressing hope for the establishment of an independent Palestine. This reflects a significant religious identity among the commenters."
    ],
    "demands": [
      "**Intelligent and Ethical Leadership:** A clear demand for political leaders who are articulate, knowledgeable, ethical, and able to engage in logical discourse, rather than relying on emotional appeals or political rhetoric.",
      "**End to Political Exploitation of History:** A strong call for an end to the use of the 1971 Liberation War as a constant tool for political attacks and 'consciousness business.' Commenters seek a more constructive and forward-looking political narrative.",
      "**Unbiased and Responsible Media:** A demand for media outlets and journalists to practice objective reporting, fair questioning, and to avoid perceived political bias or aggression in their interviews.",
      "**Strengthening Islamic Values and Governance:** An implicit and sometimes explicit desire for the promotion of Islamic values and the establishment of an 'Islamic Bangladesh,' with support for parties perceived to embody these ideals.",
      "**Accountability and Justice:** Calls for stricter law enforcement, punishment for those involved in criminal activities (e.g., teenage gangs), and accountability for election-related misconduct or political conspiracies (e.g., demanding investigation and punishment for biased teachers or election officials).",
      "**Acceptance of Electoral Outcomes:** A demand for political parties, particularly the opposition, to accept electoral defeats gracefully rather than resorting to allegations of rigging as mere excuses."
    ]
  },
  "statistical_data": {
    "entity_sentiments": [
      {
        "entity": "Shishir Monir",
        "positive_comments": 75,
        "negative_comments": 0,
        "neutral_comments": 0,
        "total_likes_positive": 12000,
        "total_likes_negative": 0
      },
      {
        "entity": "Jamaat-e-Islami / Chhatra Shibir",
        "positive_comments": 40,
        "negative_comments": 0,
        "neutral_comments": 0,
        "total_likes_positive": 5000,
        "total_likes_negative": 0
      },
      {
        "entity": "Chhatra Dal / BNP",
        "positive_comments": 0,
        "negative_comments": 35,
        "neutral_comments": 0,
        "total_likes_positive": 0,
        "total_likes_negative": 5000
      },
      {
        "entity": "Presenter (Jamuna TV / Nikol)",
        "positive_comments": 6,
        "negative_comments": 40,
        "neutral_comments": 0,
        "total_likes_positive": 2000,
        "total_likes_negative": 6500
      },
      {
        "entity": "Mirza Galib",
        "positive_comments": 13,
        "negative_comments": 0,
        "neutral_comments": 0,
        "total_likes_positive": 1500,
        "total_likes_negative": 0
      },
      {
        "entity": "Hamas / Palestine (and Islamic values)",
        "positive_comments": 35,
        "negative_comments": 0,
        "neutral_comments": 0,
        "total_likes_positive": 9000,
        "total_likes_negative": 0
      },
      {
        "entity": "1971 Liberation War (as political tool)",
        "positive_comments": 0,
        "negative_comments": 25,
        "neutral_comments": 0,
        "total_likes_positive": 0,
        "total_likes_negative": 4500
      },
      {
        "entity": "Law Enforcement / Justice System",
        "positive_comments": 0,
        "negative_comments": 5,
        "neutral_comments": 0,
        "total_likes_positive": 0,
        "total_likes_negative": 400
      },
      {
        "entity": "Arab Countries (for inaction)",
        "positive_comments": 0,
        "negative_comments": 3,
        "neutral_comments": 0,
        "total_likes_positive": 0,
        "total_likes_negative": 300
      }
    ],
    "top_themes": [
      {
        "theme": "Support for Shishir Monir's intellect and performance",
        "comment_count": 75,
        "total_likes": 12000
      },
      {
        "theme": "Support for Jamaat-e-Islami / Chhatra Shibir",
        "comment_count": 40,
        "total_likes": 5000
      },
      {
        "theme": "Criticism/Disbelief of Chhatra Dal / BNP's political strategies and election conduct",
        "comment_count": 35,
        "total_likes": 5000
      },
      {
        "theme": "Criticism of Presenter / Media Bias (on Jamuna TV)",
        "comment_count": 40,
        "total_likes": 6500
      },
      {
        "theme": "Frustration with 1971 Liberation War's political exploitation ('Chetona Bebsha')",
        "comment_count": 25,
        "total_likes": 4500
      },
      {
        "theme": "Support for Palestine / Hamas / Islamic values (e.g., Namaj)",
        "comment_count": 35,
        "total_likes": 9000
      },
      {
        "theme": "Praise for Mirza Galib's wisdom and insights",
        "comment_count": 13,
        "total_likes": 1500
      },
      {
        "theme": "Demand for Strong Governance / Justice / Law Enforcement",
        "comment_count": 8,
        "total_likes": 700
      }
    ]
  }
}
`;

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    config: {
      responseMimeType: 'application/json',
    },
  });
  console.log("🚀 ~ askGemini ~ response:", response)

  return response.candidates[0].content.parts[0].text; // newer SDK returns response.response
}
