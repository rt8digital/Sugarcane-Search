/**
 * Structured schema for biographical entries.
 * Extracted from unstructured OCR text.
 */
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

export interface PageIndexEnriched {
  page: number;
  records: BiographicalRecord[];
  fullPageText: string;
}

export interface BookIndexEnriched {
  bookId: string;
  title: string;
  totalPages: number;
  indexedAt: string;
  pages: PageIndexEnriched[];
}
