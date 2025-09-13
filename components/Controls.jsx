'use client';
import { useState } from 'react';

export default function Controls({ onRun }) {
  const [q, setQ] = useState('lang:en -is:retweet');
  const [country, setCountry] = useState('');
  const [iso2, setIso2] = useState('');
  const [usePlace, setUsePlace] = useState(false);
  const [sort, setSort] = useState('none');

  return (
    <div className="grid gap-3 md:grid-cols-5 items-end">
      <div className="md:col-span-2">
        <label className="block text-sm">Twitter Query</label>
        <input className="w-full p-2 rounded border" value={q} onChange={e=>setQ(e.target.value)} placeholder="lang:en -is:retweet keyword" />
      </div>
      <div>
        <label className="block text-sm">Country keywords</label>
        <input className="w-full p-2 rounded border" value={country} onChange={e=>setCountry(e.target.value)} placeholder="Bangladesh ঢাকা…" />
      </div>
      <div>
        <label className="block text-sm">ISO-2 (optional)</label>
        <input className="w-full p-2 rounded border" value={iso2} onChange={e=>setIso2(e.target.value.toUpperCase())} placeholder="BD, US…" />
        <label className="text-xs flex items-center gap-2 mt-1">
          <input type="checkbox" checked={usePlace} onChange={e=>setUsePlace(e.target.checked)} />
          use place_country
        </label>
      </div>
      <div>
        <label className="block text-sm">Sort</label>
        <select className="w-full p-2 rounded border" value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="none">None</option>
          <option value="likes">Most Likes</option>
          <option value="engagement">Most Engagement</option>
        </select>
      </div>
      <div className="md:col-span-5">
        <button className="px-4 py-2 rounded bg-black text-white" onClick={()=>onRun({ q, country, iso2, usePlace, sort })}>
          Run (last 7 days)
        </button>
      </div>
    </div>
  );
}