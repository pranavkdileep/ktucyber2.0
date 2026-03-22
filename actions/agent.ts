"use server";

export interface AgentListResult {
  agents: string[];
  totalCount: number;
  page: number;
  pageSize: number;
}

const AGENT_API_BASE =
  process.env.AGENT_API_BASE ||
  process.env.NEXT_PUBLIC_AGENT_API_BASE ||
  "http://127.0.0.1:8000";

export async function listAgents(
  searchQuery: string | null = null,
  page: number = 1,
  pageSize: number = 12
): Promise<AgentListResult> {
  try {
    const response = await fetch(`${AGENT_API_BASE}/bookids`, {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to load agents: ${response.status}`);
    }

    const data = (await response.json()) as { bookids?: string[] };
    const allAgents = Array.isArray(data.bookids) ? data.bookids : [];
    const normalizedQuery = searchQuery?.trim().toLowerCase() || "";
    const filteredAgents = normalizedQuery
      ? allAgents.filter((bookid) =>
          bookid.toLowerCase().includes(normalizedQuery)
        )
      : allAgents;

    const safePage = Math.max(1, page);
    const safePageSize = Math.max(1, pageSize);
    const startIndex = (safePage - 1) * safePageSize;
    const agents = filteredAgents.slice(startIndex, startIndex + safePageSize);

    return {
      agents,
      totalCount: filteredAgents.length,
      page: safePage,
      pageSize: safePageSize,
    };
  } catch (error) {
    console.error("Error loading agent list:", error);
    return {
      agents: [],
      totalCount: 0,
      page: Math.max(1, page),
      pageSize: Math.max(1, pageSize),
    };
  }
}
