import React from 'react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p>
          <strong>SugarCane</strong> — A project by{' '}
          <a href="https://rt8.co.za" target="_blank" rel="noreferrer">
            Rotate Group (Pty) Ltd
          </a>{' '}
          — Created by Ilyas Shamoon
        </p>
        <p>
          Source: <em>Southern Africa Indian Who's Who (1971–72)</em> — courtesy of the{' '}
          <a href="https://gldc.ukzn.ac.za" target="_blank" rel="noreferrer">
            UKZN Gandhi-Luthuli Documentation Centre
          </a>
        </p>
        <p>
          The first step in reconnecting our community to its deep history. —{' '}
          <a href="mailto:ilyas@rt8.co.za">ilyas@rt8.co.za</a>
          &nbsp;|&nbsp;
          <a href="https://wa.me/27847990432" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </p>
      </div>
    </footer>
  );
}