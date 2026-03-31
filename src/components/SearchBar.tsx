import React, { useRef, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchBarProps {
  query: string;
  onChange: (q: string) => void;
  isSearching: boolean;
  resultCount: number;
  totalIndexed: number;
}

export function SearchBar({ query, onChange, isSearching, resultCount, totalIndexed }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="search-section">
      <div className="search-box-wrap">
        <div className="search-box">
          <div className="search-icon-left">
            {isSearching ? (
              <Loader2 size={20} className="spin gold-text" />
            ) : (
              <Search size={20} />
            )}
          </div>
          <input
            ref={inputRef}
            id="main-search"
            type="text"
            className="search-input"
            placeholder="Search names, trades, families or places..."
            value={query}
            onChange={(e) => onChange(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search records"
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="search-clear"
                onClick={() => onChange('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <motion.p
        className="search-meta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={query}
      >
        {query.trim().length >= 2 ? (
          <>
            Matching <strong>{resultCount.toLocaleString()}</strong> record{resultCount !== 1 ? 's' : ''} across digital archive
          </>
        ) : (
          <>
            Collective Archive: <strong>{totalIndexed.toLocaleString()}</strong> searchable records page-by-page
          </>
        )}
      </motion.p>
    </div>
  );
}
