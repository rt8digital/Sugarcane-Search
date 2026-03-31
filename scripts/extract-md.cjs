const fs = require('fs');
const path = require('path');
const pdfjsLib = require('pdfjs-dist/build/pdf.min.js');

const { GlobalWorkerOptions, getDocument } = pdfjsLib;
GlobalWorkerOptions.workerSrc = path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'build', 'pdf.worker.min.js');

const PDF_DIR = path.join(__dirname, '..', 'public', 'pdfs');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'text');

const books = [
  { id: 'whos-who-1936-pt1', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt1_Preface_ocr.pdf' },
  { id: 'whos-who-1936-pt2', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt2_A_I_ocr.pdf' },
  { id: 'whos-who-1936-pt4', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt4_O_Z_ocr.pdf' },
  { id: 'whos-who-1936-pt5', title: "Who's Who (1936-37)", pdf: 'Whos_Who_1936_37_pt5_A_Z_Mixed_ocr.pdf' },
  { id: 'whos-who-1940-pt1', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt1_Preface_ocr.pdf' },
  { id: 'whos-who-1940-pt2', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt2_A_K_ocr.pdf' },
  { id: 'whos-who-1940-pt3', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt3_L_Q_ocr.pdf' },
  { id: 'whos-who-1940-pt4', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt4_R_Z_ocr.pdf' },
  { id: 'whos-who-1940-pt5', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt5_A_Z_ocr.pdf' },
  { id: 'whos-who-1940-pt7', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt7_A_Z_ocr.pdf' },
  { id: 'whos-who-1940-pt8', title: "South African Indian Who's Who (1940)", pdf: 'Whos_Who_1940_pt8_Com_dir_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt1', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_Pt1_preface_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt2', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt2_A_B_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt3', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt3_C_F_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt4', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt4_G_J_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt5', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt5_K_M_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt6', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt6_N_O_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt7', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt7_P_R_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt8', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt8_S_Z_ocr.pdf' },
  { id: 'sa-indian-whos-who-1960-pt9', title: "South African Indian Who's Who (1960)", pdf: 'South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt4', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt5', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt6', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt7', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt8', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt9', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt10', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-pt11', title: "Southern Africa Indian Who's Who (1971-72)", pdf: 'Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other_ocr.pdf' },
  { id: 'southern-africa-whos-who-1971-full', title: "Southern Africa Indian Who's Who (1971)", pdf: 'southern-africa-whos-who-1971.pdf' },
];

async function extractPdf(pdfPath, bookId, title) {
  console.log(`Processing: ${bookId}...`);
  
  const buffer = fs.readFileSync(pdfPath);
  const doc = await getDocument({ data: new Uint8Array(buffer) }).promise;
  const numPages = doc.numPages;
  console.log(`  ${numPages} pages, extracting...`);
  
  let md = `# ${title}\n\n`;
  md += `**Book ID:** ${bookId}\n`;
  md += `**Total Pages:** ${numPages}\n\n`;
  md += `---\n\n`;
  
  for (let p = 1; p <= numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str || '').join(' ').replace(/\s+/g, ' ').trim();
    
    md += `## Page ${p}\n\n`;
    md += text + '\n\n';
    md += `---\n\n`;
    
    process.stdout.write(`\r  Page ${p}/${numPages}`);
  }
  console.log('');

  return md;
}

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const book of books) {
    try {
      const pdfPath = path.join(PDF_DIR, book.pdf);
      if (!fs.existsSync(pdfPath)) {
        console.log(`⚠ PDF not found: ${pdfPath}, skipping...`);
        continue;
      }
      
      const md = await extractPdf(pdfPath, book.id, book.title);
      const outPath = path.join(OUTPUT_DIR, `${book.id}.md`);
      fs.writeFileSync(outPath, md);
      
      console.log(`✓ Saved: ${outPath}`);
    } catch (e) {
      console.error(`✗ Failed: ${book.id} - ${e.message}`);
    }
  }

  console.log('\nDone! Check public/text/ for MD files.');
}

main();