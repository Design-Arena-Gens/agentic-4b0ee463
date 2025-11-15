"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';

export type FeedEvent = {
  timestamp: number; // ms epoch
  message: string;
  delta?: { sku: string; change: number; newQuantity: number };
};

function isInWindow(date: Date, morning = { start: 6, end: 9 }, evening = { start: 18, end: 21 }) {
  const hour = date.getHours();
  const inMorning = hour >= morning.start && hour < morning.end;
  const inEvening = hour >= evening.start && hour < evening.end;
  return inMorning || inEvening;
}

function nextWindow(date: Date, morning = { start: 6 }, evening = { start: 18 }) {
  const d = new Date(date);
  const candidates: Date[] = [];

  const m = new Date(d);
  m.setHours(morning.start, 0, 0, 0);
  if (m <= d) m.setDate(m.getDate() + 1);
  candidates.push(m);

  const e = new Date(d);
  e.setHours(evening.start, 0, 0, 0);
  if (e <= d) e.setDate(e.getDate() + 1);
  candidates.push(e);

  candidates.sort((a, b) => +a - +b);
  return candidates[0];
}

export function LiveFeed() {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [now, setNow] = useState<Date>(new Date());
  const esRef = useRef<EventSource | null>(null);

  const inWindow = useMemo(() => isInWindow(now), [now]);
  const nextAt = useMemo(() => nextWindow(now), [now]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!inWindow) {
      // Close connection if open
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
      setConnected(false);
      return;
    }

    // Connect SSE
    const es = new EventSource('/api/stream');
    esRef.current = es;

    es.onopen = () => setConnected(true);
    es.onerror = () => setConnected(false);

    es.onmessage = (ev) => {
      try {
        const data: FeedEvent = JSON.parse(ev.data);
        setEvents((prev) => [data, ...prev].slice(0, 100));
      } catch {}
    };

    return () => {
      es.close();
      esRef.current = null;
    };
  }, [inWindow]);

  const until = Math.max(0, Math.floor((+nextAt - +now) / 1000));
  const hh = String(Math.floor(until / 3600)).padStart(2, '0');
  const mm = String(Math.floor((until % 3600) / 60)).padStart(2, '0');
  const ss = String(until % 60).padStart(2, '0');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-300">
          {inWindow ? (
            <span>
              Live updates are <span className="text-emerald-300">active</span> now.
            </span>
          ) : (
            <span>
              Live updates resume at {nextAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (in {hh}:{mm}:{ss})
            </span>
          )}
        </div>
        <div className="text-xs text-slate-400">
          Connection: {connected ? <span className="text-emerald-400">Connected</span> : <span className="text-slate-400">Idle</span>}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700/40 bg-[--card]">
        <div className="divide-y divide-slate-700/40">
          {events.length === 0 && (
            <div className="px-4 py-6 text-sm text-slate-400">{inWindow ? 'Waiting for events?' : 'Live feed will appear during update windows.'}</div>
          )}
          {events.map((e, idx) => (
            <div key={idx} className="px-4 py-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-slate-100">{e.message}</div>
                <div className="text-xs text-slate-500">{new Date(e.timestamp).toLocaleTimeString()}</div>
              </div>
              {e.delta && (
                <div className="mt-1 text-xs text-slate-400 font-mono">
                  SKU {e.delta.sku} change {e.delta.change >= 0 ? '+' : ''}{e.delta.change} ? {e.delta.newQuantity}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
