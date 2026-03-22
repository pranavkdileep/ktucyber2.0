import { NextRequest } from "next/server";

const AGENT_API_BASE =
  process.env.AGENT_API_BASE ||
  process.env.NEXT_PUBLIC_AGENT_API_BASE ||
  "http://127.0.0.1:8000";

function resolveImageUrl(src: string) {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  return new URL(src, AGENT_API_BASE).toString();
}

export async function GET(request: NextRequest) {
  const src = request.nextUrl.searchParams.get("src");

  if (!src) {
    return new Response("Missing src parameter", { status: 400 });
  }

  let upstreamUrl: string;
  try {
    upstreamUrl = resolveImageUrl(src);
  } catch {
    return new Response("Invalid src parameter", { status: 400 });
  }

  const upstreamResponse = await fetch(upstreamUrl, {
    cache: "no-store",
  });

  if (!upstreamResponse.ok || !upstreamResponse.body) {
    return new Response("Failed to fetch image", {
      status: upstreamResponse.status || 502,
    });
  }

  const headers = new Headers();
  const contentType = upstreamResponse.headers.get("content-type");
  const cacheControl = upstreamResponse.headers.get("cache-control");
  const contentLength = upstreamResponse.headers.get("content-length");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (cacheControl) {
    headers.set("Cache-Control", cacheControl);
  } else {
    headers.set("Cache-Control", "no-store");
  }

  if (contentLength) {
    headers.set("Content-Length", contentLength);
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    headers,
  });
}
