import { useState, useEffect, useRef, useCallback } from 'react';
import { Book, BookIndex, SearchResult, SearchMode } from '../types';
import { generateSnippet, deduplicateResults } from '../utils/search';
import { BOOKS } from '../data/books';
import { usePdfOcrSearch } from './usePdfOcrSearch';
// @ts-ignore
import SearchWorker from '../workers/search.worker?worker';

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode>('index');
  const [ocrProgress, setOcrProgress] = useState({ 
    current: 0, 
    total: 0,
    currentBook: '',
    currentPage: 0,
    currentBookIndex: 0,
    totalBooks: 0
  });
  
  const [history, setHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('salt_search_history');
    return saved ? JSON.parse(saved) : [];
  });

  const workerRef = useRef<Worker | null>(null);
  const [isWorkerReady, setIsWorkerReady] = useState(false);
  const { searchAllPdfs, isSearching: isOcrSearching, progress: ocrProgressState } = usePdfOcrSearch();

  // Load book indices and initialize worker
  useEffect(() => {
    const worker = new SearchWorker();
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, results: workerResults, error: workerError, query } = e.data;

      if (type === 'READY') {
        setIsWorkerReady(true);
      }

      if (type === 'RESULTS') {
        const processed: SearchResult[] = workerResults.map((res: any) => {
          const item = res.item;
          const book = BOOKS.find(b => b.id === item.bookId);

          return {
            bookId: item.bookId,
            bookTitle: item.bookTitle,
            bookYear: book?.year || '',
            pdfPath: book?.pdfPath || '',
            page: item.page,
            score: res.score ?? 1,
            snippet: generateSnippet(item.text, query || ''),
            matchedTerms: (query || '').split(/\s+/).filter(Boolean),
            type: item.type,
            record: item.record,
            matchPositions: res.matchPositions || []
          };
        });

        setResults(deduplicateResults(processed));
        setIsSearching(false);
      }

      if (type === 'ERROR') {
        setError(workerError);
        setIsSearching(false);
      }
    };

    // Load all book indices and send to worker
    const loadBookIndices = async () => {
      try {
        const bookIndices = await Promise.all(
          BOOKS.map(async (book) => {
            const response = await fetch(`/indexes/${book.id}.json`);
            if (!response.ok) {
              throw new Error(`Failed to load index for ${book.id}`);
            }
            return response.json();
          })
        );

        // Send INIT message with loaded data
        worker.postMessage({
          type: 'INIT',
          payload: { books: bookIndices }
        });
      } catch (err) {
        console.error('Failed to load book indices:', err);
        setError('Failed to load search indices');
      }
    };

    loadBookIndices();

    return () => {
      worker.terminate();
    };
  }, []);

  // Update OCR progress
  useEffect(() => {
    if (isOcrSearching) {
      setOcrProgress({
        current: ocrProgressState.current,
        total: ocrProgressState.total,
        currentBook: ocrProgressState.currentBook || '',
        currentPage: ocrProgressState.currentPage || 0,
        currentBookIndex: ocrProgressState.currentBookIndex || 0,
        totalBooks: ocrProgressState.totalBooks || 0
      });
    }
  }, [isOcrSearching, ocrProgressState]);

  const performSearch = useCallback(async (query: string, mode: SearchMode = 'index') => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    if (mode === 'ocr') {
      // Deep OCR search mode - search all PDFs directly
      setIsSearching(true);
      setSearchMode('ocr');
      setError(null);

      // Save to history
      setHistory(prev => {
        const next = [trimmed, ...prev.filter(t => t !== trimmed)].slice(0, 10);
        localStorage.setItem('salt_search_history', JSON.stringify(next));
        return next;
      });

      try {
        const allResults = await searchAllPdfs(trimmed, BOOKS, 20);

        const processed: SearchResult[] = allResults.map(r => ({
          bookId: r.bookId,
          bookTitle: r.bookTitle,
          bookYear: r.bookYear,
          pdfPath: r.pdfPath,
          page: r.page,
          snippet: r.text,
          score: r.score,
          matchedTerms: trimmed.split(/\s+/).filter(Boolean),
          type: 'page' as const
        }));

        setResults(deduplicateResults(processed).sort((a, b) => b.score - a.score));
      } catch (err) {
        console.error('OCR search error:', err);
        setError('Failed to search PDFs. Please try index search mode.');
      } finally {
        setIsSearching(false);
      }
    } else {
      // Index search mode - use pre-built JSON indices (fast)
      if (!workerRef.current || !isWorkerReady) return;

      setIsSearching(true);
      setSearchMode('index');
      setError(null);

      // Save to history
      setHistory(prev => {
        const next = [trimmed, ...prev.filter(t => t !== trimmed)].slice(0, 10);
        localStorage.setItem('salt_search_history', JSON.stringify(next));
        return next;
      });

      workerRef.current.postMessage({
        type: 'SEARCH',
        payload: {
          query: trimmed,
          selectedBookIds: BOOKS.map(b => b.id)
        }
      });
    }
  }, [isWorkerReady, searchAllPdfs]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('salt_search_history');
  }, []);

  const toggleSearchMode = useCallback(() => {
    setSearchMode(prev => prev === 'index' ? 'ocr' : 'index');
  }, []);

  return {
    results,
    isSearching,
    error,
    performSearch,
    history,
    clearHistory,
    totalIndexed: 637,
    searchMode,
    toggleSearchMode,
    ocrProgress
  };
}
