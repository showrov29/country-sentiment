import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi(process.env.BEARER_TOKEN);

// In-memory cache (resets when server restarts)
let cachedTweets = null;
let lastFetchedDate = null;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    // Return cached data if already fetched today
    if (cachedTweets && lastFetchedDate === date) {
      return Response.json({ tweets: cachedTweets, cached: true });
    }

    // Twitter API query: keywords for Bangladesh/Dhaka
    const query = "(Bangladesh OR Dhaka) -is:retweet lang:en";

    const startTime = `${date}T00:00:00Z`;
    const endTime = `${date}T23:59:59Z`;

    const response = await client.v2.search(query, {
      "tweet.fields": ["author_id", "public_metrics", "created_at"],
      max_results: 50,
      start_time: startTime,
      end_time: endTime,
    });

    const tweets = (response.data?.data || []).map((t) => ({
      id: t.id,
      text: t.text,
      likes: t.public_metrics.like_count,
      retweets: t.public_metrics.retweet_count,
      created_at: t.created_at,
    }));

    // Sort by likes
    tweets.sort((a, b) => b.likes - a.likes);

    // Store in cache
    cachedTweets = tweets;
    lastFetchedDate = date;

    return Response.json({ tweets, cached: false });
  } catch (error) {
    // Handle rate limit
    if (error.rateLimit) {
      const resetTime = new Date(error.rateLimit.reset * 1000).toISOString();
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded", resetAt: resetTime }),
        { status: 429 }
      );
    }

    console.error("Error fetching tweets:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch tweets" }), {
      status: 500,
    });
  }
}
