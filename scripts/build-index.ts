/**
 * Pre-build script: Extracts text from all local PDFs and creates a search index JSON file.
 * 
 * Usage: npx tsx scripts/build-index.ts
 * Output: public/search-index.json
 */
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { parsePage } from '../src/utils/parser.js';
import { BookIndex } from '../src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamically import pdfjs-dist (CJS) and set up Node.js-compatible worker
const pdfjsLib = await import('pdfjs-dist');
// Point to the worker file for Node.js
pdfjsLib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../node_modules/pdfjs-dist/build/pdf.worker.min.js');

const BASE_URL = 'https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/pdfs';

interface BookEntry {
  id: string;
  title: string;
  year: string;
  pdfPath: string;
  localFile: string;
}

const BOOKS: BookEntry[] = [
  { id: 'whoswho_1936_pt1', title: "Who's Who 1936-37 (Preface)", year: '1936', pdfPath: `${BASE_URL}/Whos_Who_1936_37_pt1_Preface.pdf`, localFile: 'Whos_Who_1936_37_pt1_Preface.pdf' },
  { id: 'whoswho_1936_pt2', title: "Who's Who 1936-37 (A-I)", year: '1936', pdfPath: `${BASE_URL}/Whos_Who_1936_37_pt2_A_I.pdf`, localFile: 'Whos_Who_1936_37_pt2_A_I.pdf' },
  { id: 'whoswho_1936_pt4', title: "Who's Who 1936-37 (O-Z)", year: '1936', pdfPath: `${BASE_URL}/Whos_Who_1936_37_pt4_O_Z.pdf`, localFile: 'Whos_Who_1936_37_pt4_O_Z.pdf' },
  { id: 'whoswho_1936_pt5', title: "Who's Who 1936-37 (A-Z Mixed)", year: '1936', pdfPath: `${BASE_URL}/Whos_Who_1936_37_pt5_A_Z_Mixed.pdf`, localFile: 'Whos_Who_1936_37_pt5_A_Z_Mixed.pdf' },
  { id: 'whoswho_1940_pt1', title: "Who's Who 1940 (Preface)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt1_Preface.pdf`, localFile: 'Whos_Who_1940_pt1_Preface.pdf' },
  { id: 'whoswho_1940_pt2', title: "Who's Who 1940 (A-K)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt2_A_K.pdf`, localFile: 'Whos_Who_1940_pt2_A_K.pdf' },
  { id: 'whoswho_1940_pt3', title: "Who's Who 1940 (L-Q)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt3_L_Q.pdf`, localFile: 'Whos_Who_1940_pt3_L_Q.pdf' },
  { id: 'whoswho_1940_pt4', title: "Who's Who 1940 (R-Z)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt4_R_Z.pdf`, localFile: 'Whos_Who_1940_pt4_R_Z.pdf' },
  { id: 'whoswho_1940_pt5', title: "Who's Who 1940 (A-Z)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt5_A_Z.pdf`, localFile: 'Whos_Who_1940_pt5_A_Z.pdf' },
  { id: 'whoswho_1940_pt7', title: "Who's Who 1940 (A-Z Part 2)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt7_A_Z.pdf`, localFile: 'Whos_Who_1940_pt7_A_Z.pdf' },
  { id: 'whoswho_1940_pt8', title: "Who's Who 1940 (Commercial Directory)", year: '1940', pdfPath: `${BASE_URL}/Whos_Who_1940_pt8_Com_dir.pdf`, localFile: 'Whos_Who_1940_pt8_Com_dir.pdf' },
  { id: 'whoswho_1960_pt1', title: "SA Indian Who's Who 1960 (Preface)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_Pt1_preface.pdf`, localFile: 'South_African_Indian_Who_Who_1960_Pt1_preface.pdf' },
  { id: 'whoswho_1960_pt2', title: "SA Indian Who's Who 1960 (A-B)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt2_A_B.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt2_A_B.pdf' },
  { id: 'whoswho_1960_pt3', title: "SA Indian Who's Who 1960 (C-F)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt3_C_F.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt3_C_F.pdf' },
  { id: 'whoswho_1960_pt4', title: "SA Indian Who's Who 1960 (G-J)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt4_G_J.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt4_G_J.pdf' },
  { id: 'whoswho_1960_pt5', title: "SA Indian Who's Who 1960 (K-M)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt5_K_M.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt5_K_M.pdf' },
  { id: 'whoswho_1960_pt6', title: "SA Indian Who's Who 1960 (N-O)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt6_N_O.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt6_N_O.pdf' },
  { id: 'whoswho_1960_pt7', title: "SA Indian Who's Who 1960 (P-R)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt7_P_R.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt7_P_R.pdf' },
  { id: 'whoswho_1960_pt8', title: "SA Indian Who's Who 1960 (S-Z)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt8_S_Z.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt8_S_Z.pdf' },
  { id: 'whoswho_1960_pt9', title: "SA Indian Who's Who 1960 (A-Z Mixed)", year: '1960', pdfPath: `${BASE_URL}/South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed.pdf`, localFile: 'South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed.pdf' },
  { id: 'whoswho_1971_compressed', title: "SA Indian Who's Who 1971-72 (Full)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_compressed.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_compressed.pdf' },
  { id: 'whoswho_1971_pt4', title: "SA Indian Who's Who 1971-72 (E-G)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G.pdf' },
  { id: 'whoswho_1971_pt5', title: "SA Indian Who's Who 1971-72 (H-J)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J.pdf' },
  { id: 'whoswho_1971_pt6', title: "SA Indian Who's Who 1971-72 (K-ME)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME.pdf' },
  { id: 'whoswho_1971_pt7', title: "SA Indian Who's Who 1971-72 (MI-O)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O.pdf' },
  { id: 'whoswho_1971_pt8', title: "SA Indian Who's Who 1971-72 (P-R)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R.pdf' },
  { id: 'whoswho_1971_pt9', title: "SA Indian Who's Who 1971-72 (S-Z)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z.pdf' },
  { id: 'whoswho_1971_pt10', title: "SA Indian Who's Who 1971-72 (A-Z Mixed)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed.pdf' },
  { id: 'whoswho_1971_pt11', title: "SA Indian Who's Who 1971-72 (A-Z Other)", year: '1971', pdfPath: `${BASE_URL}/Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other.pdf`, localFile: 'Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other.pdf' },
];

// Find the local PDFs directory
const possiblePaths = [
  path.resolve(__dirname, '../public/pdfs'),
  path.resolve(__dirname, '../../../Tealeaf Search/public/pdfs'),
];

let pdfsDir = possiblePaths.find(p => fs.existsSync(p));

if (!pdfsDir) {
  console.error('Could not find PDFs directory. Searched:');
  possiblePaths.forEach(p => console.error('  - ' + p));
  process.exit(1);
}

console.log('Using PDFs from: ' + pdfsDir);

async function extractTextFromPdf(pdfPath: string): Promise<{ numpages: number; pages: Array<{ page: number; text: string; words: string[] }> }> {
  const buffer = new Uint8Array(fs.readFileSync(pdfPath));
  const loadingTask = pdfjsLib.getDocument({ data: buffer });
  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const pages: Array<{ page: number; text: string; words: string[] }> = [];

  console.log('  PDF: ' + path.basename(pdfPath) + ' - ' + totalPages + ' pages');

  for (let p = 1; p <= totalPages; p++) {
    const page = await pdf.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((item: any) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (text.length > 0) {
      const parsed = parsePage(text, p);
      pages.push({ page: p, text: parsed.text, words: parsed.words });
    }

    if (p % 50 === 0 || p === totalPages) {
      process.stdout.write('    Progress: ' + p + '/' + totalPages + '\r');
    }
  }
  console.log();

  return { numpages: totalPages, pages };
}

async function main() {
  console.log('Building search index...\n');

  const allIndexes: Record<string, BookIndex> = {};
  let totalFiles = 0;
  let totalPages = 0;

  for (const book of BOOKS) {
    const pdfFilePath = path.join(pdfsDir!, book.localFile);

    if (!fs.existsSync(pdfFilePath)) {
      console.warn('Skipping ' + book.id + ' - file not found: ' + book.localFile);
      continue;
    }

    try {
      const { numpages, pages } = await extractTextFromPdf(pdfFilePath);

      allIndexes[book.id] = {
        bookId: book.id,
        title: book.title,
        totalPages: numpages,
        indexedAt: new Date().toISOString(),
        pages,
      };

      totalFiles++;
      totalPages += numpages;
    } catch (err: any) {
      console.error('Error processing ' + book.id + ': ' + err.message);
    }
  }

  // Output to src/data/ for bundling (always)
  const srcOutputPath = path.resolve(__dirname, '../src/data/search-index.json');
  fs.writeFileSync(srcOutputPath, JSON.stringify(allIndexes));
  const srcStats = fs.statSync(srcOutputPath);
  const srcSizeMB = (srcStats.size / 1024 / 1024).toFixed(2);

  // Also output to public/ for GitHub CDN push (optional)
  const publicOutputPath = path.resolve(__dirname, '../public/search-index.json');
  fs.writeFileSync(publicOutputPath, JSON.stringify(allIndexes));
  const publicSizeMB = (fs.statSync(publicOutputPath).size / 1024 / 1024).toFixed(2);

  console.log('\nIndex built successfully!');
  console.log('   ' + totalFiles + ' files indexed, ' + totalPages + ' total pages');
  console.log('   Bundled: ' + srcOutputPath + ' (' + srcSizeMB + ' MB)');
  console.log('   CDN-ready: ' + publicOutputPath + ' (' + publicSizeMB + ' MB)');
  console.log('   CDN URL: https://media.githubusercontent.com/media/rt8digital/Sugarcane-Search/main/public/search-index.json');
  console.log('');
  console.log('To push updated index to GitHub CDN:');
  console.log('   1. Copy public/search-index.json to your GitHub repo');
  console.log('   2. Commit and push to main branch');
}

main().catch(console.error);
