export interface Book {
  id: string;
  title: string;
  year: string;
  pdfPath: string;
}

export interface PageIndex {
  page: number;
  text: string;
  words: string[];
}

export interface BookIndex {
  bookId: string;
  title: string;
  totalPages: number;
  indexedAt: string;
  pages: PageIndex[];
}

export interface SearchResult {
  bookId: string;
  pageNumber: number;
  text: string;
  context: string;
  score?: number;
  matchedWord?: string;
}
