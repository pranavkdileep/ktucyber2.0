import { NextRequest } from "next/server";

const AGENT_API_BASE =
  process.env.AGENT_API_BASE ||
  process.env.NEXT_PUBLIC_AGENT_API_BASE ||
  "http://127.0.0.1:8000";

export async function POST(request: NextRequest) {
  const body = await request.text();

  const upstreamResponse = await fetch(`${AGENT_API_BASE}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body,
    cache: "no-store",
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new Response(
      JSON.stringify({
        message: "Failed to start agent stream",
        status: upstreamResponse.status,
      }),
      {
        status: upstreamResponse.status || 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
