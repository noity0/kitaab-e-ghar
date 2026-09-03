import { jsPDF } from 'jspdf';
import { ReadableBook } from '../types';

/**
 * Downloads a book as a formatted Microsoft Word (.doc) file.
 * Opens natively in Microsoft Word, LibreOffice, and Google Docs with full formatting.
 */
export function downloadBookAsWord(book: ReadableBook, language: 'urdu-roman' | 'urdu' | 'en' = 'urdu-roman') {
  const isUrdu = language === 'urdu';
  const isRoman = language === 'urdu-roman';

  const title = book.title;
  const author = book.author;
  const era = book.yearOrEra;
  const category = book.category;

  const preface = (isUrdu && book.prefaceUrdu) ? book.prefaceUrdu : (isRoman && book.prefaceRoman) ? book.prefaceRoman : book.preface;

  let chaptersHtml = '';
  book.chapters.forEach((ch) => {
    const chTitle = (isUrdu && ch.titleUrdu) ? ch.titleUrdu : ch.title;
    const chContent = (isUrdu && ch.contentUrdu) ? ch.contentUrdu : (isRoman && ch.contentRoman) ? ch.contentRoman : ch.content;

    // Convert newlines to paragraphs
    const paragraphs = chContent.split('\n\n').map(p => `<p style="margin-bottom: 14pt; line-height: 1.7; text-align: justify;">${p.replace(/\n/g, '<br/>')}</p>`).join('');

    chaptersHtml += `
      <div style="page-break-before: always; margin-top: 30pt;">
        <div style="color: #b45309; font-size: 11pt; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5pt;">
          Chapter ${ch.number}
        </div>
        <h2 style="font-size: 18pt; color: #1e293b; margin-top: 4pt; margin-bottom: 12pt; border-bottom: 2pt solid #f59e0b; padding-bottom: 6pt;">
          ${chTitle}
        </h2>
        <div style="background-color: #f8fafc; border-left: 4pt solid #f59e0b; padding: 10pt 14pt; margin-bottom: 16pt; font-style: italic; color: #475569;">
          <strong>Core Passage / Mufeed Iqtibas:</strong> "${ch.keyPassage}"
        </div>
        ${paragraphs}
      </div>
    `;
  });

  const quotesHtml = book.famousQuotes.map(q => `<li style="margin-bottom: 8pt; font-style: italic; color: #334155;">"${q}"</li>`).join('');

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title} - ${author}</title>
      <style>
        @page {
          size: A4;
          margin: 1in 1in 1in 1in;
          mso-header-margin: 0.5in;
          mso-footer-margin: 0.5in;
        }
        body {
          font-family: 'Georgia', 'Times New Roman', 'Noto Nastaliq Urdu', serif;
          font-size: 11.5pt;
          color: #0f172a;
          background: #ffffff;
        }
        h1, h2, h3 { font-family: 'Cinzel', 'Georgia', serif; }
      </style>
    </head>
    <body ${isUrdu ? 'dir="rtl" style="text-align: right;"' : ''}>
      <!-- Title Page -->
      <div style="text-align: center; padding-top: 120pt; padding-bottom: 100pt; border-bottom: 2pt solid #e2e8f0;">
        <p style="text-transform: uppercase; letter-spacing: 3pt; color: #b45309; font-size: 11pt; font-weight: bold; margin-bottom: 12pt;">
          Kitab-e-Hikmat • Universal Living Codex Archive
        </p>
        <h1 style="font-size: 32pt; color: #0f172a; margin-bottom: 8pt; line-height: 1.2;">
          ${title}
        </h1>
        <p style="font-size: 16pt; color: #475569; font-style: italic; margin-bottom: 24pt;">
          By ${author}
        </p>
        <p style="font-size: 10.5pt; color: #64748b;">
          Era: ${era} | Discipline: ${category}
        </p>
        <p style="font-size: 9.5pt; color: #94a3b8; margin-top: 40pt;">
          Archived & Formatted from 200,000,000+ Human Books Repository
        </p>
      </div>

      <!-- Preface & Overview -->
      <div style="page-break-before: always; margin-top: 30pt;">
        <h2 style="font-size: 20pt; color: #0f172a; border-bottom: 1.5pt solid #cbd5e1; padding-bottom: 8pt;">
          ${isUrdu ? 'مقدمہ و خلاصہ' : 'Preface & Archival Overview'}
        </h2>
        <p style="font-size: 12pt; line-height: 1.8; margin-top: 14pt; color: #1e293b; text-align: justify;">
          ${preface}
        </p>

        <h3 style="font-size: 14pt; color: #0f172a; margin-top: 24pt; margin-bottom: 10pt;">
          ${isUrdu ? 'منتخب سنہری اقوال' : 'Foundational Maxims & Quotes'}
        </h3>
        <ul style="line-height: 1.7; padding-left: 20pt;">
          ${quotesHtml}
        </ul>
      </div>

      <!-- Chapters -->
      ${chaptersHtml}

      <!-- Colophon -->
      <div style="page-break-before: always; text-align: center; padding-top: 150pt; color: #64748b; font-size: 10pt;">
        <p>— End of Treatise —</p>
        <p style="margin-top: 8pt;">Preserved in Kitab-e-Hikmat (The Living Library of Earth)</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanTitle = title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').toLowerCase();
  a.download = `${cleanTitle}_Kitab_e_Hikmat.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a book as a high quality PDF file using jsPDF.
 */
export function downloadBookAsPDF(book: ReadableBook, language: 'urdu-roman' | 'urdu' | 'en' = 'urdu-roman') {
  const isUrdu = language === 'urdu';
  const isRoman = language === 'urdu-roman';

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - (margin * 2);

  // 1. Cover Page
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative border
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.setLineWidth(1.5);
  doc.rect(margin - 15, margin - 15, contentWidth + 30, pageHeight - (margin * 2) + 30);

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(10);
  doc.text('KITAB-E-HIKMAT • UNIVERSAL ARCHIVE (200,000,000+ BOOKS)', pageWidth / 2, 140, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  const titleLines = doc.splitTextToSize(book.title, contentWidth - 40);
  doc.text(titleLines, pageWidth / 2, 220, { align: 'center' });

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFontSize(15);
  doc.text(`By ${book.author}`, pageWidth / 2, 280, { align: 'center' });

  doc.setTextColor(148, 163, 184); // slate-400
  doc.setFontSize(11);
  doc.text(`Era: ${book.yearOrEra} | Discipline: ${book.category}`, pageWidth / 2, 330, { align: 'center' });

  doc.setTextColor(245, 158, 11);
  doc.setFontSize(11);
  doc.text(`Total Chapters Preserved: ${book.chapters.length}`, pageWidth / 2, 400, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text('Preserved and indexed in the Living Library of Earth', pageWidth / 2, pageHeight - 70, { align: 'center' });

  // 2. Preface Page
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  let y = 60;
  doc.setTextColor(180, 83, 9); // amber-700
  doc.setFontSize(9);
  doc.text('KITAB-E-HIKMAT • ARCHIVAL PREFACE', margin, y);

  y += 25;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(18);
  doc.text(isUrdu ? 'مقدمہ و خلاصہ' : 'Preface & Intellectual Significance', margin, y);

  y += 20;
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(1);
  doc.line(margin, y, margin + 80, y);

  y += 25;
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(10.5);
  const prefaceText = (isUrdu && book.prefaceUrdu) ? book.prefaceUrdu : (isRoman && book.prefaceRoman) ? book.prefaceRoman : book.preface;
  const prefaceLines = doc.splitTextToSize(prefaceText, contentWidth);
  doc.text(prefaceLines, margin, y);

  y += (prefaceLines.length * 14) + 25;

  if (book.famousQuotes && book.famousQuotes.length > 0 && y < pageHeight - 120) {
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(12);
    doc.text('Key Maxims & Wisdom:', margin, y);
    y += 18;

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(9.5);
    book.famousQuotes.slice(0, 3).forEach(q => {
      const qLines = doc.splitTextToSize(`"• ${q}"`, contentWidth - 10);
      if (y + (qLines.length * 13) < pageHeight - 50) {
        doc.text(qLines, margin + 10, y);
        y += (qLines.length * 13) + 6;
      }
    });
  }

  // 3. Chapters
  book.chapters.forEach((ch) => {
    doc.addPage();
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');

    let cy = 60;
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(9);
    doc.text(`CHAPTER ${ch.number}`, margin, cy);

    cy += 20;
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    const chTitle = (isUrdu && ch.titleUrdu) ? ch.titleUrdu : ch.title;
    const chTitleLines = doc.splitTextToSize(chTitle, contentWidth);
    doc.text(chTitleLines, margin, cy);

    cy += (chTitleLines.length * 20) + 5;
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(1);
    doc.line(margin, cy, margin + contentWidth, cy);

    cy += 18;
    // Core passage box
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, cy, contentWidth, 38, 'F');
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, cy, contentWidth, 38, 'D');

    doc.setTextColor(180, 83, 9);
    doc.setFontSize(8.5);
    doc.text('CORE QUOTATION:', margin + 10, cy + 14);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    const qShort = doc.splitTextToSize(`"${ch.keyPassage}"`, contentWidth - 20);
    doc.text(qShort.slice(0, 1), margin + 10, cy + 28);

    cy += 55;

    // Body content
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    const chContent = (isUrdu && ch.contentUrdu) ? ch.contentUrdu : (isRoman && ch.contentRoman) ? ch.contentRoman : ch.content;
    const bodyLines = doc.splitTextToSize(chContent, contentWidth);

    for (let i = 0; i < bodyLines.length; i++) {
      if (cy > pageHeight - 50) {
        doc.addPage();
        cy = 50;
      }
      doc.text(bodyLines[i], margin, cy);
      cy += 14;
    }

    // Page Number Footer
    const pageNum = doc.getNumberOfPages();
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text(`Kitab-e-Hikmat • ${book.title} | Page ${pageNum}`, pageWidth / 2, pageHeight - 25, { align: 'center' });
  });

  const cleanTitle = book.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').toLowerCase();
  doc.save(`${cleanTitle}_Kitab_e_Hikmat.pdf`);
}

/**
 * Downloads a book as clean markdown / plain text (.txt)
 */
export function downloadBookAsText(book: ReadableBook, language: 'urdu-roman' | 'urdu' | 'en' = 'urdu-roman') {
  const isUrdu = language === 'urdu';
  const isRoman = language === 'urdu-roman';

  let text = `========================================================\n`;
  text += `${book.title}\n`;
  text += `By ${book.author}\n`;
  text += `Era: ${book.yearOrEra} | Category: ${book.category}\n`;
  text += `Kitab-e-Hikmat Universal Living Codex Archive\n`;
  text += `========================================================\n\n`;

  text += `[PREFACE & SUMMARY]\n`;
  const preface = (isUrdu && book.prefaceUrdu) ? book.prefaceUrdu : (isRoman && book.prefaceRoman) ? book.prefaceRoman : book.preface;
  text += `${preface}\n\n`;

  text += `[NOTABLE MAXIMS & QUOTES]\n`;
  book.famousQuotes.forEach(q => {
    text += `* "${q}"\n`;
  });
  text += `\n========================================================\n\n`;

  book.chapters.forEach(ch => {
    const chTitle = (isUrdu && ch.titleUrdu) ? ch.titleUrdu : ch.title;
    const chContent = (isUrdu && ch.contentUrdu) ? ch.contentUrdu : (isRoman && ch.contentRoman) ? ch.contentRoman : ch.content;

    text += `CHAPTER ${ch.number}: ${chTitle}\n`;
    text += `Key Passage: "${ch.keyPassage}"\n`;
    text += `--------------------------------------------------------\n`;
    text += `${chContent}\n\n\n`;
  });

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const cleanTitle = book.title.replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '_').toLowerCase();
  a.download = `${cleanTitle}_Kitab_e_Hikmat.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Triggers clean print view for printing to physical printer or browser's "Save to PDF"
 */
