export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  year: string;
  source?: string;
  description?: string;
  pdfPath: string;
}

export interface BiographicalRecord {
  fullName: string;
  profession?: string;
  birthDate?: string;
  birthPlace?: string;
  education?: string;
  family?: string;
  career?: string;
  achievements?: string;
  address?: string;
  rawText: string;
}

export interface PageIndex {
  page: number;
  text: string;
  records?: BiographicalRecord[];
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
  bookTitle: string;
  bookYear: string;
  pdfPath: string;
  page: number;
  snippet: string;
  score: number;
  matchedTerms: string[];
  type?: 'page' | 'record';
  record?: BiographicalRecord;
  matchPositions?: { start: number; end: number }[];
}

export interface GroupedResults {
  bookId: string;
  bookTitle: string;
  bookYear: string;
  pdfPath: string;
  pages: {
    page: number;
    results: SearchResult[];
  }[];
}
