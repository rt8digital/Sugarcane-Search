import { useState, useCallback, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

const { GlobalWorkerOptions, getDocument } = pdfjsLib;
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

interface PdfSearchResult {
  bookId: string;
  bookTitle: string;
  bookYear: string;
  pdfPath: string;
  page: number;
  text: string;
  matches: { position: number; text: string }[];
  score: number;
}

interface SearchOptions {
  query: string;
  pdfPath: string;
  bookId: string;
  bookTitle: string;
  bookYear: string;
  maxResults?: number;
}

interface CacheEntry {
  pages: Map<number, string>;
  timestamp: number;
}

interface OcrProgress {
  current: number;        // Current page in current PDF
  total: number;          // Total pages in current PDF
  currentBook?: string;   // Current book title
  currentPage?: number;   // Current page number being processed
  totalBooks?: number;    // Total books to search
  currentBookIndex?: number; // Current book index
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export function usePdfOcrSearch() {
  const [isSearching, setIsSearching] = useState(false);
  const [progress, setProgress] = useState<OcrProgress>({ current: 0, total: 0 });
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const abortControllerRef = useRef<AbortController | null>(null);

  const extractTextFromPdf = useCallback(async (pdfPath: string): Promise<Map<number, string>> => {
    const cached = cacheRef.current.get(pdfPath);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.pages;
    }

    const loadingTask = getDocument({
      url: pdfPath,
      cMapUrl: 'https://unpkg.com/pdfjs-dist@5.6.205/cmaps/',
      cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    const pages = new Map<number, string>();

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      pages.set(i, text);
    }

    cacheRef.current.set(pdfPath, { pages, timestamp: Date.now() });
    return pages;
  }, []);

  const searchInText = useCallback((text: string, query: string): { position: number; text: string; score: number }[] => {
    const results: { position: number; text: string; score: number }[] = [];
    const queryLower = query.toLowerCase();
    const textLower = text.toLowerCase();

    // Exact phrase match
    let index = textLower.indexOf(queryLower);
    while (index !== -1) {
      const context = text.slice(Math.max(0, index - 50), Math.min(text.length, index + query.length + 50));
      results.push({
        position: index,
        text: context,
        score: 1.0
      });
      index = textLower.indexOf(queryLower, index + 1);
    }

    // Individual word matches
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      let wordIndex = textLower.indexOf(word);
      while (wordIndex !== -1) {
        const context = text.slice(Math.max(0, wordIndex - 50), Math.min(text.length, wordIndex + word.length + 50));
        const existing = results.find(r => Math.abs(r.position - wordIndex) < 10);
        if (!existing) {
          results.push({
            position: wordIndex,
            text: context,
            score: 0.5
          });
        }
        wordIndex = textLower.indexOf(word, wordIndex + 1);
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }, []);

  const searchPdf = useCallback(async (
    options: SearchOptions,
    onBookProgress?: (bookTitle: string, bookIndex: number, totalBooks: number) => void,
    onPageProgress?: (pageNum: number, totalPages: number, bookTitle: string) => void
  ): Promise<PdfSearchResult[]> => {
    const { query, pdfPath, bookId, bookTitle, bookYear, maxResults = 50 } = options;

    abortControllerRef.current = new AbortController();
    setIsSearching(true);
    setProgress({ current: 0, total: 0, currentBook: bookTitle });

    try {
      const pages = await extractTextFromPdf(pdfPath);
      setProgress({ 
        current: 0, 
        total: pages.size, 
        currentBook: bookTitle,
        currentPage: 1 
      });

      const results: PdfSearchResult[] = [];
      let pageIndex = 0;

      for (const [pageNum, pageText] of pages) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        // Update progress with current page
        setProgress({ 
          current: pageIndex + 1, 
          total: pages.size, 
          currentBook: bookTitle,
          currentPage: pageNum 
        });

        // Call page progress callback
        onPageProgress?.(pageNum, pages.size, bookTitle);

        const matches = searchInText(pageText, query);
        if (matches.length > 0) {
          results.push({
            bookId,
            bookTitle,
            bookYear,
            pdfPath,
            page: pageNum,
            text: matches[0].text,
            matches: matches.map(m => ({ position: m.position, text: m.text })),
            score: matches[0].score
          });
        }

        pageIndex++;

        if (results.length >= maxResults) {
          break;
        }
      }

      return results.sort((a, b) => b.score - a.score);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return [];
      }
      console.error('PDF OCR search error:', error);
      throw error;
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  }, [extractTextFromPdf, searchInText]);

  const searchAllPdfs = useCallback(async (
    query: string,
    books: Array<{ id: string; title: string; year: string; pdfPath: string }>,
    maxResultsPerBook: number = 20
  ): Promise<PdfSearchResult[]> => {
    abortControllerRef.current = new AbortController();
    setIsSearching(true);

    const allResults: PdfSearchResult[] = [];

    try {
      for (let i = 0; i < books.length; i++) {
        if (abortControllerRef.current?.signal.aborted) {
          break;
        }

        const book = books[i];
        
        const bookResults = await searchPdf(
          {
            query,
            pdfPath: book.pdfPath,
            bookId: book.id,
            bookTitle: book.title,
            bookYear: book.year,
            maxResults: maxResultsPerBook
          },
          // onBookProgress
          (bookTitle, bookIndex, totalBooks) => {
            setProgress(prev => ({
              ...prev,
              currentBook: bookTitle,
              currentBookIndex: bookIndex + 1,
              totalBooks
            }));
          },
          // onPageProgress
          (pageNum, totalPages, bookTitle) => {
            setProgress({
              current: pageNum,
              total: totalPages,
              currentBook: bookTitle,
              currentPage: pageNum,
              currentBookIndex: i + 1,
              totalBooks: books.length
            });
          }
        );

        allResults.push(...bookResults);
      }

      return allResults.sort((a, b) => b.score - a.score);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return [];
      }
      console.error('Multi-PDF OCR search error:', error);
      throw error;
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  }, [searchPdf]);

  const cancelSearch = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    searchPdf,
    searchAllPdfs,
    cancelSearch,
    clearCache,
    isSearching,
    progress,
  };
}
