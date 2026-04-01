import Fuse from 'fuse.js';

interface SearchQuery {
  query: string;
  bookIndices: any[];
  selectedBookIds: string[];
}

let fuseInstance: Fuse<any> | null = null;
let currentData: any[] = [];

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    const { books } = payload;

    const records: any[] = [];
    books.forEach((book: any) => {
      book.pages.forEach((page: any) => {
        const pageText = page.text || page.fullPageText || '';

        // Page-level search
        if (pageText) {
          records.push({
            id: `${book.bookId}-${page.page}`,
            bookId: book.bookId,
            bookTitle: book.title,
            page: page.page,
            text: pageText,
            type: 'page'
          });
        }

        // Record-level search
        if (page.records && Array.isArray(page.records)) {
          page.records.forEach((rec: any, idx: number) => {
            const recText = [rec.fullName, rec.profession, rec.birthDate, rec.education, rec.rawText]
              .filter(Boolean)
              .join(' ');

            // Extract surname (last word of full name) and given names
            const nameParts = (rec.fullName || '').trim().split(/\s+/);
            const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : rec.fullName || '';
            const givenNames = nameParts.slice(0, -1).join(' ') || '';

            records.push({
              id: `${book.bookId}-${page.page}-rec-${idx}`,
              bookId: book.bookId,
              bookTitle: book.title,
              page: page.page,
              text: recText,
              name: rec.fullName,
              surname: surname,
              givenNames: givenNames,
              profession: rec.profession,
              birthYear: extractYear(rec.birthDate),
              type: 'record',
              record: rec
            });
          });
        }
      });
    });

    currentData = records;

    // Enhanced Fuse configuration for better name/profession/year matching
    fuseInstance = new Fuse(records, {
      keys: [
        { name: 'surname', weight: 5.0 },      // Highest priority for surname matches
        { name: 'name', weight: 4.0 },         // Full name matches
        { name: 'givenNames', weight: 3.0 },   // Given name matches
        { name: 'profession', weight: 2.5 },   // Profession matches
        { name: 'birthYear', weight: 2.0 },    // Year matches
        { name: 'text', weight: 1.0 }          // Full text (lowest priority)
      ],
      includeScore: true,
      threshold: 0.5, // Slightly lower for more precise matching
      ignoreLocation: true,
      minMatchCharLength: 2,
      shouldSort: true,
      findAllMatches: true,
      useExtendedSearch: true,
      includeMatches: true
    });

    self.postMessage({ type: 'READY' });
  }

  if (type === 'SEARCH') {
    const { query, selectedBookIds } = payload;

    if (!fuseInstance || !query.trim()) {
      self.postMessage({ type: 'RESULTS', results: [] });
      return;
    }

    const queryLower = query.trim().toLowerCase();
    
    // Parse query for structured search
    const parsedQuery = parseSearchQuery(queryLower);
    
    // Search using Fuse
    const allResults = fuseInstance.search(query);

    // Enhanced scoring based on query type
    const scoredResults = allResults.map(result => {
      let boostScore = 0;
      const item = result.item;
      const matchPositions: { start: number; end: number }[] = [];

      // Find match positions
      const textLower = item.text.toLowerCase();
      let searchStart = 0;
      while (true) {
        const idx = textLower.indexOf(queryLower, searchStart);
        if (idx === -1) break;
        matchPositions.push({ start: idx, end: idx + queryLower.length });
        searchStart = idx + 1;
        if (matchPositions.length >= 5) break;
      }

      // Check for whole word match
      const isExactWord = matchPositions.some(pos =>
        (pos.start === 0 || !/[a-z0-9]/.test(textLower[pos.start - 1])) &&
        (pos.end === textLower.length || !/[a-z0-9]/.test(textLower[pos.end]))
      );

      // Surname boost - if query looks like a surname
      if (parsedQuery.hasSurname && item.surname) {
        const surnameLower = item.surname.toLowerCase();
        if (surnameLower === queryLower || surnameLower.includes(queryLower)) {
          boostScore += 2.0;
        }
      }

      // Given name boost
      if (parsedQuery.hasGivenName && item.givenNames) {
        const givenNamesLower = item.givenNames.toLowerCase();
        if (givenNamesLower.includes(queryLower)) {
          boostScore += 1.5;
        }
      }

      // Profession boost
      if (parsedQuery.professions.length > 0 && item.profession) {
        const professionLower = item.profession.toLowerCase();
        for (const prof of parsedQuery.professions) {
          if (professionLower.includes(prof)) {
            boostScore += 1.0;
          }
        }
      }

      // Year boost
      if (parsedQuery.years.length > 0 && item.birthYear) {
        if (parsedQuery.years.includes(item.birthYear)) {
          boostScore += 1.5;
        }
      }

      // Exact word match boost
      if (isExactWord) {
        boostScore += 0.5;
      }

      // Full name exact match boost
      if (item.name) {
        const nameLower = item.name.toLowerCase();
        if (nameLower === queryLower) {
          boostScore += 3.0;
        } else if (nameLower.includes(queryLower)) {
          boostScore += 1.0;
        }
      }

      // Apply boost to score (lower is better in Fuse)
      const boostedScore = Math.max(0, (result.score || 0) - (boostScore * 0.1));

      return {
        ...result,
        score: boostedScore,
        matchPositions
      };
    });

    // Categorize: exact matches first, then fuzzy
    const exactMatches: any[] = [];
    const fuzzyMatches: any[] = [];

    for (const result of scoredResults) {
      const isExact = result.score < 0.05; // Very low score = near exact match
      
      if (isExact) {
        exactMatches.push(result);
      } else {
        fuzzyMatches.push(result);
      }
    }

    // Filter by selected books and sort
    const filteredExact = exactMatches
      .filter(r => selectedBookIds.includes(r.item.bookId))
      .sort((a, b) => a.score - b.score)
      .slice(0, 50);

    const filteredFuzzy = fuzzyMatches
      .filter(r => selectedBookIds.includes(r.item.bookId))
      .sort((a, b) => a.score - b.score)
      .slice(0, 50);

    const finalResults = [...filteredExact, ...filteredFuzzy];

    self.postMessage({ type: 'RESULTS', results: finalResults, query });
  }
};

