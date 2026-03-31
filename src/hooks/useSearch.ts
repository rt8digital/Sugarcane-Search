import { useState, useEffect, useRef } from 'react';
import { Book, BookIndex, SearchResult } from '../types';
import { generateSnippet, deduplicateResults } from '../utils/search';

// Import worker using Vite's ?worker syntax
import SearchWorker from '../workers/search.worker?worker';

export function useSearch(indexes: Map<string, BookIndex>, books: Book[]) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  
  const workerRef = useRef<Worker | null>(null);

  // Initialize Worker
  useEffect(() => {
    workerRef.current = new SearchWorker();
    
    workerRef.current!.onmessage = (e: MessageEvent) => {
      const { type, results: workerResults } = e.data;
      
      if (type === 'READY') {
        setIsWorkerReady(true);
      }
      
      if (type === 'RESULTS') {
        const processed: SearchResult[] = workerResults.map((res: any) => {
          const item = res.item;
          const book = books.find(b => b.id === item.bookId);
          
          // For records, use the record's name. For pages, generate from snippet
          const displayName = item.type === 'record' && item.name 
            ? item.name 
            : '';
          
          return {
            bookId: item.bookId,
            bookTitle: item.bookTitle,
            bookYear: book?.year || '',
            pdfPath: book?.pdfPath || '',
            page: item.page,
            score: res.score ?? 1,
            snippet: generateSnippet(item.text, query),
            matchedTerms: query.split(/\s+/).filter(Boolean),
            type: item.type,
            record: item.record
          };
        });

        setResults(deduplicateResults(processed));
        setIsSearching(false);
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [books]);

  // Sync index data to worker
  useEffect(() => {
    if (workerRef.current && indexes.size > 0) {
      workerRef.current.postMessage({
        type: 'INIT',
        payload: { books: Array.from(indexes.values()) }
      });
    }
  }, [indexes]);

  // Execute Search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (!workerRef.current || !isWorkerReady) return;

    setIsSearching(true);
    
    const booksToSearch = selectedBooks.length > 0 ? selectedBooks : Array.from(indexes.keys());

    workerRef.current.postMessage({
      type: 'SEARCH',
      payload: { query: trimmed, selectedBookIds: booksToSearch }
    });
  }, [query, selectedBooks, isWorkerReady, indexes]);

  return {
    query,
    setQuery,
    results,
    isSearching,
    selectedBooks,
    setSelectedBooks,
    resultCount: results.length,
  };
}
