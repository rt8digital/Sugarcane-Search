import React, { useRef, useEffect, useState } from 'react';
import { Search, X, Loader2, FileText, Database, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  isSearching: boolean;
  onSearch: (q: string) => void;
  initialValue: string;
  searchMode: 'index' | 'ocr';
  onToggleMode: () => void;
  ocrProgress?: { current: number; total: number; currentBook?: string; currentPage?: number };
}

export function SearchBar({
  isSearching,
  onSearch,
  initialValue,
  searchMode,
  onToggleMode,
  ocrProgress
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim().length >= 2) {
      onSearch(inputValue.trim());
    }
  };

  const isIndex = searchMode === 'index';

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 px-4">
      {/* 1. Mode Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 bg-muted/70 rounded-2xl border border-border/60 backdrop-blur-sm shadow-sm">
          <button
            onClick={() => searchMode !== 'index' && onToggleMode()}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200",
              isIndex
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            aria-pressed={isIndex}
          >
            <Database size={18} strokeWidth={2} />
            <span className="hidden sm:inline">INDEX SEARCH</span>
            <span className="sm:hidden">INDEX</span>
          </button>
          <button
            onClick={() => searchMode !== 'ocr' && onToggleMode()}
            className={cn(
              "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200",
              !isIndex
                ? "bg-accent text-accent-foreground shadow-md scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
            aria-pressed={!isIndex}
          >
            <FileText size={18} strokeWidth={2} />
            <span className="hidden sm:inline">DEEP OCR</span>
            <span className="sm:hidden">OCR</span>
          </button>
        </div>
      </div>

      {/* 2. Main Search Input */}
      <div className="relative group">
        <div
          className={cn(
            "relative flex items-center bg-card rounded-[2rem] border-2 transition-all duration-300 shadow-xl",
            isIndex
              ? "border-primary/20 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
              : "border-accent/20 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/10"
          )}
        >
          {/* Search Icon */}
          <div className="pl-6 pr-3">
            {isSearching ? (
              <Loader2
                className={cn("w-6 h-6 animate-spin", isIndex ? "text-primary" : "text-accent")}
                aria-label="Searching"
              />
            ) : (
              <Search
                className="w-6 h-6 text-muted-foreground/40 group-focus-within:text-foreground transition-colors"
                aria-hidden="true"
              />
            )}
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-0 focus:ring-0 text-xl md:text-2xl font-medium tracking-tight py-5 md:py-6 placeholder:text-muted-foreground/30"
            placeholder={isIndex ? "Search records..." : "Scan document text..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
            aria-label="Search query"
          />

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pr-4">
            <AnimatePresence>
              {inputValue && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => {
                    setInputValue('');
                    onSearch('');
                  }}
                  className="p-2.5 hover:bg-muted rounded-full text-muted-foreground transition-all"
                  aria-label="Clear search"
                  type="button"
                >
                  <X size={20} strokeWidth={2} />
                </motion.button>
              )}
            </AnimatePresence>

            <Button
              onClick={() => onSearch(inputValue.trim())}
              disabled={isSearching || inputValue.trim().length < 2}
              className={cn(
                "h-14 px-8 rounded-2xl font-bold text-lg shadow-xl",
                isIndex
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-accent text-accent-foreground hover:bg-accent/90",
                "disabled:opacity-40 disabled:pointer-events-none"
              )}
              size="lg"
            >
              <span>{isSearching ? 'Searching...' : 'Search'}</span>
              {!isSearching && <ArrowRight size={20} strokeWidth={2} />}
            </Button>
          </div>
        </div>
      </div>

      {/* 3. Progress & Context Section */}
      <AnimatePresence mode="wait">
        {isSearching && searchMode === 'ocr' && ocrProgress ? (
          <motion.div
            key="progress"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-accent/5 rounded-3xl p-6 border border-accent/10"
            role="status"
            aria-live="polite"
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-accent uppercase tracking-widest">
                    OCR Analysis in Progress
                  </p>
                  <p className="text-lg font-medium text-foreground/80 truncate max-w-md">
                    {ocrProgress.currentBook || 'Scanning archives...'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-mono font-bold text-accent">
                    {Math.round((ocrProgress.current / ocrProgress.total) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground uppercase font-bold">
                    Page {ocrProgress.currentPage} of {ocrProgress.total}
                  </p>
                </div>
              </div>
              <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${(ocrProgress.current / ocrProgress.total) * 100}%` }}
                  transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-muted-foreground font-medium">
              {isIndex
                ? 'Searching across indexed records for near-instant results.'
                : 'Using deep-scan technology to find exact text matches within PDF documents.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
