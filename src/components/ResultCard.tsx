import React from 'react';
import {
  MapPin,
  Briefcase,
  Calendar,
  BookOpen,
  ExternalLink,
  User,
  Share2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchResult } from '../types';
import { shareResult } from '../utils/share';
import { cn } from '@/lib/utils';

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onClick: (res: SearchResult) => void;
}

export function ResultCard({ result, index, onClick }: ResultCardProps) {
  const { bookTitle, page, matchedTerms, record } = result;

  const fullName = record?.fullName || '';
  const profession = record?.profession || '';
  const birthDate = record?.birthDate || '';
  const address = record?.address || '';
  const education = record?.education || '';

  const nameParts = fullName.trim().split(/\s+/);
  const surname = nameParts.length > 1 ? nameParts.pop() : '';
  const givenNames = nameParts.join(' ');

  const highlightText = (text: string, maxLength: number = 0) => {
    if (!matchedTerms || matchedTerms.length === 0) return text;

    let displayText = text;
    if (maxLength > 0 && text.length > maxLength) {
      displayText = text.slice(0, maxLength).trim() + '...';
    }

    const regex = new RegExp(
      `(${matchedTerms
        .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('|')})`,
      'gi'
    );
    const parts = displayText.split(regex);

    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          className="bg-primary/20 text-foreground font-semibold px-1.5 rounded-sm"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const hasMetadata = profession || birthDate || address || education;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(0.4, index * 0.06), duration: 0.5 }}
      onClick={() => onClick(result)}
      className={cn(
        'group relative bg-card rounded-lg border border-border p-8 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer active:scale-[0.995] overflow-hidden'
      )}
      role="article"
      aria-label={`Search result for ${fullName || 'archival record'}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(result);
        }
      }}
    >
      {/* Share Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          shareResult(result);
        }}
        className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-all opacity-0 group-hover:opacity-100 z-10"
        aria-label="Share this result"
        title="Share this result"
        type="button"
      >
        <Share2 size={16} strokeWidth={1.5} />
      </button>

      <div className="flex justify-between items-start gap-8">
        <div className="space-y-5 flex-1 min-w-0">
          {/* Header: Source */}
          <div className="flex flex-col">
            <span className="text-[9px] font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2.5">
              <BookOpen size={11} strokeWidth={1.5} className="shrink-0" />
              <span className="truncate">{bookTitle}</span>
            </span>

            {fullName ? (
              <div className="flex flex-wrap items-baseline gap-x-4 min-w-0">
                {givenNames && (
                  <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors truncate font-display">
                    {highlightText(givenNames)}
                  </h3>
                )}
                {surname && (
                  <h3 className="text-xl font-bold text-primary group-hover:text-foreground transition-colors uppercase truncate font-display">
                    {highlightText(surname)}
                  </h3>
                )}
              </div>
            ) : (
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors font-display">
                {highlightText('Archival Record')}
              </h3>
            )}
          </div>

          {/* Metadata Grid */}
          {hasMetadata && (
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
              {profession && (
                <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                  <Briefcase
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 opacity-70"
                  />
                  <span className="text-sm font-medium truncate">
                    {highlightText(profession, 50)}
                  </span>
                </div>
              )}
              {birthDate && (
                <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                  <Calendar
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 opacity-70"
                  />
                  <span className="text-sm font-medium">
                    {highlightText(birthDate, 40)}
                  </span>
                </div>
              )}
              {address && (
                <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                  <MapPin
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 opacity-70"
                  />
                  <span className="text-sm font-medium truncate">
                    {highlightText(address, 50)}
                  </span>
                </div>
              )}
              {education && (
                <div className="flex items-center gap-3 text-muted-foreground min-w-0">
                  <User
                    size={14}
                    strokeWidth={1.5}
                    className="shrink-0 opacity-70"
                  />
                  <span className="text-sm font-medium truncate">
                    {highlightText(education, 50)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Snippet for page-level results */}
          {!record && result.snippet && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-lora">
              {highlightText(result.snippet, 200)}
            </p>
          )}
        </div>

        {/* Action Indicator */}
        <div className="flex flex-col items-end gap-4 self-center shrink-0">
          <div
            className={cn(
              'w-12 h-12 rounded-md flex items-center justify-center transition-all duration-200 shadow-sm border shrink-0',
              record
                ? 'bg-primary/5 text-primary border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary'
                : 'bg-muted text-muted-foreground border-border group-hover:bg-foreground group-hover:text-primary-foreground group-hover:border-foreground'
            )}
          >
            <ExternalLink size={17} strokeWidth={2} className="shrink-0" />
          </div>
          <div className="text-right shrink-0">
            <span className="text-[8px] font-semibold uppercase tracking-widest text-muted-foreground/60 block mb-1">
              Page
            </span>
            <span className="text-sm font-bold text-foreground">{page}</span>
          </div>
        </div>
      </div>

      {/* Left Accent Bar on Hover */}
      <div
        className={cn(
          'absolute left-0 top-0 bottom-0 w-1 transition-transform duration-200 origin-top',
          record ? 'bg-primary' : 'bg-muted-foreground'
        )}
      />
    </motion.div>
  );
}
