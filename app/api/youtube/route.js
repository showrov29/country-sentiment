import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.YOUTUBE_API_KEY,
});

// Top news channels
const NEWS_CHANNEL_IDS = [
  "UCN6sm8iHiPd0cnoUardDAnw", // BBC News
//   "UCYfdidRxbB8Qhf0Nx7ioOYw", // CNN
//   "UCupvZG-5ko_eiXAupbDfxWw", // Al Jazeera
];

// In-memory cache
let cachedComments = null;
let lastFetchedDate = null;

// Simple spam filter
function isSpam(comment) {
  if (!comment.text) return true;
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const repeatedChars = /(.)\1{5,}/;
  return urlPattern.test(comment.text) || repeatedChars.test(comment.text);
}

// Get ISO string for 7 days ago
function sevenDaysAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
}

export async function GET(request) {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Return cached if already fetched today
    if (cachedComments && lastFetchedDate === today) {
      return Response.json({ comments: cachedComments, cached: true });
    }

    let allComments = [];

    for (const channelId of NEWS_CHANNEL_IDS) {
      // Step 1: Search videos from the past week, sorted by view count
      const searchRes = await youtube.search.list({
        part: ["snippet"],
        channelId,
        type: ["video"],
        maxResults: 5, // top 5 videos by views
        order: "viewCount",
        publishedAfter: sevenDaysAgo(),
      });

      if (!searchRes.data.items || !searchRes.data.items.length) continue;

      const mostViewed = searchRes.data.items[0]; // most viewed video
      const videoId = mostViewed.id.videoId;
      const videoTitle = mostViewed.snippet.title;

      // Step 2: Fetch comments for this video
      let nextPageToken = null;
      do {
        const commentsRes = await youtube.commentThreads.list({
          part: ["snippet"],
          videoId,
          maxResults: 100,
          pageToken: nextPageToken || undefined,
          textFormat: "plainText",
        });
        // console.log("🚀 ~ GET ~ commentsRes:", commentsRes)

        commentsRes.data.items.forEach((item) => {
          const snippet = item.snippet.topLevelComment.snippet;
        //   console.log("🚀 ~ GET ~ snippet:", snippet)

          if (snippet.publishedAt.startsWith(today)) {
            allComments.push({
              videoTitle,
              author: snippet.authorDisplayName,
              text: snippet.textDisplay,
              likes: snippet.likeCount,
              publishedAt: snippet.publishedAt,
            });
            // console.log("🚀 ~ GET ~ allComments:", allComments)
        }
    });
    // console.log("🚀 ~ GET ~ allComments:", allComments)

        nextPageToken = commentsRes.data.nextPageToken;
      } while (nextPageToken);
    }

    // Sort by likes
    allComments.sort((a, b) => b.likes - a.likes);

    // Cache results
    cachedComments = allComments;
    lastFetchedDate = today;

    return Response.json({ comments: allComments, cached: false });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch comments" }), {
      status: 500,
    });
  }
}
