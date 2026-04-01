import React, { useState, useMemo } from 'react';
import { BookOpen, Filter, Check, ChevronDown, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Book } from '@/types';
import { Button } from '@/components/ui/button';

interface BookFilterProps {
  books: Book[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export function BookFilter({ books, selectedIds, onToggle }: BookFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const booksByYear = useMemo(() => {
    const grouped = new Map<string, Book[]>();
    books.forEach((book) => {
      const yearGroup = grouped.get(book.year) || [];
      yearGroup.push(book);
      grouped.set(book.year, yearGroup);
    });
    return new Map(
      [...grouped.entries()].sort((a, b) => Number(a[0]) - Number(b[0]))
    );
  }, [books]);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const query = searchQuery.toLowerCase();
    return books.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.year.includes(query)
    );
  }, [books, searchQuery]);

  const filteredYears = useMemo(() => {
    if (!searchQuery.trim()) return booksByYear;
    const grouped = new Map<string, Book[]>();
    filteredBooks.forEach((book) => {
      const yearGroup = grouped.get(book.year) || [];
      yearGroup.push(book);
      grouped.set(book.year, yearGroup);
    });
    return grouped;
  }, [filteredBooks, searchQuery]);

  const selectedCount = selectedIds.length;
  const allSelected = selectedCount === books.length;

  const handleSelectAll = () => {
    if (allSelected) {
      books.forEach((book) => onToggle(book.id));
    } else {
      books.forEach((book) => {
        if (!selectedIds.includes(book.id)) {
          onToggle(book.id);
        }
      });
    }
  };

  const handleClearAll = () => {
    selectedIds.forEach((id) => onToggle(id));
  };

  return (
    <div className="w-full flex flex-col items-center space-y-4">
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
        <Filter size={14} strokeWidth={1.5} />
        <span>Filter Archives</span>
      </div>

      {/* Dropdown Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full max-w-2xl flex items-center justify-between px-6 py-4 rounded-xl border-2 transition-all duration-200 shadow-sm hover:shadow-md',
          isOpen
            ? 'bg-primary/5 border-primary/50'
            : 'bg-card border-border hover:border-primary/40 hover:bg-muted/50'
        )}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div
            className={cn(
              'p-3 rounded-xl transition-colors duration-200 shrink-0 shadow-sm',
              isOpen
                ? 'bg-primary text-primary-foreground'
                : 'bg-primary/5 text-primary'
            )}
          >
            <BookOpen size={20} strokeWidth={2} />
          </div>
          <div className="flex flex-col items-start min-w-0 flex-1">
            <span className="text-sm font-bold text-foreground truncate">
              {selectedCount === 0
                ? 'Select volumes to search'
                : selectedCount === books.length
                ? 'All volumes selected'
                : `${selectedCount} volume${selectedCount > 1 ? 's' : ''} selected`}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mt-0.5">
              {books.length} archives available
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {selectedCount > 0 && (
            <span className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm shrink-0">
              {selectedCount}
            </span>
          )}
          <ChevronDown
            size={20}
            strokeWidth={2}
            className={cn(
              'text-muted-foreground transition-transform duration-200 shrink-0',
              isOpen ? 'rotate-180' : ''
            )}
          />
        </div>
      </motion.button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl overflow-hidden"
            role="dialog"
            aria-label="Filter archives"
          >
            {/* Search & Actions Bar */}
            <div className="flex items-center gap-4 p-5 border-b border-border bg-muted/50">
              <div className="relative flex-1 min-w-0">
                <Search
                  size={18}
                  strokeWidth={2}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 shrink-0"
                />
                <input
                  type="text"
                  placeholder="Search by title or year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-11 py-3.5 bg-card border-2 border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200 truncate"
                  aria-label="Search archives"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                    aria-label="Clear search"
                    type="button"
                  >
                    <X size={18} strokeWidth={2} />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="default"
                  onClick={handleSelectAll}
                  className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
                >
                  {allSelected ? 'None' : 'All'}
                </Button>
                {selectedCount > 0 && (
                  <Button
                    variant="ghost"
                    size="default"
                    onClick={handleClearAll}
                    className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap text-muted-foreground"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Books List */}
            <div className="max-h-[450px] overflow-y-auto p-5 space-y-5 scrollbar-thin">
              {filteredYears.size === 0 ? (
                <div className="text-center py-16">
                  <BookOpen
                    size={48}
                    strokeWidth={1.5}
                    className="mx-auto text-muted-foreground/20 mb-4"
                  />
                  <p className="text-sm font-medium text-muted-foreground">
                    No archives match your search
                  </p>
                </div>
              ) : (
                Array.from(filteredYears.entries()).map(([year, yearBooks]) => (
                  <div key={year} className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 whitespace-nowrap">
                        Edition {year}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {yearBooks.map((book) => {
                        const isSelected = selectedIds.includes(book.id);
                        return (
                          <motion.button
                            key={book.id}
                            onClick={() => onToggle(book.id)}
                            className={cn(
                              'group flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left min-w-0 shadow-sm hover:shadow-md',
                              isSelected
                                ? 'bg-primary/5 border-primary/50'
                                : 'bg-card border-border hover:border-primary/40 hover:bg-muted/50'
                            )}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-pressed={isSelected}
                          >
                            <div
                              className={cn(
                                'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors duration-200 shrink-0',
                                isSelected
                                  ? 'bg-primary border-primary'
                                  : 'border-border group-hover:border-primary/40'
                              )}
                            >
                              {isSelected && (
                                <Check
                                  size={12}
                                  className="text-primary-foreground"
                                  strokeWidth={3}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-bold text-foreground truncate block">
                                {book.title}
                              </span>
                              {book.subtitle && (
                                <span className="text-xs text-muted-foreground/70 truncate block mt-1 font-medium">
                                  {book.subtitle}
                                </span>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-muted/50">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap">
                {selectedCount} of {books.length} volumes selected
              </span>
              <Button
                variant="primary"
                size="default"
                onClick={() => setIsOpen(false)}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider whitespace-nowrap"
              >
                Done
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
