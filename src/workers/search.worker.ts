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
        // Use 'text' field (which is what our JSON has)
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
            
            records.push({
              id: `${book.bookId}-${page.page}-rec-${idx}`,
              bookId: book.bookId,
              bookTitle: book.title,
              page: page.page,
              text: recText,
              name: rec.fullName,
              profession: rec.profession,
              type: 'record',
              record: rec
            });
          });
        }
      });
    });

    currentData = records;
    
    // Configure Fuse for exact-first search
    fuseInstance = new Fuse(records, {
      keys: [
        { name: 'name', weight: 3.0 },
        { name: 'profession', weight: 2.0 },
        { name: 'text', weight: 1.0 }
      ],
      includeScore: true,
      threshold: 0.2, // Lower threshold = more exact matches
      ignoreLocation: true,
      minMatchCharLength: 2,
      shouldSort: true,
      findAllMatches: true
    });

    self.postMessage({ type: 'READY' });
  }

  if (type === 'SEARCH') {
    const { query, selectedBookIds } = payload;
    
    if (!fuseInstance || !query.trim()) {
      self.postMessage({ type: 'RESULTS', results: [] });
      return;
    }

    // First: exact substring matches (highest priority)
    const exactMatches: any[] = [];
    const fuzzyMatches: any[] = [];
    
    const queryLower = query.toLowerCase().trim();
    
    // Search using Fuse
    const allResults = fuseInstance.search(query);
    
    // Categorize results: exact matches first, then fuzzy
    for (const result of allResults) {
      const textLower = result.item.text.toLowerCase();
      
      // Find all match positions in the text
      const matchPositions: { start: number; end: number }[] = [];
      let searchStart = 0;
      while (true) {
        const idx = textLower.indexOf(queryLower, searchStart);
        if (idx === -1) break;
        matchPositions.push({ start: idx, end: idx + queryLower.length });
        searchStart = idx + 1;
        if (matchPositions.length >= 5) break; // Limit positions per page
      }
      
      // Check if it's an exact word match (as whole word)
      const exactWordMatch = textLower.includes(queryLower) && 
        (textLower.indexOf(queryLower) === 0 || /\s/.test(textLower[textLower.indexOf(queryLower) - 1])) &&
        (textLower.indexOf(queryLower) + queryLower.length === textLower.length || /\s/.test(textLower[textLower.indexOf(queryLower) + queryLower.length]));
      
      if (exactWordMatch && result.score && result.score < 0.1) {
        exactMatches.push({ ...result, matchPositions });
      } else {
        fuzzyMatches.push({ ...result, matchPositions });
      }
    }

    // Combine: exact matches first, then fuzzy, filtered by selected books
    const filteredExact = exactMatches
      .filter(r => selectedBookIds.includes(r.item.bookId))
      .slice(0, 30);
    
    const filteredFuzzy = fuzzyMatches
      .filter(r => selectedBookIds.includes(r.item.bookId))
      .slice(0, 20);
    
    const finalResults = [...filteredExact, ...filteredFuzzy];

    self.postMessage({ type: 'RESULTS', results: finalResults });
  }
};
