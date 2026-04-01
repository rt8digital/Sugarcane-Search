# SALT (South African Lineage Tracer) - Project Context

## Project Overview

**SALT** is a high-performance, modular search engine for South Africa's Indian community biographical records. It provides an elegant, scalable interface for traversing history across decades of digitised "Who's Who" volumes (1936-1972).

### Core Purpose
- Archive discovery tool for genealogical research
- Full-text OCR search across scanned PDF documents
- Client-side indexing with smart delta updates
- Research session management with collections and export

### Tech Stack
| Category | Technology |
|----------|------------|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS 4 |
| **Routing** | React Router DOM 7 |
| **Search** | Fuse.js (fuzzy search in Web Worker) |
| **PDF** | PDF.js for text extraction |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |

---

## Project Structure

```
e:\Code\Code\SALT Search\
├── src/
│   ├── components/
│   │   ├── ui/                    # Base UI primitives
│   │   ├── BookFilter.tsx         # Collapsible multi-select dropdown
│   │   ├── Header.tsx             # Fixed pill navbar
│   │   ├── ResultCard.tsx         # Enhanced result display with share
│   │   ├── SearchBar.tsx          # Dual-mode search input
│   │   ├── ResearchPanel.tsx      # Enhanced research workspace
│   │   ├── PdfViewer.tsx          # Lazy-loaded PDF viewer wrapper
│   │   ├── PdfViewerContent.tsx   # Actual PDF viewer implementation
│   │   └── ...
│   ├── datasources/
│   │   └── DataSource.ts          # Modular data source interfaces
│   ├── hooks/
│   │   ├── useSearch.ts           # Dual-mode search (index/OCR)
│   │   ├── usePdfOcrSearch.ts     # Direct PDF text search
│   │   └── useResearch.ts         # Research session management
│   ├── workers/
│   │   └── search.worker.ts       # Enhanced Fuse.js search with scoring
│   ├── utils/
│   │   ├── search.ts              # Snippet generation, deduplication
│   │   └── share.ts               # Shareable links and social cards
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── data/
│   │   └── books.ts               # Volume registry
│   ├── App.tsx                    # Main search interface
│   ├── Router.tsx                 # Code-split routes
│   └── index.css                  # Design system tokens
├── public/
│   ├── indexes/                   # Pre-built JSON indices
│   ├── pdfs/                      # PDF archives (CDN)
│   └── SALT.svg              # Logo
└── scripts/                       # Indexing utilities
```

---

## Key Features

### 1. Dual Search Modes

#### Index Search (Fast, Default)
- Searches pre-built JSON indices via Web Worker
- Fuse.js fuzzy matching with enhanced scoring
- Results in milliseconds
- Prioritizes: surname > full name > given names > profession > year > text

#### Deep OCR Search (Comprehensive)
- Searches raw PDF text directly via PDF.js
- Extracts text on-demand with caching
- Shows progress indicator
- Finds matches in unindexed content

### 2. Enhanced Search Relevance

The search worker (`search.worker.ts`) implements intelligent query parsing:

```typescript
// Automatic detection of:
- Surnames (last word in multi-word queries)
- Given names (first words)
- Professions (doctor, lawyer, teacher, etc.)
- Years (1900-2099)

// Scoring weights:
surname: 5.0      // Highest priority
name: 4.0         // Full name
givenNames: 3.0   // Given names
profession: 2.5   // Occupation
birthYear: 2.0    // Year matches
text: 1.0         // Full text (lowest)
```

### 3. Research Panel

Full-featured research workspace:

- **Collections**: Organize captures into named, color-coded groups
- **Notes**: Per-capture annotations
- **Tags**: Hashtag-style organization
- **Export Options**:
  - Markdown (clipboard)
  - PDF (print dialog)
  - JSON (download file)
- **Filtering**: View by all, collection, or tag
- **Persistence**: localStorage with quota handling

### 4. Shareable Results

- **Share Button**: On each result card (hover to reveal)
- **Shareable Links**: URL with encoded result data
- **Social Cards**: HTML export for sharing
- **Native Share API**: Mobile device integration

### 5. Accessibility

- Keyboard navigation on all interactive elements
- ARIA labels on buttons and regions
- Focus management in modals
- Screen reader friendly structure
- Proper heading hierarchy

### 6. Performance Optimizations

- **Code Splitting**: Routes lazy-loaded
- **Lazy Components**: PDF viewer loaded on-demand
- **Web Workers**: Search runs off main thread
- **Text Caching**: OCR results cached (1-hour TTL)
- **Virtual Lists**: Smooth scrolling with large result sets

---

## Building and Running

```bash
# Install
npm install

# Development
npm run dev

# Production build
npm run build

# Type check
npx tsc --noEmit
```

---

## Data Models

### SearchResult
```typescript
interface SearchResult {
  bookId: string;
  bookTitle: string;
  bookYear: string;
  pdfPath: string;
  page: number;
  snippet: string;
  score: number;
  matchedTerms: string[];
  type?: 'page' | 'record';
  record?: BiographicalRecord;
}
```

### BiographicalRecord
```typescript
interface BiographicalRecord {
  fullName: string;
  profession?: string;
  birthDate?: string;
  birthPlace?: string;
  education?: string;
  family?: string;
  career?: string;
  achievements?: string;
  address?: string;
  rawText: string;
}
```

### Research Capture
```typescript
interface ResearchCapture {
  id: string;
  image: string;          // Base64 screenshot
  timestamp: string;
  bookTitle?: string;
  bookYear?: string;
  page?: number;
  notes?: string;
  collectionId?: string;
  tags?: string[];
}
```

---

## Common Search Patterns

The search engine is optimized for these query types:

| Query Type | Example | Boost Applied |
|------------|---------|---------------|
| Surname | "Pillay" | Surname weight (5.0) |
| Full Name | "Ashwin Choudree" | Name + surname boost |
| Name + Year | "Dada 1940" | Name + year boost |
| Profession | "attorney" | Profession boost |
| Complex | "Naidoo doctor 1960" | Surname + profession + year |

---

## Modular Data Sources

The `DataSource` interface allows adding new backends:

```typescript
interface DataSource {
  id: string;
  name: string;
  isAvailable: boolean;
  search(query, options): Promise<DataSourceResult[]>;
  getMetadata(): DataSourceMetadata;
  dispose?(): void;
}

// Implementations:
// - JsonIndexDataSource (pre-built indices)
// - PdfOcrDataSource (direct PDF search)
// - CompositeDataSource (aggregates multiple)
```

---

## Design Tokens

```css
--sa-red:    #E03C31
--sa-green:  #007749
--sa-yellow: #FFB81C
--sa-blue:   #001489

--font-display: 'DM Serif Display'
--font-body:  'Inter'
--font-lora:  'Lora'
```

---

## Credits

- **Created by**: [Rotate Group (Pty) Ltd](https://rt8.co.za)
- **Lead Developer**: Ilyas Shamoon
- **Design Language**: Heritage Glassmorphism v2.3
- **Documents**: UKZN Gandhi-Luthuli Documentation Centre
