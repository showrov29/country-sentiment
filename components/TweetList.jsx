'use client';

export function TweetList({ tweets, sort }) {
  const top = (tweets||[]).slice(0, 50);
  return (
    <div className="bg-white dark:bg-neutral-950 p-4 rounded-2xl shadow">
      <h3 className="font-semibold mb-2">Top Tweets {sort!=="none" ? `(sorted by ${sort})` : ''}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Likes</th>
              <th className="p-2">Engagement</th>
              <th className="p-2">Text</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {top.map(t => (
              <tr key={t.id} className="border-b align-top">
                <td className="p-2">{t.public_metrics?.like_count||0}</td>
                <td className="p-2">
                  {(t.public_metrics?.like_count||0)+(t.public_metrics?.retweet_count||0)+(t.public_metrics?.reply_count||0)+(t.public_metrics?.quote_count||0)}
                </td>
                <td className="p-2 whitespace-pre-wrap">{t.text}</td>
                <td className="p-2 text-xs text-neutral-500">{new Date(t.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}