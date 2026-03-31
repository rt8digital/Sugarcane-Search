import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const location = useLocation();
  const isAbout = location.pathname === '/about';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" style={{ textDecoration: 'none' }}>
          <svg width="34" height="34" viewBox="0 0 38 38" fill="none" aria-hidden="true">
            <path
              d="M19 4 C15 9 11 14 13 22 C15 30 19 34 19 34 C19 34 23 30 25 22 C27 14 23 9 19 4Z"
              fill="#3d6b30"
              opacity=".9"
            />
            <line x1="19" y1="4" x2="19" y2="34" stroke="#2d5018" strokeWidth="1.4" />
            <path d="M15 11 Q19 13 23 11" stroke="#2d5018" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M13 18 Q19 20 25 18" stroke="#2d5018" strokeWidth="1.1" strokeLinecap="round" fill="none" />
            <path d="M14 25 Q19 27 24 25" stroke="#2d5018" strokeWidth="1.1" strokeLinecap="round" fill="none" />
          </svg>
          <div>
            <h1 className="brand-name">SugarCane</h1>
            <p className="brand-tagline">Trace your roots. Honour their journey.</p>
          </div>
        </Link>
        <nav className="header-nav">
          <Link to="/" className={`nav-link ${!isAbout ? 'active' : ''}`}>
            Search
          </Link>
          <Link to="/about" className={`nav-link ${isAbout ? 'active' : ''}`}>
            About
          </Link>
        </nav>
      </div>
    </header>
  );
}
