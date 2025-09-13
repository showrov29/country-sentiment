import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi(process.env.BEARER_TOKEN);

export default async function handler(req, res) {
  try {
    const { date = new Date().toISOString().split("T")[0] } = req.query;

    const startTime = `${date}T00:00:00Z`;
    const endTime = `${date}T23:59:59Z`;

    // Better coverage: include keywords, not just geotags
    const query = "(Bangladesh OR Dhaka) -is:retweet lang:en";

    const response = await client.v2.search(query, {
      "tweet.fields": ["author_id", "public_metrics", "created_at"],
      max_results: 50,
      start_time: startTime,
      end_time: endTime,
    });

    const tweets = (response.data?.data || []).map((t) => ({
      id: t.id,
      text: t.text,
      author_id: t.author_id,
      likes: t.public_metrics.like_count,
      retweets: t.public_metrics.retweet_count,
      created_at: t.created_at,
    }));

    // Sort by likes
    tweets.sort((a, b) => b.likes - a.likes);

    res.status(200).json(tweets);
  } catch (error) {
    console.error("Error fetching tweets:", error);
    res.status(500).json({ error: "Failed to fetch tweets" });
  }
}
