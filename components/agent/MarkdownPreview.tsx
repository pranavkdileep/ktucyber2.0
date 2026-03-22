"use client";

import React from "react";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function renderInlineLatex(text: string) {
  return text.replace(/\$([^$]+)\$/g, (_, expression: string) => {
    const normalized = expression.trim();

    const latexReplacements: Record<string, string> = {
      "\\rightarrow": "&rarr;",
      "\\leftarrow": "&larr;",
      "\\leftrightarrow": "&harr;",
      "\\Rightarrow": "&rArr;",
      "\\Leftarrow": "&lArr;",
      "\\Leftrightarrow": "&hArr;",
    };

    return latexReplacements[normalized] ?? escapeHtml(normalized);
  });
}

function renderInlineMarkdown(text: string) {
  let rendered = renderInlineLatex(escapeHtml(text));

  rendered = rendered.replace(/`([^`]+)`/g, "<code>$1</code>");
  rendered = rendered.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  rendered = rendered.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  rendered = rendered.replace(
    /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)/g,
    '<img src="$2" alt="$1" title="$3" class="my-4 rounded-lg border border-slate-200 w-full object-contain bg-white" />'
  );
  rendered = rendered.replace(
    /\[([^\]]+)\]\(([^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer" class="text-sky-600 underline">$1</a>'
  );

  return rendered;
}

function renderTableRow(row: string, isHeader: boolean) {
  const cells = row
    .split("|")
    .map((cell) => cell.trim())
    .filter((cell, index, arr) => !(index === 0 && cell === "") && !(index === arr.length - 1 && cell === ""));

  const tag = isHeader ? "th" : "td";
  const className = isHeader
    ? "border border-slate-200 bg-slate-100 px-3 py-2 text-left font-semibold"
    : "border border-slate-200 px-3 py-2 align-top";

  return `<tr>${cells
    .map((cell) => `<${tag} class="${className}">${renderInlineMarkdown(cell)}</${tag}>`)
    .join("")}</tr>`;
}

export function markdownToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: string[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (/^#{1,6}\s/.test(trimmed)) {
      const level = trimmed.match(/^#+/)?.[0].length || 1;
      const content = trimmed.replace(/^#{1,6}\s/, "");
      blocks.push(
        `<h${level} class="mt-6 mb-3 font-semibold text-slate-900">${renderInlineMarkdown(
          content
        )}</h${level}>`
      );
      index += 1;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      blocks.push('<hr class="my-6 border-slate-200" />');
      index += 1;
      continue;
    }

    if (trimmed.startsWith(">")) {
      const quoteLines: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push(
        `<blockquote class="my-4 border-l-4 border-sky-200 bg-sky-50 px-4 py-3 text-slate-700">${quoteLines
          .map((quote) => `<p>${renderInlineMarkdown(quote)}</p>`)
          .join("")}</blockquote>`
      );
      continue;
    }

    if (/^!\[[^\]]*\]\([^)]+\)/.test(trimmed)) {
      blocks.push(renderInlineMarkdown(trimmed));
      index += 1;
      continue;
    }

    if (trimmed.includes("|")) {
      const header = lines[index]?.trim() || "";
      const separator = lines[index + 1]?.trim() || "";
      if (/\|/.test(header) && /^[:|\-\s]+$/.test(separator)) {
        const rows: string[] = [renderTableRow(header, true)];
        index += 2;
        while (index < lines.length && lines[index].trim().includes("|")) {
          rows.push(renderTableRow(lines[index].trim(), false));
          index += 1;
        }
        blocks.push(
          `<div class="my-4 overflow-x-auto"><table class="w-full border-collapse text-sm">${rows.join(
            ""
          )}</table></div>`
        );
        continue;
      }
    }

    if (/^(\*|-)\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^(\*|-)\s+/.test(lines[index].trim())) {
        items.push(
          `<li>${renderInlineMarkdown(
            lines[index].trim().replace(/^(\*|-)\s+/, "")
          )}</li>`
        );
        index += 1;
      }
      blocks.push(`<ul class="my-4 list-disc space-y-2 pl-6">${items.join("")}</ul>`);
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(
          `<li>${renderInlineMarkdown(
            lines[index].trim().replace(/^\d+\.\s+/, "")
          )}</li>`
        );
        index += 1;
      }
      blocks.push(`<ol class="my-4 list-decimal space-y-2 pl-6">${items.join("")}</ol>`);
      continue;
    }

    const paragraphLines: string[] = [];
    while (index < lines.length && lines[index].trim()) {
      const current = lines[index].trim();
      if (
        /^#{1,6}\s/.test(current) ||
        /^---+$/.test(current) ||
        trimmed.startsWith(">") ||
        /^(\*|-)\s+/.test(current) ||
        /^\d+\.\s+/.test(current)
      ) {
        break;
      }
      paragraphLines.push(current);
      index += 1;
    }

    blocks.push(
      `<p class="my-3 leading-7 text-slate-700">${renderInlineMarkdown(
        paragraphLines.join(" ")
      )}</p>`
    );
  }

  return blocks.join("");
}

export default function MarkdownPreview({
  content,
  className,
}: MarkdownPreviewProps) {
  const html = markdownToHtml(content);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
