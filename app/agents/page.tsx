"use client";

import { listAgents } from "@/actions/agent";
import Link from "next/link";
import { Bot, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const PAGE_SIZE = 12;

export default function AgentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [agents, setAgents] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const activeSearch = useMemo(
    () => searchParams.get("search")?.trim() || "",
    [searchParams]
  );
  const activePage = useMemo(() => {
    const value = Number.parseInt(searchParams.get("page") || "1", 10);
    return Number.isNaN(value) || value < 1 ? 1 : value;
  }, [searchParams]);

  useEffect(() => {
    setSearchQuery(activeSearch);
    setCurrentPage(activePage);
  }, [activeSearch, activePage]);

  useEffect(() => {
    const loadAgents = async () => {
      setLoading(true);
      const result = await listAgents(activeSearch || null, activePage, PAGE_SIZE);
      setAgents(result.agents);
      setTotalPages(Math.max(1, Math.ceil(result.totalCount / PAGE_SIZE)));
      setLoading(false);
    };

    loadAgents();
  }, [activePage, activeSearch]);

  const pushPageState = (page: number, search: string) => {
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    params.set("page", String(page));
    router.push(`/agents?${params.toString()}`);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pushPageState(1, searchQuery);
  };

  const handlePageChange = (page: number) => {
    pushPageState(page, activeSearch);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <section className="rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-emerald-600 px-6 py-8 text-white shadow-lg">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-white/15 p-3">
              <Bot className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Study Agents</h1>
              <p className="mt-2 max-w-2xl text-sm text-white/90">
                Pick a book agent, ask a question, and stream structured study notes in PDF Format.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <form onSubmit={handleSearchSubmit} className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by book id..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm outline-none transition focus:border-sky-400 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Search
            </button>
          </form>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
              Loading agents...
            </div>
          ) : agents.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-slate-900">No agents found</p>
              <p className="mt-2 text-sm text-slate-500">
                Try a different search term or clear the filter.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <Link
                  key={agent}
                  href={`/agent/${encodeURIComponent(agent)}`}
                  className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-md"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600">
                        Agent
                      </p>
                      <h2 className="mt-2 break-all text-lg font-semibold text-slate-900">
                        {agent}
                      </h2>
                    </div>
                    <div className="rounded-2xl bg-sky-50 p-3 text-sky-600 transition group-hover:bg-sky-100">
                      <Bot className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-500">
                    Open this study agent to generate streaming notes for the selected book.
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 flex flex-col items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm md:flex-row">
          <p className="text-sm text-slate-500">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