// Helper: Extract year from date string
function extractYear(dateStr: string | undefined): string | null {
  if (!dateStr) return null;
  
  // Try to find 4-digit year
  const match = dateStr.match(/\b(1[0-9]{3}|2[0-9]{3})\b/);
  if (match) {
    return match[1];
  }
  
  return null;
}

// Helper: Parse search query for structured components
interface ParsedQuery {
  hasSurname: boolean;
  hasGivenName: boolean;
  professions: string[];
  years: string[];
  rawQuery: string;
}

function parseSearchQuery(query: string): ParsedQuery {
  const words = query.split(/\s+/).filter(w => w.length > 0);
  const professions = ['doctor', 'lawyer', 'teacher', 'nurse', 'engineer', 'merchant', 'trader', 'priest', 'pastor', 'attorney', 'advocate', 'business', 'owner', 'manager', 'director', 'professor', 'principal'];
  
  const years: string[] = [];
  const detectedProfessions: string[] = [];
  const nameWords: string[] = [];

  for (const word of words) {
    // Check for year (1900-2099)
    if (/^(1[0-9]{3}|2[0-9]{2})$/.test(word)) {
      years.push(word);
      continue;
    }

    // Check for profession
    const isProfession = professions.some(p => word.includes(p) || p.includes(word));
    if (isProfession) {
      detectedProfessions.push(word);
      continue;
    }

    // Otherwise, it's likely a name component
    nameWords.push(word);
  }

  return {
    hasSurname: nameWords.length > 0,
    hasGivenName: nameWords.length > 1,
    professions: detectedProfessions,
    years: years,
    rawQuery: query
  };
}
