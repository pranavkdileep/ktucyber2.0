"use client";

import MarkdownPreview, { markdownToHtml } from "@/components/agent/MarkdownPreview";
import Link from "next/link";
import { ArrowLeft, Bot, Download, LoaderCircle, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AgentChatPageProps {
  params: Promise<{
    bookid: string;
  }>;
}

interface AgentImageItem {
  figure_id: number;
  page_number: number;
  image_caption_text: string;
  image_url: string;
}

interface StreamStatus {
  stage?: string;
  [key: string]: unknown;
}

function getProxiedImageUrl(src: string) {
  return `/api/agent/image?src=${encodeURIComponent(src)}`;
}

function replaceImageTags(markdown: string, items: AgentImageItem[]) {
  return items.reduce((content, item) => {
    const imageTagPattern = new RegExp(`<image id="${item.figure_id}">`, "g");
    const normalizedUrl = getProxiedImageUrl(item.image_url);
    const replacement = `![${item.image_caption_text}](${normalizedUrl} "${item.image_caption_text}")`;
    return content.replace(imageTagPattern, replacement);
  }, markdown);
}

function parseEventPayload(rawValue: string) {
  try {
    return JSON.parse(rawValue);
  } catch {
    return null;
  }
}

async function consumeEventStream(
  stream: ReadableStream<Uint8Array>,
  onEvent: (eventName: string, payload: string) => void
) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const lines = chunk.split("\n");
      let eventName = "message";
      const dataLines: string[] = [];

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5).trim());
        }
      }

      if (dataLines.length > 0) {
        onEvent(eventName, dataLines.join("\n"));
      }
    }
  }
}

