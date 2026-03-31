import Fuse from 'fuse.js';

interface SearchQuery {
  query: string;
  bookIndices: any[]; // BookIndexEnriched[]
  selectedBookIds: string[];
}

let fuseInstance: Fuse<any> | null = null;
let currentData: any[] = [];

self.onmessage = (e: MessageEvent) => {
  const { type, payload } = e.data;

  if (type === 'INIT') {
    const { books } = payload;
    
    // Flatten books into searchable records
    const records: any[] = [];
    books.forEach((book: any) => {
      book.pages.forEach((page: any) => {
        // Full page search
        records.push({
          id: `${book.bookId}-${page.page}`,
          bookId: book.bookId,
          bookTitle: book.title,
          page: page.page,
          text: page.fullPageText,
          type: 'page'
        });

        // Record-level search (Enriched data)
        if (page.records) {
          page.records.forEach((rec: any, idx: number) => {
            records.push({
              id: `${book.bookId}-${page.page}-rec-${idx}`,
              bookId: book.bookId,
              bookTitle: book.title,
              page: page.page,
              text: `${rec.fullName} ${rec.profession || ''} ${rec.birthDate || ''} ${rec.education || ''} ${rec.rawText}`,
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
    fuseInstance = new Fuse(records, {
      keys: [
        { name: 'name', weight: 2.0 },
        { name: 'profession', weight: 1.5 },
        { name: 'text', weight: 1.0 }
      ],
      includeScore: true,
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 2
    });

    self.postMessage({ type: 'READY' });
  }

  if (type === 'SEARCH') {
    const { query, selectedBookIds } = payload;
    
    if (!fuseInstance) return;

    const allResults = fuseInstance.search(query);
    
    // Filter by selected books and limit
    const filtered = allResults
      .filter(r => selectedBookIds.includes(r.item.bookId))
      .slice(0, 50);

    self.postMessage({ type: 'RESULTS', results: filtered });
  }
};
