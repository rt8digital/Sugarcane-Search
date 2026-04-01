import { useState, useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { Book, BookIndex, PageIndex, BiographicalRecord } from '../types';
import { getCache, setCache } from '../utils/db';
import { parseBiographies } from '../utils/parser';

const { GlobalWorkerOptions, getDocument } = pdfjsLib;
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs`;

export function usePdfIndex(books: Book[]) {
  const [indexes, setIndexes] = useState<Map<string, BookIndex>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Track ongoing operations to prevent duplicates
  const activeJobs = useRef(new Set<string>());
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    if (!books.length) {
      setLoading(false);
      return;
    }

    const processBooks = async () => {
      setLoading(true);
      
      // Identify books that aren't indexed yet
      const missingBooks = books.filter(b => !indexes.has(b.id) && !activeJobs.current.has(b.id));
      
      if (missingBooks.length === 0) {
        setLoading(false);
        return;
      }

      for (const book of missingBooks) {
        if (!isMounted.current) break;
        activeJobs.current.add(book.id);

        try {
          // 1. Check Cache
          const cached = await getCache<BookIndex>(book.id);
          if (cached) {
            if (isMounted.current) {
              setIndexes(prev => new Map(prev).set(book.id, cached));
            }
            activeJobs.current.delete(book.id);
            continue;
          }

          // 2. Fetch PDF & Index
          const pdfResp = await fetch(book.pdfPath);
          if (!pdfResp.ok) throw new Error(`Could not fetch PDF: ${book.pdfPath}`);
          
          const buffer = await pdfResp.arrayBuffer();
          const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
          const numPages = doc.numPages;
          const pages: PageIndex[] = [];

          for (let p = 1; p <= numPages; p++) {
            if (!isMounted.current) break;
            
            const page = await doc.getPage(p);
            const content = await page.getTextContent();
            const text = content.items
              .map((item: any) => item.str || '')
              .join(' ')
              .replace(/\s+/g, ' ')
              .trim();
            
            const records: BiographicalRecord[] = parseBiographies(text);
            pages.push({ page: p, text, records });
            
            // Minor progress update within book
            if (p % 5 === 0 || p === numPages) {
              const currentTotal = Array.from(indexes.values()).length;
              setProgress((currentTotal + (p / numPages)) / books.length);
            }
          }

          const bookIndex: BookIndex = {
            bookId: book.id,
            title: book.title,
            totalPages: numPages,
            indexedAt: new Date().toISOString(),
            pages,
          };

          // 3. Persist & Update State
          await setCache(book.id, bookIndex);
          
          if (isMounted.current) {
            setIndexes(prev => new Map(prev).set(book.id, bookIndex));
          }

        } catch (err) {
          console.error(`Error indexing ${book.id}:`, err);
          if (isMounted.current) {
            setError(`Failed to index ${book.title}. Heritage records may be incomplete.`);
          }
        } finally {
          activeJobs.current.delete(book.id);
        }
      }

      if (isMounted.current) {
        setLoading(false);
        setProgress(1);
      }
    };

    processBooks();
  }, [books]); // Re-runs if BOOKS list changes

  return { 
    indexes, 
    loading: loading || activeJobs.current.size > 0, 
    error, 
    progress 
  };
}