export default function AgentChatPage({ params }: AgentChatPageProps) {
  const [bookid, setBookid] = useState<string>("");
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState("");
  const [finalAnswer, setFinalAnswer] = useState("");
  const [status, setStatus] = useState<StreamStatus | null>(null);
  const [imageItems, setImageItems] = useState<AgentImageItem[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markdownPreviewRef = useRef<HTMLElement | null>(null);
  const hasAutoScrolledRef = useRef(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setBookid(decodeURIComponent(resolvedParams.bookid));
    };

    resolveParams();
  }, [params]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const currentStage = String(status?.stage ?? "");
    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;

    if (!isStreaming || currentStage !== "generating_answer") {
      hasAutoScrolledRef.current = false;
      return;
    }

    if (!isMobileViewport || hasAutoScrolledRef.current) {
      return;
    }

    hasAutoScrolledRef.current = true;
    window.setTimeout(() => {
      markdownPreviewRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 150);
  }, [isStreaming, status?.stage]);

  const displayedMarkdown = finalAnswer || preview;

  const handleDownloadPdf = () => {
    if (!displayedMarkdown || typeof window === "undefined") {
      return;
    }

    const printableHtml = markdownToHtml(displayedMarkdown);
    const iframe = document.createElement("iframe");
    const sanitizedBookId = (bookid || "study-note").replace(/[^\w-]+/g, "-");

    iframe.style.position = "fixed";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.setAttribute("aria-hidden", "true");
    document.body.appendChild(iframe);

    const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDocument) {
      document.body.removeChild(iframe);
      return;
    }

    iframeDocument.open();
    iframeDocument.write(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${sanitizedBookId}-study-note</title>
          <style>
            @page {
              size: A4;
              margin: 24mm 16mm 18mm;
            }

            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              color: #0f172a;
              font-family: Arial, sans-serif;
              line-height: 1.65;
              background: #ffffff;
            }

            .page-watermark {
              position: fixed;
              top: 0mm;
              right: 5mm;
              font-size: 10px;
              font-weight: 600;
              color: #0000FF;
              letter-spacing: 0.04em;
              pointer-events: none;
            }

            .content {
              font-size: 13px;
            }

            h1, h2, h3, h4, h5, h6 {
              color: #0f172a;
              margin: 0 0 12px;
              page-break-after: avoid;
            }

            p, li, blockquote, table {
              page-break-inside: avoid;
            }

            p {
              margin: 0 0 12px;
            }

            ul, ol {
              margin: 0 0 16px;
              padding-left: 22px;
            }

            li + li {
              margin-top: 6px;
            }

            blockquote {
              margin: 16px 0;
              padding: 12px 16px;
              border-left: 4px solid #bae6fd;
              background: #f0f9ff;
            }

            hr {
              border: 0;
              border-top: 1px solid #cbd5e1;
              margin: 24px 0;
            }

            code {
              padding: 2px 6px;
              border-radius: 6px;
              background: #e2e8f0;
              font-family: "Courier New", monospace;
              font-size: 0.95em;
            }

            a {
              color: #0369a1;
              text-decoration: underline;
            }

            img {
              display: block;
              max-width: 100%;
              height: auto;
              margin: 16px 0;
              border: 1px solid #cbd5e1;
              border-radius: 12px;
              page-break-inside: avoid;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 16px 0;
              font-size: 12px;
            }

            th, td {
              border: 1px solid #cbd5e1;
              padding: 8px 10px;
              text-align: left;
              vertical-align: top;
            }

            th {
              background: #f1f5f9;
            }

            @media print {
              .page-watermark {
                position: fixed;
              }
            }
          </style>
        </head>
        <body>
        <a href="https://www.ktucyber.com" style="position: fixed; top: 8mm; right: 5mm; font-size: 10px; font-weight: 600; color: #0000FF; letter-spacing: 0.04em; pointer-events: none; text-decoration: none;">www.ktucyber.com</a>
          <div class="page-watermark">Downloaded from www.ktucyber.com</div>
          <div class="content">${printableHtml}</div>
        </body>
      </html>
    `);
    iframeDocument.close();

    const cleanup = () => {
      window.setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    };

    window.setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      cleanup();
    }, 250);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim() || !bookid) {
      return;
    }

    setIsStreaming(true);
    setError(null);
    setPreview("");
    setFinalAnswer("");
    setStatus({ stage: "connecting" });
    setImageItems([]);

    try {
      const response = await fetch("/api/agent/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          bookid,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`Stream request failed with status ${response.status}`);
      }

      let draftAnswer = "";
      let currentImages: AgentImageItem[] = [];

      await consumeEventStream(response.body, (eventName, rawPayload) => {
        const payload = parseEventPayload(rawPayload);

        if (eventName === "status" && payload) {
          setStatus(payload as StreamStatus);
          return;
        }

        if (eventName === "images" && payload && Array.isArray(payload.items)) {
          currentImages = payload.items as AgentImageItem[];
          setImageItems(currentImages);
          return;
        }

        if (eventName === "answer_chunk" && payload && typeof payload.delta === "string") {
          draftAnswer += payload.delta;
          setPreview(draftAnswer);
          return;
        }

        if (eventName === "complete" && payload) {
          const sourceMarkdown =
            typeof payload.final_answer === "string" && payload.final_answer.trim()
              ? payload.final_answer
              : draftAnswer;
          const enrichedMarkdown = replaceImageTags(sourceMarkdown, currentImages);
          setFinalAnswer(enrichedMarkdown);
          setPreview(enrichedMarkdown);
          setStatus({ stage: "complete" });
        }
      });
    } catch (streamError) {
      console.error("Agent stream failed:", streamError);
      setError("Unable to generate study notes right now.");
    } finally {
      setIsStreaming(false);
    }
  };

  const stageLabel = status?.stage
    ? String(status.stage).replaceAll("_", " ")
    : "Idle";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6">
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to agents
          </Link>
        </div>

        <section className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-sky-900 px-6 py-8 text-white shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-200">Agent Chat</p>
              <h1 className="mt-2 break-all text-3xl font-bold">{bookid || "Loading..."}</h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-200">
                Ask this book agent for study notes, summaries, or topic explanations and watch the markdown response stream in live.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100">
              {isStreaming ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Stage: {stageLabel}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-600">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Prompt Box</h2>
                <p className="text-sm text-slate-500">
                  Send a question for this agent and stream the answer into the preview.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Book ID
                </label>
                <input
                  type="text"
                  value={bookid}
                  readOnly
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Prompt
                </label>
                <textarea
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Ask about a topic in this book..."
                  rows={10}
                  className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-sky-400"
                />
              </div>

              <button
                type="submit"
                disabled={isStreaming || !query.trim() || !bookid}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStreaming ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isStreaming ? "Generating..." : "Generate Study Note"}
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {imageItems.length > 0 && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-semibold text-slate-900">Images discovered</h3>
                <p className="mt-1 text-xs text-slate-500">
                  Placeholder image tags are converted to real images after the stream completes.
                </p>
              </div>
            )}
          </section>

          <section
            ref={markdownPreviewRef}
            className="rounded-3xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Markdown Preview</h2>
                  <p className="text-sm text-slate-500">
                    Live stream on the right, finalized with image replacements on completion.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={!displayedMarkdown}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
              </div>
            </div>

            <div className="min-h-[600px] px-5 py-5">
              {displayedMarkdown ? (
                <MarkdownPreview
                  content={displayedMarkdown}
                  className="prose prose-slate max-w-none text-sm"
                />
              ) : (
                <div className="flex min-h-[520px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                  <p className="text-lg font-semibold text-slate-900">
                    Your study note preview will appear here
                  </p>
                  <p className="mt-2 max-w-md text-sm text-slate-500">
                    Start with a prompt like "Feature Extraction module in biometric" and the markdown answer will stream into this panel.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
