/**
 * Parser to extract words and sentences from OCR text for search indexing.
 */

export interface ParsedPage {
  page: number;
  text: string;
  words: string[];
  sentences: Sentence[];
}

export interface Sentence {
  text: string;
  words: string[];
}

/**
 * Parse OCR text from a PDF page and extract searchable words and sentences.
 */
export function parsePage(text: string, page: number): ParsedPage {
  // Extract all unique words (normalized to lowercase, min 2 chars)
  const wordSet = new Set<string>();
  const allWords = text.toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 2);
  
  allWords.forEach(w => wordSet.add(w));

  // Extract sentences by splitting on common sentence boundaries
  const sentences: Sentence[] = [];
  const rawSentences = text.split(/[.!?\n]+/);
  
  for (const raw of rawSentences) {
    const trimmed = raw.trim().replace(/\s+/g, ' ');
    if (trimmed.length > 10) {
      const sentWords = trimmed.toLowerCase()
        .replace(/[^a-z0-9\s'-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length >= 2);
      sentences.push({ text: trimmed, words: sentWords });
    }
  }

  return {
    page,
    text,
    words: Array.from(wordSet),
    sentences,
  };
}

/**
 * Get context around a matched word within the text.
 * Returns a snippet showing the word with surrounding text.
 */
export function getContextForMatch(text: string, query: string, contextLength: number = 80): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);
  
  if (index === -1) {
    // Return first part of text if no match
    return text.slice(0, contextLength * 2) + '...';
  }

  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + query.length + contextLength);
  let snippet = text.slice(start, end);
  
  // Add ellipsis if truncated
  if (start > 0) snippet = '...' + snippet.slice(3);
  if (end < text.length) snippet = snippet.slice(0, -3) + '...';
  
  return snippet;
}
