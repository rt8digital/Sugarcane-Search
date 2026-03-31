# SugarCane Search

A high-performance heritage search engine for South Africa's Indian community biographical records. SugarCane provides fast, full-text search across multiple editions of the "Who's Who" directories spanning 1936 to 1972.

![SugarCane Search](./public/sugarcane.svg)

## Features

- **Instant Client-Side Search** - Fuse.js powered fuzzy search with web workers
- **PDF OCR Integration** - Search through scanned documents with extracted text
- **IndexedDB Caching** - Persisted indexes for faster subsequent loads
- **Historical Records** - Biographies, business directories, and family histories
- **Responsive Design** - Heritage-themed UI with modern UX

## Data Sources

| Edition | Years Covered | Parts |
|---------|--------------|-------|
| Who's Who | 1936-37 | 4 volumes |
| South African Indian Who's Who | 1940 | 8 volumes |
| South African Indian Who's Who | 1960 | 9 volumes |
| Southern Africa Indian Who's Who | 1971-72 | 11 volumes |

Original documents courtesy of the [UKZN Gandhi-Luthuli Documentation Centre](https://gldc.ukzn.ac.za).

## Architecture

```
src/
├── components/       # React UI components
│   ├── SearchBar.tsx    # Main search input
│   ├── ResultCard.tsx   # Search result display
│   ├── PdfViewer.tsx    # PDF document viewer
│   ├── BookFilter.tsx   # Source filtering dropdown
│   ├── AboutPage.tsx    # About & history page
│   └── Header.tsx       # Navigation header
├── hooks/            # Custom React hooks
│   ├── useSearch.ts     # Search logic & web worker
│   └── usePdfIndex.ts   # PDF indexing & caching
├── utils/            # Utility functions
│   ├── parser.ts        # Biographical record parser
│   ├── search.ts        # Result processing
│   └── db.ts            # IndexedDB wrapper
├── workers/          # Web Workers
│   └── search.worker.ts # Background search processing
├── data/
│   └── books.ts         # PDF registry
└── types/             # TypeScript definitions
```

### Search Pipeline

1. **PDF Indexing** (`usePdfIndex.ts`)
   - Checks IndexedDB cache first
   - Falls back to fetching PDF + extracting text via pdf.js
   - Parses biographical records from OCR text
   - Stores compiled index in IndexedDB

2. **Search Execution** (`useSearch.ts`)
   - Web Worker receives compiled index data
   - Fuse.js performs fuzzy matching
   - Results streamed back to main thread
   - Snippets generated with highlight matched terms

3. **PDF Viewing** (`PdfViewer.tsx`)
   - On-demand PDF rendering via pdf.js
   - Page navigation & zoom controls
   - Highlights search terms on page

## Performance

- **First Load**: PDFs parsed client-side (~30s for full archive)
- **Subsequent Visits**: IndexedDB cache loads instantly
- **Pre-generated Indexes**: Run `node scripts/index-pdfs.mjs` to generate JSON indexes for fastest deployment

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Fuse.js** - Fuzzy search
- **pdf.js** - PDF rendering & text extraction
- **IndexedDB** - Browser caching
- **Framer Motion** - Animations
- **React Router** - Navigation

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Generate pre-computed indexes (optional, for faster loads)
# Run while dev server is running in another terminal
node scripts/index-pdfs.mjs
```

## Environment

The app expects PDF files in `public/pdfs/` following this naming convention:
- `{Title}_{Year}_{Part}_{Section}_ocr.pdf`

Example: `Whos_Who_1936_37_pt1_Preface_ocr.pdf`

## License

MIT License - Created by [Rotate Group (Pty) Ltd](https://rt8.co.za)

## Contact

- Email: ilyas@rt8.co.za
- WhatsApp: +27 84 799 0432
