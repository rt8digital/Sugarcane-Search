import { Book } from '../types';

/**
 * Registry of available books/PDFs.
 * Each entry maps to a PDF file in public/pdfs/
 */
export const BOOKS: Book[] = [
  // 1936-37 Edition
  {
    id: 'whos-who-1936-pt1',
    title: "Who's Who (1936-37)",
    subtitle: 'Part 1: Preface',
    year: '1936',
    pdfPath: '/pdfs/Whos_Who_1936_37_pt1_Preface_ocr.pdf',
  },
  {
    id: 'whos-who-1936-pt2',
    title: "Who's Who (1936-37)",
    subtitle: 'Part 2: A-I',
    year: '1936',
    pdfPath: '/pdfs/Whos_Who_1936_37_pt2_A_I_ocr.pdf',
  },
  {
    id: 'whos-who-1936-pt4',
    title: "Who's Who (1936-37)",
    subtitle: 'Part 4: O-Z',
    year: '1936',
    pdfPath: '/pdfs/Whos_Who_1936_37_pt4_O_Z_ocr.pdf',
  },
  {
    id: 'whos-who-1936-pt5',
    title: "Who's Who (1936-37)",
    subtitle: 'Part 5: Mixed A-Z',
    year: '1936',
    pdfPath: '/pdfs/Whos_Who_1936_37_pt5_A_Z_Mixed_ocr.pdf',
  },

  // 1940 Edition
  {
    id: 'whos-who-1940-pt1',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 1: Preface',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt1_Preface_ocr.pdf',
  },
  {
    id: 'whos-who-1940-pt2',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 2: A-K',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt2_A_K_ocr.pdf',
  },
  {
    id: 'whos-who-1940-pt3',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 3: L-Q',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt3_L_Q_ocr.pdf',
  },
  {
    id: 'whos-who-1940-pt4',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 4: R-Z',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt4_R_Z_ocr.pdf',
  },
  {
    id: 'whos-who-1940-pt5',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 5: A-Z',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt5_A_Z_ocr.pdf',
  },
  {
    id: 'whos-who-1940-pt7',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 7: A-Z',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt7_A_Z_ocr.pdf',
  },
  {
    id: 'whos-who-1940-pt8',
    title: "South African Indian Who's Who (1940)",
    subtitle: 'Part 8: Commercial Directory',
    year: '1940',
    pdfPath: '/pdfs/Whos_Who_1940_pt8_Com_dir_ocr.pdf',
  },

  // 1960 Edition
  {
    id: 'sa-indian-whos-who-1960-pt1',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 1: Preface',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_Pt1_preface_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt2',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 2: A-B',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt2_A_B_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt3',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 3: C-F',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt3_C_F_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt4',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 4: G-J',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt4_G_J_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt5',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 5: K-M',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt5_K_M_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt6',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 6: N-O',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt6_N_O_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt7',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 7: P-R',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt7_P_R_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt8',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 8: S-Z',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt8_S_Z_ocr.pdf',
  },
  {
    id: 'sa-indian-whos-who-1960-pt9',
    title: "South African Indian Who's Who (1960)",
    subtitle: 'Part 9: Mixed A-Z',
    year: '1960',
    pdfPath: '/pdfs/South_African_Indian_Who_Who_1960_pt9_A_Z_Mixed_ocr.pdf',
  },

  // 1971-72 Edition
  {
    id: 'southern-africa-whos-who-1971-pt4',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 4: E-G',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt4_E_G_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt5',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 5: H-J',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt5_H_J_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt6',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 6: K-ME',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt6_K_ME_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt7',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 7: MI-O',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt7_MI_O_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt8',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 8: P-R',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt8_P_R_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt9',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 9: S-Z',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_pt9_S_Z_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt10',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 10: Mixed A-Z',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_ptt_10_A_Z_Mixed_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-pt11',
    title: "Southern Africa Indian Who's Who (1971-72)",
    subtitle: 'Part 11: Other A-Z',
    year: '1971',
    pdfPath: '/pdfs/Southern_Africa_Indian_Who_Who_1971-1972_ptt_11_A_Z_Other_ocr.pdf',
  },
  {
    id: 'southern-africa-whos-who-1971-full',
    title: "Southern Africa Indian Who's Who (1971)",
    subtitle: 'Consolidated Edition',
    year: '1971',
    pdfPath: '/pdfs/southern-africa-whos-who-1971.pdf',
  },
];
