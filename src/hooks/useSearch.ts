import { useMemo } from 'react';
import { BookIndex, SearchResult } from '../types';
import { getContextForMatch } from '../utils/parser';

export function useSearch(indexes: Map<string, BookIndex>, query: string) {
  const results: SearchResult[] = useMemo(() => {
    if (!query.trim() || indexes.size === 0) return [];

    const searchResults: SearchResult[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    indexes.forEach((bookIndex) => {
      bookIndex.pages.forEach((pageIndex) => {
        // Check if any word on this page matches the query
        const hasMatch = pageIndex.words.some(word => 
          word.includes(normalizedQuery) || normalizedQuery.includes(word)
        );

        if (hasMatch) {
          // Find the best matching sentence or use page text
          const lowerText = pageIndex.text.toLowerCase();
          const queryIndex = lowerText.indexOf(normalizedQuery);
          
          let context: string;
          let score = 0;

          if (queryIndex !== -1) {
            // Calculate relevance score based on frequency
            const regex = new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
            const matches = pageIndex.text.match(regex);
            score = matches ? matches.length / pageIndex.words.length : 0;
            
            context = getContextForMatch(pageIndex.text, normalizedQuery);
          } else {
            context = getContextForMatch(pageIndex.text, normalizedQuery);
          }

          searchResults.push({
            bookId: bookIndex.bookId,
            pageNumber: pageIndex.page,
            text: pageIndex.text,
            context,
            score: 1 - score, // Lower is better for Fuse-like sorting
            matchedWord: normalizedQuery,
          });
        }
      });
    });

    // Sort by relevance (higher score = more matches)
    return searchResults.sort((a, b) => (a.score || 0) - (b.score || 0));
  }, [indexes, query]);

  return results;
}
