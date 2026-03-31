import { SearchResult } from '../types';

/**
 * Extracts a readable snippet centred around the best keyword match.
 */
export function generateSnippet(text: string, query: string, windowSize = 220): string {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();

  let bestPos = -1;
  for (const term of terms) {
    const pos = lower.indexOf(term);
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) bestPos = pos;
  }

  if (bestPos === -1) return text.slice(0, windowSize).trim() + '…';

  const start = Math.max(0, bestPos - 80);
  const end = Math.min(text.length, bestPos + windowSize);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = '…' + snippet;
  if (end < text.length) snippet += '…';
  return snippet;
}

/**
 * Wraps matched terms in a snippet with <mark> tags for display.
 */
export function highlightSnippet(snippet: string, terms: string[]): string {
  if (!terms.length) return snippet;
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const re = new RegExp(`(${escaped.join('|')})`, 'gi');
  return snippet.replace(re, '<mark>$1</mark>');
}

/**
 * Sorts results: by score first, deduplicate adjacent same-page same-book hits.
 */
export function deduplicateResults(results: SearchResult[]): SearchResult[] {
  const seen = new Set<string>();
  return results.filter((r) => {
    const key = `${r.bookId}:${r.page}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
