/**
 * Modular Data Source Interface
 * 
 * This abstraction allows SALT to search across different data formats:
 * - JSON indices (pre-processed)
 * - Direct PDF OCR (on-demand)
 * - Future: API endpoints, local databases, etc.
 */

import { SearchResult, Book } from '../types';

/**
 * Unified search result from any data source
 */
export interface DataSourceResult {
  bookId: string;
  bookTitle: string;
  bookYear: string;
  pdfPath: string;
  page: number;
  text: string;
  score: number;
  type: 'page' | 'record';
  record?: any;
}

/**
 * Data source interface for modular search
 */
export interface DataSource {
  /**
   * Unique identifier for this data source
   */
  id: string;

  /**
   * Human-readable name
   */
  name: string;

  /**
   * Whether this source is currently available
   */
  isAvailable: boolean;

  /**
   * Search the data source
   */
  search(query: string, options?: SearchOptions): Promise<DataSourceResult[]>;

  /**
   * Get metadata about the data source
   */
  getMetadata(): DataSourceMetadata;

  /**
   * Clean up resources
   */
  dispose?(): void;
}

export interface SearchOptions {
  bookIds?: string[];
  maxResults?: number;
  signal?: AbortSignal;
  onProgress?: (progress: { current: number; total: number }) => void;
}

export interface DataSourceMetadata {
  totalBooks: number;
  totalPages: number;
  totalRecords: number;
  lastUpdated?: string;
  sourceType: 'json' | 'pdf' | 'api' | 'database';
}

/**
 * JSON Index Data Source
 * Searches pre-processed JSON indices (fast)
 */
export class JsonIndexDataSource implements DataSource {
  id = 'json-index';
  name = 'Pre-built Indices';
  isAvailable = true;

  private indices: Map<string, any> = new Map();

  async loadIndices(books: Book[]): Promise<void> {
    const loadPromises = books.map(async (book) => {
      try {
        const response = await fetch(`/indexes/${book.id}.json`);
        if (response.ok) {
          const index = await response.json();
          this.indices.set(book.id, index);
        }
      } catch (error) {
        console.warn(`Failed to load index for ${book.id}`);
      }
    });

    await Promise.all(loadPromises);
  }

  async search(query: string, options?: SearchOptions): Promise<DataSourceResult[]> {
    // This would typically delegate to a worker for Fuse.js search
    // For now, return empty - the actual implementation is in search.worker.ts
    return [];
  }

  getMetadata(): DataSourceMetadata {
    let totalPages = 0;
    let totalRecords = 0;

    for (const index of this.indices.values()) {
      totalPages += index.pages?.length || 0;
      for (const page of index.pages || []) {
        totalRecords += page.records?.length || 0;
      }
    }

    return {
      totalBooks: this.indices.size,
      totalPages,
      totalRecords,
      sourceType: 'json'
    };
  }

  getIndex(bookId: string): any {
    return this.indices.get(bookId);
  }
}

/**
 * PDF OCR Data Source
 * Searches raw PDF text content (slower but comprehensive)
 */
export class PdfOcrDataSource implements DataSource {
  id = 'pdf-ocr';
  name = 'Direct PDF Search';
  isAvailable = true;

  private books: Book[] = [];
  private textCache: Map<string, Map<number, string>> = new Map();

  constructor(books: Book[]) {
    this.books = books;
  }

  async search(query: string, options?: SearchOptions): Promise<DataSourceResult[]> {
    const { maxResults = 50, signal, onProgress } = options || {};
    const results: DataSourceResult[] = [];
    const queryLower = query.toLowerCase();

    let totalBooks = this.books.length;
    let processedBooks = 0;

    for (const book of this.books) {
      if (signal?.aborted) break;

      try {
        const pages = await this.extractTextFromPdf(book.pdfPath);
        
        for (const [pageNum, text] of pages) {
          if (signal?.aborted) break;

          const matches = this.findMatches(text, queryLower);
          if (matches.length > 0) {
            results.push({
              bookId: book.id,
              bookTitle: book.title,
              bookYear: book.year,
              pdfPath: book.pdfPath,
              page: pageNum,
              text: matches[0].context,
              score: matches[0].score,
              type: 'page'
            });

            if (results.length >= maxResults) break;
          }
        }
      } catch (error) {
        console.error(`Failed to search PDF ${book.pdfPath}:`, error);
      }

      processedBooks++;
      onProgress?.({ current: processedBooks, total: totalBooks });
    }

    return results.sort((a, b) => b.score - a.score);
  }

  private async extractTextFromPdf(pdfPath: string): Promise<Map<number, string>> {
    const cached = this.textCache.get(pdfPath);
    if (cached) return cached;

    const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist/build/pdf');
    GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@5.6.205/build/pdf.worker.min.mjs';

    const pdf = await getDocument(pdfPath).promise;
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

    this.textCache.set(pdfPath, pages);
    return pages;
  }

  private findMatches(text: string, query: string): Array<{ context: string; score: number }> {
    const results: Array<{ context: string; score: number }> = [];
    const textLower = text.toLowerCase();

    // Exact phrase match
    let index = textLower.indexOf(query);
    while (index !== -1) {
      const start = Math.max(0, index - 50);
      const end = Math.min(text.length, index + query.length + 50);
      results.push({
        context: text.slice(start, end).trim(),
        score: 1.0
      });
      index = textLower.indexOf(query, index + 1);
    }

    // Individual word matches
    const words = query.split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      let wordIndex = textLower.indexOf(word);
      while (wordIndex !== -1) {
        const start = Math.max(0, wordIndex - 50);
        const end = Math.min(text.length, wordIndex + word.length + 50);
        const existing = results.find(r => Math.abs(textLower.indexOf(r.context) - wordIndex) < 10);
        if (!existing) {
          results.push({
            context: text.slice(start, end).trim(),
            score: 0.5
          });
        }
        wordIndex = textLower.indexOf(word, wordIndex + 1);
      }
    });

    return results.sort((a, b) => b.score - a.score);
  }

  getMetadata(): DataSourceMetadata {
    return {
      totalBooks: this.books.length,
      totalPages: 0, // Would need to extract to know
      totalRecords: 0,
      sourceType: 'pdf'
    };
  }

  clearCache(): void {
    this.textCache.clear();
  }
}

/**
 * Composite Data Source
 * Aggregates multiple data sources for unified search
 */
export class CompositeDataSource implements DataSource {
  id = 'composite';
  name = 'Unified Search';
  isAvailable = true;

  private sources: DataSource[] = [];

  addSource(source: DataSource): void {
    this.sources.push(source);
  }

  async search(query: string, options?: SearchOptions): Promise<DataSourceResult[]> {
    const allResults = await Promise.all(
      this.sources.map(source => source.search(query, options))
    );

    return allResults
      .flat()
      .sort((a, b) => b.score - a.score);
  }

  getMetadata(): DataSourceMetadata {
    const metadata = this.sources.map(s => s.getMetadata());
    return {
      totalBooks: metadata.reduce((sum, m) => sum + m.totalBooks, 0),
      totalPages: metadata.reduce((sum, m) => sum + m.totalPages, 0),
      totalRecords: metadata.reduce((sum, m) => sum + m.totalRecords, 0),
      sourceType: 'api' // Composite
    };
  }

  dispose(): void {
    this.sources.forEach(s => s.dispose?.());
  }
}
