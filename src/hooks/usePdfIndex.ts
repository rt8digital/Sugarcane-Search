import { useState, useEffect } from 'react';
import { BookIndex } from '../types';

// Architecture: 
// 1. Try GitHub media CDN first (for live updates without rebuild)
// 2. Fall back to local /search-index.json (served from public/ during dev/build)
// 3. When new PDFs are added: run `npm run build-index` then push public/search-index.json to GitHub
const GITHUB_INDEX_URL = 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/search-index.json';
const LOCAL_INDEX_URL = '/search-index.json';

export function usePdfIndex() {
  const [indexes, setIndexes] = useState<Map<string, BookIndex>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadIndex = async () => {
      try {
        setLoading(true);
        setError(null);
        setProgress(0.1);

        let data: Record<string, BookIndex> | null = null;

        // Try GitHub CDN first (latest updates)
        try {
          const resp = await fetch(GITHUB_INDEX_URL);
          if (resp.ok) {
            data = await resp.json();
          }
        } catch {
          // CDN unavailable
        }

        // Fall back to local bundled index
        if (!data) {
          setProgress(0.5);
          const resp = await fetch(LOCAL_INDEX_URL);
          if (!resp.ok) throw new Error('No search index found locally or on CDN');
          data = await resp.json();
        }

        setProgress(1);

        if (!cancelled) {
          const map = new Map<string, BookIndex>();
          Object.values(data).forEach((idx: BookIndex) => {
            map.set(idx.bookId, idx);
          });
          setIndexes(map);
          setLoading(false);
        }
      } catch (err: any) {
        console.error('Error loading search index:', err);
        if (!cancelled) {
          setError(err.message || 'Failed to load search index');
          setLoading(false);
        }
      }
    };

    loadIndex();
    return () => { cancelled = true; };
  }, []);

  return { indexes, loading, error, progress };
}
