const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/build/pdf.min.js');

const { GlobalWorkerOptions, getDocument } = pdfjsLib;
GlobalWorkerOptions.workerSrc = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');

const PDF_DIR = path.join(__dirname, '..', 'public', 'pdfs');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'indexes');

function parseBiographies(text) {
  const records = [];
  const entryMarkers = text.split(/(?=[A-Z]{2,},?\s[A-Z]{2,}:)/g);
  
  for (let segment of entryMarkers) {
    if (!segment.trim()) continue;
    
    const record = { fullName: '', rawText: segment.trim() };
    
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
    if (profMatch) record.profession = profMatch[1].trim();
    else {
      const sentence = segment.split('.')[0];
      if (sentence && sentence.length < 100) record.profession = sentence.trim();
    }

    const birthMatch = segment.match(/b\.\s?([\d]{1,2}[a-z\s]{0,10}[\d]{4}|[\d]{4}|[\d]{1,2}\s[a-z]{3,}\s[\d]{4})/i);
    if (birthMatch) record.birthDate = birthMatch[1].trim();

    records.push(record);
  }
  return records;
}

async function processPdf(pdfPath, bookId, title) {
  console.log(`Processing: ${pdfPath}...`);
  
  const buffer = fs.readFileSync(pdfPath);
  const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
  const numPages = doc.numPages;
  console.log(`  ${numPages} pages, extracting...`);
  
  const pages = [];
  for (let p = 1; p <= numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str || '').join(' ').replace(/\s+/g, ' ').trim();
    const records = parseBiographies(text);
    pages.push({ page: p, text, records });
    process.stdout.write(`\r  Page ${p}/${numPages}`);
  }
  console.log('');

  return { bookId, title, totalPages: numPages, indexedAt: new Date().toISOString(), pages };
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const books = [
    { id: 'whos-who-1936-pt1', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt1_Preface.pdf' },
    { id: 'whos-who-1936-pt2', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt2_A_I.pdf' },
    { id: 'whos-who-1936-pt4', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt4_O_Z.pdf' },
    { id: 'whos-who-1936-pt5', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt5_A_Z_Mixed.pdf' },
    { id: 'whos-who-1940-pt1', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt1_Preface.pdf' },
    { id: 'whos-who-1940-pt2', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt2_A_K.pdf' },
    { id: 'whos-who-1940-pt3', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt3_L_Q.pdf' },
    { id: 'whos-who-1940-pt4', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt4_R_Z.pdf' },
    { id: 'whos-who-1940-pt5', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt5_A_Z.pdf' },
    { id: 'whos-who-1940-pt7', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt7_A_Z.pdf' },
    { id: 'whos-who-1940-pt8', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt8_Com_dir.pdf' },
    { id: 'sa-indian-whos-who-1960-pt1', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_Pt1_preface.pdf' },
    { id: 'sa-indian-whos-who-1960-pt2', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt2_A_B.pdf' },
    { id: 'sa-indian-whos-who-1960-pt3', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt3_C_F.pdf' },
    { id: 'sa-indian-whos-who-1960-pt4', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt4_G_J.pdf' },
    { id: 'sa-indian-whos-who-1960-pt5', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt5_K_M.pdf' },
    { id: 'sa-indian-whos-who-1960-pt6', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt6_N_O.pdf' },
    { id: 'sa-indian-whos-who-1960-pt7', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt7_P_R.pdf' },
    { id: 'sa-indian-whos-who-1960-pt8', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt8_S_Z.pdf' },
    { id: 'sa-indian-whos-who-1960-pt9', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed.pdf' },
    { id: 'southern-africa-whos-who-1971-pt4', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G.pdf' },
    { id: 'southern-africa-whos-who-1971-pt5', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J.pdf' },
    { id: 'southern-africa-whos-who-1971-pt6', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME.pdf' },
    { id: 'southern-africa-whos-who-1971-pt7', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O.pdf' },
    { id: 'southern-africa-whos-who-1971-pt8', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R.pdf' },
    { id: 'southern-africa-whos-who-1971-pt9', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z.pdf' },
    { id: 'southern-africa-whos-who-1971-pt10', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed.pdf' },
    { id: 'southern-africa-whos-who-1971-pt11', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other.pdf' },
  ];

  let processed = 0;
  let failed = 0;

  for (const book of books) {
    try {
      const pdfPath = path.join(PDF_DIR, book.pdf);
      if (!fs.existsSync(pdfPath)) {
        console.log(`⚠ PDF not found: ${pdfPath}, skipping...`);
        continue;
      }
      const index = await processPdf(pdfPath, book.id, book.title);
      const outPath = path.join(OUTPUT_DIR, `${book.id}.json`);
      fs.writeFileSync(outPath, JSON.stringify(index));
      console.log(`✓ Saved: ${outPath}`);
      processed++;
    } catch (e) {
      console.error(`✗ Failed: ${book.id} - ${e.message}`);
      failed++;
    }
  }

  console.log(`\n=== Complete ===`);
  console.log(`Processed: ${processed}`);
  console.log(`Failed: ${failed}`);
}

main();