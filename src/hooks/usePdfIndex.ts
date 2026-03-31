import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { Book, BookIndex, PageIndex, BiographicalRecord } from '../types';
import { getCache, setCache } from '../utils/db';
import { parseBiographies } from '../utils/parser';

const { GlobalWorkerOptions, getDocument } = pdfjsLib;
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export function usePdfIndex(books: Book[]) {
  const [indexes, setIndexes] = useState<Map<string, BookIndex>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  
  const loadingBooks = useRef(new Set<string>());

  useEffect(() => {
    if (!books.length) {
      setLoading(false);
      return;
    }

    async function loadBooks() {
      setLoading(true);
      const loadedMap = new Map<string, BookIndex>();

      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        if (loadingBooks.current.has(book.id)) continue;
        loadingBooks.current.add(book.id);

        try {
          const cached = await getCache<BookIndex>(book.id);
          if (cached) {
            loadedMap.set(book.id, cached);
            setIndexes(new Map(loadedMap));
            setOverallProgress((i + 1) / books.length);
            continue;
          }

          const jsonPath = `/indexes/${book.id}.json`;
          const resp = await fetch(jsonPath);
          if (resp.ok) {
            const index = await resp.json();
            await setCache(book.id, index);
            loadedMap.set(book.id, index);
            setIndexes(new Map(loadedMap));
            setOverallProgress((i + 1) / books.length);
            continue;
          }

          const pdfResp = await fetch(book.pdfPath);
          if (!pdfResp.ok) throw new Error(`Could not fetch PDF: ${book.pdfPath}`);
          
          const buffer = await pdfResp.arrayBuffer();
          const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
          const numPages = doc.numPages;
          const pages: PageIndex[] = [];

          for (let p = 1; p <= numPages; p++) {
            const page = await doc.getPage(p);
            const content = await page.getTextContent();
            const text = content.items
              .map((item: any) => item.str || '')
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            const records: BiographicalRecord[] = parseBiographies(text);
            
            pages.push({ page: p, text, records });
            
            setOverallProgress((i + (p / numPages)) / books.length);
          }

          const bookIndex: BookIndex = {
            bookId: book.id,
            title: book.title,
            totalPages: numPages,
            indexedAt: new Date().toISOString(),
            pages,
          };

          await setCache(book.id, bookIndex);
          
          loadedMap.set(book.id, bookIndex);
          setIndexes(new Map(loadedMap));

        } catch (e) {
          console.error(`Failed to index ${book.id}:`, e);
        }
      }

      setLoading(false);
    }

    loadBooks();
  }, [books]);

  return { indexes, loading, error, progress: overallProgress };
}
