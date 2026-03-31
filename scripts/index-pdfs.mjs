import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as pdfjsLib from 'pdfjs-dist';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PDF_DIR = path.join(__dirname, 'public/pdfs');
const OUTPUT_DIR = path.join(__dirname, 'public/indexes');

const { GlobalWorkerOptions, getDocument } = pdfjsLib;
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

function parseBiographies(text) {
  const records = [];
  const entryMarkers = text.split(/(?=[A-Z]{2,},?\s[A-Z]{2,}:)/g);
  
  for (let segment of entryMarkers) {
    if (!segment.trim()) continue;
    
    const record = {
      fullName: '',
      rawText: segment.trim()
    };
    
    const nameMatch = segment.match(/^([A-Z\s,]{3,}):/);
    if (nameMatch) {
      record.fullName = nameMatch[1].trim();
      segment = segment.substring(nameMatch[0].length).trim();
    } else {
      const words = segment.split(' ');
      if (words[0] && words[0] === words[0].toUpperCase()) {
         record.fullName = words.slice(0, 2).join(' ').replace(':', '');
      }
    }
    
    if (!record.fullName) continue;

    const profMatch = segment.match(/^([^.]+?)\.[\s]b\./i);
    if (profMatch) {
      record.profession = profMatch[1].trim();
    } else {
      const sentence = segment.split('.')[0];
      if (sentence && sentence.length < 100) {
        record.profession = sentence.trim();
      }
    }

    const birthMatch = segment.match(/b\.\s?([\d]{1,2}[a-z\s]{0,10}[\d]{4}|[\d]{4}|[\d]{1,2}\s[a-z]{3,}\s[\d]{4})/i);
    if (birthMatch) {
      record.birthDate = birthMatch[1].trim();
    }

    records.push(record);
  }
  
  return records;
}

async function processPdf(pdfPath, bookId, title) {
  console.log(`Processing: ${pdfPath}...`);
  
  const resp = await fetch(pdfPath);
  if (!resp.ok) throw new Error(`Could not fetch PDF: ${pdfPath}`);
  
  const buffer = await resp.arrayBuffer();
  const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
  const numPages = doc.numPages;
  const pages = [];

  for (let p = 1; p <= numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => item.str || '')
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    const records = parseBiographies(text);
    pages.push({ page: p, text, records });
    
    process.stdout.write(`\r  Page ${p}/${numPages}`);
  }
  console.log('');

  const bookIndex = {
    bookId,
    title,
    totalPages: numPages,
    indexedAt: new Date().toISOString(),
    pages,
  };

  return bookIndex;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const books = [
    { id: 'whos-who-1936-pt1', title: "Who's Who (1936-37)", pdf: '/pdfs/Whos_Who_1936_37_pt1_Preface_ocr.pdf' },
    { id: 'whos-who-1936-pt2', title: "Who's Who (1936-37)", pdf: '/pdfs/Whos_Who_1936_37_pt2_A_I_ocr.pdf' },
    { id: 'whos-who-1936-pt4', title: "Who's Who (1936-37)", pdf: '/pdfs/Whos_Who_1936_37_pt4_O_Z_ocr.pdf' },
    { id: 'whos-who-1936-pt5', title: "Who's Who (1936-37)", pdf: '/pdfs/Whos_Who_1936_37_pt5_A_Z_Mixed_ocr.pdf' },
    { id: 'whos-who-1940-pt1', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt1_Preface_ocr.pdf' },
    { id: 'whos-who-1940-pt2', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt2_A_K_ocr.pdf' },
    { id: 'whos-who-1940-pt3', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt3_L_Q_ocr.pdf' },
    { id: 'whos-who-1940-pt4', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt4_R_Z_ocr.pdf' },
    { id: 'whos-who-1940-pt5', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt5_A_Z_ocr.pdf' },
    { id: 'whos-who-1940-pt7', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt7_A_Z_ocr.pdf' },
    { id: 'whos-who-1940-pt8', title: "South African Indian Who's Who (1940)", pdf: '/pdfs/Whos_Who_1940_pt8_Com_dir_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt1', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_Pt1_preface_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt2', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt2_A_B_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt3', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt3_C_F_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt4', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt4_G_J_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt5', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt5_K_M_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt6', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt6_N_O_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt7', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt7_P_R_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt8', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt8_S_Z_ocr.pdf' },
    { id: 'sa-indian-whos-who-1960-pt9', title: "South African Indian Who's Who (1960)", pdf: '/pdfs/South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt4', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt5', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt6', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt7', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt8', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt9', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt10', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-pt11', title: "Southern Africa Indian Who's Who (1971-72)", pdf: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other_ocr.pdf' },
    { id: 'southern-africa-whos-who-1971-full', title: "Southern Africa Indian Who's Who (1971)", pdf: '/pdfs/southern-africa-whos-who-1971.pdf' },
  ];

  const baseUrl = 'http://localhost:5173';
  let processed = 0;
  let failed = 0;

  for (const book of books) {
    try {
      const pdfPath = `${baseUrl}${book.pdf}`;
      const index = await processPdf(pdfPath, book.id, book.title);
      
      const outPath = path.join(OUTPUT_DIR, `${book.id}.json`);
      fs.writeFileSync(outPath, JSON.stringify(index, null, 2));
      
      processed++;
      console.log(`✓ Saved: ${outPath}\n`);
    } catch (e) {
      failed++;
      console.error(`✗ Failed: ${book.id} - ${e.message}\n`);
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Processed: ${processed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Output: ${OUTPUT_DIR}`);
}

main();
