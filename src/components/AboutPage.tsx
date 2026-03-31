import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export function AboutPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const goSearch = () => {
    setSearchParams({});
  };

  return (
    <div className="about-page">
      <div className="about-hero">
        <button className="back-btn" onClick={goSearch}>
          <ArrowLeft size={18} /> Back to Search
        </button>
        
        <motion.div 
          className="about-intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>About SugarCane</h1>
          <p className="about-subtitle">
            A digital heritage search engine for South Africa's Indian community
          </p>
        </motion.div>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>What is SugarCane?</h2>
          <p>
            SugarCane is a historical search engine that makes it easy to explore the 
            lives of South Africa's Indian community through decades of biographical records. 
            It provides fast, full-text search across multiple editions of the 
            <em> Who's Who</em> directories spanning from 1936 to 1972.
          </p>
          <p>
            These digitized records include biographies, business directories, and family 
            histories that document the achievements, trades, and communities of Indian 
            South Africans during a transformative period in our nation's history.
          </p>
        </section>

        <section className="about-section">
          <h2>Why We Built This</h2>
          <p>
            For many South Africans of Indian descent, tracing family history is a profound 
            journey into the roots of a resilient community. These records—compiled across 
            decades—represent the largest collection of biographical information about Indian 
            South Africans ever assembled.
          </p>
          <p>
            Traditional archival research requires physical access to rare books, often 
            locked away in university libraries. SugarCane democratizes this access, allowing 
            anyone with an internet connection to search, discover, and connect with their heritage.
          </p>
        </section>

        <section className="about-section">
          <h2>Data Sources</h2>
          <ul className="source-list">
            <li><strong>Who's Who (1936-37)</strong> — The earliest known edition</li>
            <li><strong>South African Indian Who's Who (1940)</strong> — Including commercial directory</li>
            <li><strong>South African Indian Who's Who (1960)</strong> — Mid-century comprehensive edition</li>
            <li><strong>Southern Africa Indian Who's Who (1971-72)</strong> — The most complete edition</li>
          </ul>
          <p className="source-credit">
            Original documents courtesy of the{' '}
            <a href="https://gldc.ukzn.ac.za" target="_blank" rel="noreferrer">
              UKZN Gandhi-Luthuli Documentation Centre
            </a>
          </p>
        </section>

        <section className="about-section">
          <h2>Technology</h2>
          <p>
            SugarCane uses modern web technologies to deliver fast, responsive search across 
            thousands of pages. The entire archive is indexed client-side, enabling instant 
            results without server round-trips. PDF documents are rendered on-demand for 
            detailed viewing.
          </p>
        </section>

        <section className="about-section reviews-section">
          <h2>What People Say</h2>
          <div className="reviews-grid">
            <div className="review-card">
              <Quote size={20} className="quote-icon" />
              <p className="review-text">
                An invaluable resource for anyone researching their family history in South Africa.
              </p>
              <div className="review-rating">
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
              </div>
            </div>
            <div className="review-card">
              <Quote size={20} className="quote-icon" />
              <p className="review-text">
                Finally, a way to access these historical records without visiting archives in person.
              </p>
              <div className="review-rating">
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
              </div>
            </div>
            <div className="review-card">
              <Quote size={20} className="quote-icon" />
              <p className="review-text">
                Beautiful interface and incredibly fast search. A tribute to our community's history.
              </p>
              <div className="review-rating">
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
                <Star size={14} fill="#b06820" stroke="#b06820" />
              </div>
            </div>
          </div>
          <p className="reviews-note">
            Have you used SugarCane? We'd love your feedback.{' '}
            <a href="https://search.google.com/search?q=SugarCane+heritage+search" target="_blank" rel="noreferrer">
              Leave a review on Google
            </a>
          </p>
        </section>

        <section className="about-section">
          <h2>Contact & Credits</h2>
          <p>
            SugarCane is a project by{' '}
            <a href="https://rt8.co.za" target="_blank" rel="noreferrer">
              Rotate Group (Pty) Ltd
            </a>
            <br />
            Created by <strong>Ilyas Shamoon</strong>
          </p>
          <p>
            <a href="mailto:ilyas@rt8.co.za">ilyas@rt8.co.za</a>
            <br />
            <a href="https://wa.me/27847990432" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
