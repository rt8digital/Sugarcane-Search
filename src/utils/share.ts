/**
 * Shareable Results Utility
 * 
 * Generates shareable links and export cards for search results
 */

import { SearchResult } from '../types';

/**
 * Generate a shareable URL for a specific result
 */
export function generateShareableLink(result: SearchResult): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  
  params.set('result', JSON.stringify({
    bookId: result.bookId,
    page: result.page,
    type: result.type
  }));
  
  if (result.matchedTerms?.length) {
    params.set('q', result.matchedTerms.join(' '));
  }
  
  return `${baseUrl}/?${params.toString()}`;
}

/**
 * Generate a shareable URL for a search query
 */
export function generateSearchShareLink(query: string, bookIds?: string[]): string {
  const baseUrl = window.location.origin;
  const params = new URLSearchParams();
  
  params.set('q', query);
  
  if (bookIds?.length) {
    params.set('books', bookIds.join(','));
  }
  
  return `${baseUrl}/?${params.toString()}`;
}

/**
 * Create an HTML card for social media sharing
 */
export function createShareCard(result: SearchResult): string {
  const name = result.record?.fullName || 'Archival Record';
  const profession = result.record?.profession || '';
  const birthDate = result.record?.birthDate || '';
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SALT - ${name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #E03C31 0%, #001489 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      max-width: 500px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #007749, #001489);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
    }
    .brand {
      font-size: 14px;
      color: #666;
    }
    .brand strong {
      display: block;
      font-size: 18px;
      color: #333;
    }
    .name {
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 16px;
    }
    .details {
      display: grid;
      gap: 12px;
      margin-bottom: 24px;
    }
    .detail {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #555;
      font-size: 14px;
    }
    .detail-icon {
      width: 20px;
      height: 20px;
      background: #f0f0f0;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .source {
      border-top: 1px solid #eee;
      padding-top: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .source-info {
      font-size: 13px;
      color: #666;
    }
    .source-info strong {
      display: block;
      color: #333;
      font-size: 14px;
    }
    .page-badge {
      background: #007749;
      color: white;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .footer {
      margin-top: 24px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">S</div>
      <div class="brand">
        <strong>SALT</strong>
        South African Lineage Tracer
      </div>
    </div>
    
    <h1 class="name">${escapeHtml(name)}</h1>
    
    <div class="details">
      ${profession ? `
        <div class="detail">
          <span class="detail-icon">💼</span>
          <span>${escapeHtml(profession)}</span>
        </div>
      ` : ''}
      ${birthDate ? `
        <div class="detail">
          <span class="detail-icon">📅</span>
          <span>${escapeHtml(birthDate)}</span>
        </div>
      ` : ''}
    </div>
    
    <div class="source">
      <div class="source-info">
        <strong>${escapeHtml(result.bookTitle)}</strong>
        ${result.bookYear ? `Edition ${result.bookYear}` : ''}
      </div>
      <span class="page-badge">Page ${result.page}</span>
    </div>
    
    <div class="footer">
      Discover your heritage at salt.rt8.co.za
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Open share dialog with result card
 */
export async function shareResult(result: SearchResult): Promise<void> {
  const shareData = {
    title: `SALT - ${result.record?.fullName || 'Archival Record'}`,
    text: `Found in SALT Archive: ${result.bookTitle}, Page ${result.page}`,
    url: generateShareableLink(result)
  };

  // Try native share API first
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (err) {
      if ((err as Error).name === 'AbortError') {
        return; // User cancelled
      }
      // Fall through to fallback
    }
  }

  // Fallback: copy link to clipboard
  try {
    await navigator.clipboard.writeText(shareData.url);
    alert('Link copied to clipboard!');
  } catch {
    // Last resort: open in new window
    window.open(shareData.url, '_blank');
  }
}

/**
 * Download share card as image
 */
export async function downloadShareCard(result: SearchResult): Promise<void> {
  const html = createShareCard(result);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `salt-${(result.record?.fullName || 'record').toLowerCase().replace(/\s+/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generate Open Graph meta tags for a result (for server-side rendering)
 */
export function generateOpenGraphTags(result: SearchResult): string {
  const name = result.record?.fullName || 'Archival Record';
  const description = result.record?.profession 
    ? `${name} - ${result.record.profession}`
    : name;
  
  return `
<meta property="og:title" content="${escapeHtml(name)} | SALT Archive">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:type" content="article">
<meta property="og:url" content="${generateShareableLink(result)}">
<meta property="og:image" content="/api/og-image?bookId=${result.bookId}&page=${result.page}">
<meta name="twitter:card" content="summary_large_image">
  `.trim();
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
