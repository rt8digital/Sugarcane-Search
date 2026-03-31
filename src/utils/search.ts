import { SearchResult } from '../types';

/**
 * Extracts a readable snippet centred around the best keyword match.
 * Prioritizes exact phrase matches.
 */
export function generateSnippet(text: string, query: string, windowSize = 200): string {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const lower = text.toLowerCase();
  
  // First try to find exact phrase match
  const fullQuery = terms.join(' ');
  const fullQueryPos = lower.indexOf(fullQuery);
  
  let bestPos = fullQueryPos;
  
  // If no exact phrase, find first individual term match
  if (bestPos === -1) {
    for (const term of terms) {
      const pos = lower.indexOf(term);
      if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
        bestPos = pos;
      }
    }
  }

  if (bestPos === -1) {
    // No match found - return beginning of text
    return text.slice(0, windowSize).trim() + (text.length > windowSize ? '...' : '');
  }

  // Center around the match
  const start = Math.max(0, bestPos - 60);
  const end = Math.min(text.length, start + windowSize);
  let snippet = text.slice(start, end).trim();
  
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet += '...';
  
  return snippet;
}

/**
 * Wraps matched terms in a snippet with <mark> tags for display.
 * Only marks exact matches of the query terms.
 */
export function highlightSnippet(snippet: string, terms: string[]): string {
  if (!terms.length) return snippet;
  
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  
  // Create regex that matches exact terms (as whole words)
  const re = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
  
  return snippet.replace(re, '<mark>$1</mark>');
}

/**
 * Sorts results: by score first, then deduplicate adjacent same-page same-book hits.
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
