import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// Top news channels
const NEWS_CHANNEL_IDS = [
  "UCN6sm8iHiPd0cnoUardDAnw", // BBC News
  "UCYfdidRxbB8Qhf0Nx7ioOYw", // CNN
  "UCHLqIOMPk20w-6cFgkA90jw", // Al Jazeera
];

// In-memory cache
let cachedGrouped = null;
let lastFetchedDate = null;

// Simple spam filter
function isSpam(commentText) {
  if (!commentText) return true;
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const repeatedChars = /(.)\1{5,}/;
  return urlPattern.test(commentText) || repeatedChars.test(commentText);
}

// ISO string for 7 days ago
function sevenDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 2);
  return d.toISOString();
}

export async function GET(request) {
  try {
    const todayISO = new Date().toISOString();
    const today = todayISO.split("T")[0];

    // Return cached if already fetched today
    if (cachedGrouped && lastFetchedDate === today) {
      return Response.json({ videos: cachedGrouped, cached: true });
    }

    /** @type {Record<string, {videoId:string, videoTitle:string, comments:Array<{text:string,likes:number,publishedAt:string}>}>} */
    const groups = {};

    for (const channelId of NEWS_CHANNEL_IDS) {
      // Step 1: Search videos from the past 7 days, sorted by view count
      const searchRes = await youtube.search.list({
        part: ["snippet"],
        channelId,
        type: ["video"],
        maxResults: 50,
        order: "viewCount",
        publishedAfter: sevenDaysAgo(), // ✅ last 7 days
      });

      const items = searchRes.data.items ?? [];
      if (!items.length) continue;

      // Take TOP 5 per channel by viewCount (API already ordered)
      const topFive = items.slice(0, 5);

      for (const vid of topFive) {
        const videoId = vid.id.videoId;
        const videoTitle = vid.snippet.title;

        if (!groups[videoId]) {
          groups[videoId] = { videoId, videoTitle, comments: [] };
        }

        // Step 2: Fetch comments for this video (skip if disabled)
        try {
          let nextPageToken = null;
          do {
            const commentsRes = await youtube.commentThreads.list({
              part: ["snippet"],
              videoId,
              maxResults: 100,
              pageToken: nextPageToken || undefined,
              textFormat: "plainText",
            });

            for (const item of commentsRes.data.items ?? []) {
              const sn = item.snippet.topLevelComment.snippet;
              const publishedAt = sn.publishedAt ?? "";
              const likeCount = sn.likeCount ?? 0;
              const text = sn.textDisplay ?? "";

              // keep only meaningful comments (not spam, at least 1 like)
              if (likeCount > 50) {
                groups[videoId].comments.push({
                  text,
                  likes: likeCount,
                  // publishedAt,
                });
              }
            }

            nextPageToken = commentsRes.data.nextPageToken;
          } while (nextPageToken);
        } catch (err) {
          console.warn(`Comments disabled for video ${videoId}:`, err.message);
        }
      }
    }

    // Convert groups object -> array
    const groupedArray = Object.values(groups);

    // Cache results
    cachedGrouped = groupedArray;
    lastFetchedDate = today;

    return Response.json({ videos: groupedArray, cached: false });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch comments" }), {
      status: 500,
    });
  }
}
