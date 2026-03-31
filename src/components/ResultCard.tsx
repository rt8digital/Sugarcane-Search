import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, FileText, User, Briefcase, Calendar } from 'lucide-react';
import { SearchResult } from '../types';
import { highlightSnippet } from '../utils/search';

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onClick: (result: SearchResult) => void;
}

export function ResultCard({ result, index, onClick }: ResultCardProps) {
  const isRecord = result.type === 'record' && result.record;
  const highlightedSnippet = highlightSnippet(result.snippet, result.matchedTerms);
  const highlightedName = isRecord ? highlightSnippet(result.record!.fullName, result.matchedTerms) : '';

  return (
    <motion.article
      className={`result-card ${isRecord ? 'record-type' : 'page-type'}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.04, 0.4) }}
      onClick={() => onClick(result)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(result)}
    >
      {/* Header / Breadcrumb */}
      <div className="result-header">
        <div className="result-breadcrumb">
          <BookOpen size={12} />
          <span>{result.bookTitle}</span>
          <span className="breadcrumb-sep">·</span>
          <span className="result-year">{result.bookYear}</span>
        </div>
        <div className="result-page-tag">
          <FileText size={12} />
          <span>Page {result.page}</span>
        </div>
      </div>

      {isRecord ? (
        <div className="record-content">
          <h3 className="record-name" dangerouslySetInnerHTML={{ __html: highlightedName || result.record!.fullName }} />
          
          <div className="record-meta">
            {result.record!.profession && (
              <div className="meta-item profession">
                <Briefcase size={14} />
                <span>{result.record!.profession}</span>
              </div>
            )}
            {result.record!.birthDate && (
              <div className="meta-item date">
                <Calendar size={14} />
                <span>Born: {result.record!.birthDate}</span>
              </div>
            )}
          </div>

          <p className="record-snippet" dangerouslySetInnerHTML={{ __html: highlightedSnippet }} />
        </div>
      ) : (
        <div className="page-content">
          <p className="page-snippet" dangerouslySetInnerHTML={{ __html: highlightedSnippet }} />
        </div>
      )}

      <div className="result-footer">
        <span className="result-cta">View OCR Document →</span>
        <div className="result-meta-right">
          <span className="result-score">Match: {Math.round((1 - result.score) * 100)}%</span>
        </div>
      </div>
    </motion.article>
  );
}
