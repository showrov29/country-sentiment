
"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [tweets, setTweets] = useState([]);

  
    async function fetchTweets() {
      const res = await fetch("/api/youtube");
      const data = await res.json();
      setTweets(data);
    }


  return (
    <div>
     <button onClick={fetchTweets}>Refresh</button>
    </div>
  );
}