export function printBookCleanly(book: ReadableBook, language: 'urdu-roman' | 'urdu' | 'en' = 'urdu-roman') {
  const isUrdu = language === 'urdu';
  const isRoman = language === 'urdu-roman';

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const title = book.title;
  const author = book.author;
  const preface = (isUrdu && book.prefaceUrdu) ? book.prefaceUrdu : (isRoman && book.prefaceRoman) ? book.prefaceRoman : book.preface;

  let chaptersHtml = '';
  book.chapters.forEach(ch => {
    const chTitle = (isUrdu && ch.titleUrdu) ? ch.titleUrdu : ch.title;
    const chContent = (isUrdu && ch.contentUrdu) ? ch.contentUrdu : (isRoman && ch.contentRoman) ? ch.contentRoman : ch.content;
    const paragraphs = chContent.split('\n\n').map(p => `<p>${p}</p>`).join('');

    chaptersHtml += `
      <div class="chapter">
        <span class="chapter-num">Chapter ${ch.number}</span>
        <h2>${chTitle}</h2>
        <div class="quote-box">"${ch.keyPassage}"</div>
        ${paragraphs}
      </div>
    `;
  });

  printWindow.document.write(`
    <!DOCTYPE html>
    <html ${isUrdu ? 'dir="rtl"' : ''}>
    <head>
      <title>${title} - ${author}</title>
      <style>
        body {
          font-family: Georgia, serif;
          margin: 40px;
          line-height: 1.7;
          color: #111;
        }
        .header { text-align: center; margin-bottom: 50px; border-bottom: 2px solid #ccc; padding-bottom: 30px; }
        h1 { font-size: 28px; margin-bottom: 5px; }
        .meta { color: #555; font-size: 14px; }
        .chapter { page-break-before: always; margin-top: 40px; }
        .chapter-num { font-size: 12px; font-weight: bold; text-transform: uppercase; color: #b45309; }
        h2 { font-size: 22px; margin-top: 5px; }
        .quote-box { background: #f5f5f5; border-left: 3px solid #b45309; padding: 10px 15px; margin: 15px 0; font-style: italic; }
        p { margin-bottom: 15px; text-align: justify; }
        @media print {
          body { margin: 20mm; }
          .chapter { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #b45309;">Kitab-e-Hikmat Archive</p>
        <h1>${title}</h1>
        <p class="meta">By ${author} | ${book.yearOrEra}</p>
      </div>
      <div>
        <h2>Preface</h2>
        <p>${preface}</p>
      </div>
      ${chaptersHtml}
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}
