import { NextResponse } from "next/server";

const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST!;
const POSTHOG_API_KEY = process.env.POSTHOG_API_KEY!;
const PROJECT_ID = "154346";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!documentId || !start || !end) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const [viewsRes, uniqueRes, timeRes, clickRes, scrollRes] = await Promise.all([
      fetchTrend("document_viewed", documentId, start, end),
      fetchTrend("document_viewed", documentId, start, end, true),
      fetchTimeSpent(documentId, start, end),
      fetchTrend("cta_click", documentId, start, end),
      fetchScrollDepth(documentId, start, end),
    ]);

    const totalViews = viewsRes.reduce((acc: number, d: { day: string; count: number }) => acc + d.count, 0);
    const totalUnique = uniqueRes.reduce((acc, d) => acc + d.count, 0);
    const totalTime = timeRes.reduce((acc: number, d: { duration: number }) => acc + d.duration, 0);
    const avgTime = timeRes.length ? totalTime / timeRes.length : 0;
    const formatted = `${Math.floor(avgTime / 60)}m ${Math.round(avgTime % 60)}s`;
    const totalCTAClicks = clickRes.reduce((acc: number, d: { day: string; count: number }) => acc + d.count, 0);

    return NextResponse.json({
      views: {
        total: totalViews,
        results: viewsRes.map((r) => [r.day, r.count]),
      },
      uniqueViewers: {
        total: totalUnique,
        results: uniqueRes.map((r) => [r.day, r.count]),
      },
      timeOnPage: {
        average: avgTime,
        formatted,
        results: timeRes.map((d) => [d.day, d.duration]),
      },
      CTAClicks: {
        total: totalCTAClicks,
        results: clickRes.map((r) => [r.day, r.count]),
      },
      scrollDepth: {
        average: scrollRes.lifetimeAvg,
        results: scrollRes.dailyAverages.map((d) => [d.day, d.average]),
      },
    });
  } catch (error) {
    console.error("PostHog error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}

async function fetchTrend(
  event: string,
  documentId: string,
  start: string,
  end: string,
  unique = false
): Promise<{ day: string; count: number }[]> {
  const url = `${POSTHOG_API_HOST}/api/projects/${PROJECT_ID}/insights/trend/`;

  const body = {
    display: "ActionsLineGraph",
    events: [
      {
        id: event,
        type: "event",
        math: unique ? "dau" : "total",
      },
    ],
    interval: "day",
    date_from: start,
    date_to: end,
    properties: [
      {
        key: "documentId",
        value: documentId,
        type: "event",
      },
    ],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await res.json();
  const trend = json.result?.[0] || json[0];
  if (!trend) throw new Error("Invalid trend response");

  const days = trend.labels || trend.days || [];
  const data = trend.data || [];

  return days.map((day: string, i: number) => ({
    day,
    count: data[i],
  }));
}

async function fetchTimeSpent(documentId: string, start: string, end: string) {
  const url = `${POSTHOG_API_HOST}/api/projects/${PROJECT_ID}/events/?event=document_time_spent&after=${start}&before=${end}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
    },
  });

  const json = await res.json();
  const events = json?.results || [];

  const filtered = events
    .filter(
      (e: any) =>
        e.properties?.documentId === documentId &&
        e.properties?.duration &&
        !isNaN(parseFloat(e.properties.duration))
    )
    .map((e: any) => ({
      day: e.timestamp.split("T")[0],
      duration: parseFloat(e.properties.duration),
    }));

  const grouped: Record<string, number[]> = {};
  for (const { day, duration } of filtered) {
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(duration);
  }

  return Object.entries(grouped).map(([day, durations]) => ({
    day,
    duration: durations.reduce((acc, d) => acc + d, 0) / durations.length,
  }));
}

async function fetchScrollDepth(documentId: string, start: string, end: string) {
  const url = `${POSTHOG_API_HOST}/api/projects/${PROJECT_ID}/events/?event=scroll_depth&after=${start}&before=${end}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${POSTHOG_API_KEY}`,
    },
  });

  const json = await res.json();
  const events = json?.results || [];

  const filtered = events
    .filter(
      (e: { properties?: { documentId?: string; percent?: string }; timestamp: string }) =>
        e.properties?.documentId === documentId &&
        e.properties?.percent &&
        !isNaN(parseFloat(e.properties.percent))
    )
    .map((e: { properties: { percent: string }; timestamp: string }) => ({
      day: e.timestamp.split("T")[0],
      percent: parseFloat(e.properties.percent),
    }));

  const grouped: Record<string, number[]> = {};
  for (const { day, percent } of filtered) {
    if (!grouped[day]) grouped[day] = [];
    grouped[day].push(percent);
  }

  const dailyAverages = Object.entries(grouped).map(([day, values]) => ({
    day,
    average: values.reduce((acc, p) => acc + p, 0) / values.length,
  }));

  const total = filtered.reduce((acc: number, e: { percent: number }) => acc + e.percent, 0);
  const lifetimeAvg = filtered.length ? total / filtered.length : 0;

  return {
    lifetimeAvg,
    dailyAverages,
  };
}
