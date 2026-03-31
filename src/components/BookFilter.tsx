import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Book } from '../types';

interface BookFilterProps {
  books: Book[];
  selectedBooks: string[];
  loadedBooks: string[];
  onChange: (selected: string[]) => void;
}

export function BookFilter({ books, selectedBooks, loadedBooks, onChange }: BookFilterProps) {
  if (books.length <= 1) return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'all') {
      onChange([]);
    } else {
      onChange([value]);
    }
  };

  const currentValue = selectedBooks.length === 0 ? 'all' : selectedBooks[0];

  return (
    <div className="book-filter-dropdown">
      <select 
        value={currentValue}
        onChange={handleChange}
        className="book-select"
      >
        <option value="all">All Sources</option>
        {books.map((book) => (
          <option 
            key={book.id} 
            value={book.id}
            disabled={!loadedBooks.includes(book.id)}
          >
            {book.subtitle ?? book.title} ({book.year})
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="dropdown-icon" />
    </div>
  );
}
