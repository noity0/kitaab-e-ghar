import React, { useState } from 'react';
import { ReadableBook } from '../types';
import { 
  downloadBookAsWord, 
  downloadBookAsPDF, 
  downloadBookAsText, 
  printBookCleanly 
} from '../utils/downloadBook';
import { 
  X, 
  Download, 
  FileText, 
  FileType, 
  Printer, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Layers,
  Globe
} from 'lucide-react';

interface DownloadModalProps {
  book: ReadableBook;
  language: 'urdu-roman' | 'urdu' | 'en';
  onClose: () => void;
}

export const DownloadModal: React.FC<DownloadModalProps> = ({
  book,
  language: initialLanguage,
  onClose
}) => {
  const [downloadLang, setDownloadLang] = useState<'urdu-roman' | 'urdu' | 'en'>(initialLanguage);
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleDownload = async (format: 'word' | 'pdf' | 'text' | 'print') => {
    setDownloadingFormat(format);
    setSuccessMsg(null);

    try {
      if (format === 'word') {
        downloadBookAsWord(book, downloadLang);
        setSuccessMsg(
          downloadLang === 'urdu-roman' 
            ? 'Microsoft Word (.doc) file download shuru ho chuki hai!' 
            : 'Word (.doc) file download initiated successfully!'
        );
      } else if (format === 'pdf') {
        downloadBookAsPDF(book, downloadLang);
        setSuccessMsg(
          downloadLang === 'urdu-roman' 
            ? 'PDF (.pdf) file download ho chuki hai!' 
            : 'PDF (.pdf) book generated and downloaded!'
        );
      } else if (format === 'text') {
        downloadBookAsText(book, downloadLang);
        setSuccessMsg('Text (.txt) file downloaded!');
      } else if (format === 'print') {
        printBookCleanly(book, downloadLang);
      }
    } catch (e: any) {
      console.error(e);
      alert('Download error: ' + (e.message || 'Unknown error'));
    } finally {
      setTimeout(() => setDownloadingFormat(null), 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Download className="w-3.5 h-3.5" />
            Universal Book Downloader
          </div>
          <h3 className="text-2xl font-bold text-stone-100 font-['Cinzel',serif]">
            {book.title}
          </h3>
          <p className="text-sm text-stone-300">
            By <span className="text-amber-400 font-medium">{book.author}</span> • {book.yearOrEra} • {book.chapters.length} Chapters Preserved
          </p>
        </div>

        {/* Language Selection for Download */}
        <div className="p-4 rounded-xl bg-stone-950/70 border border-stone-800 space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            Select Download Language / Zaban Ka Intekhab:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setDownloadLang('urdu-roman')}
              className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                downloadLang === 'urdu-roman'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Roman Urdu
            </button>
            <button
              onClick={() => setDownloadLang('urdu')}
              className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                downloadLang === 'urdu'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              اردو (Urdu)
            </button>
            <button
              onClick={() => setDownloadLang('en')}
              className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                downloadLang === 'en'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold'
                  : 'bg-stone-900/60 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Download Formats Grid */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Select File Format:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Word .doc */}
            <button
              onClick={() => handleDownload('word')}
              disabled={downloadingFormat !== null}
              className="p-4 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-blue-500/30 hover:border-blue-500/60 text-left transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 font-bold">
                  .DOC / WORD
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-stone-100 font-semibold text-sm">
                  Microsoft Word Document
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Formatted for MS Word & Google Docs with clean typography & chapters.
                </p>
              </div>
            </button>

            {/* PDF .pdf */}
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloadingFormat !== null}
              className="p-4 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-red-500/30 hover:border-red-500/60 text-left transition-all group relative overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                  <FileType className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-300 font-bold">
                  .PDF
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-stone-100 font-semibold text-sm">
                  PDF Book Edition
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Universal print-ready publication with dark cover page & margins.
                </p>
              </div>
            </button>

            {/* Plain Text / Markdown */}
            <button
              onClick={() => handleDownload('text')}
              disabled={downloadingFormat !== null}
              className="p-4 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-stone-700 hover:border-stone-500 text-left transition-all group relative"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-stone-800 text-stone-300 font-bold">
                  .TXT / MD
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-stone-100 font-semibold text-sm">
                  Plain Text / Markdown
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Lightweight clean text for e-readers, Kindle, and note apps.
                </p>
              </div>
            </button>

            {/* Clean Print */}
            <button
              onClick={() => handleDownload('print')}
              disabled={downloadingFormat !== null}
              className="p-4 rounded-xl bg-stone-900/90 hover:bg-stone-800/90 border border-amber-500/30 hover:border-amber-500/60 text-left transition-all group relative"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Printer className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold">
                  PRINT
                </span>
              </div>
              <div className="mt-3">
                <h4 className="text-stone-100 font-semibold text-sm">
                  Print-Friendly Layout
                </h4>
                <p className="text-xs text-stone-400 mt-0.5">
                  Opens clean browser print preview with page breaks & serif type.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Success Message */}
        {successMsg && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Archival Note */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/70 text-xs text-stone-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Kitab-e-Hikmat documents are strictly open-access, ad-free, and unencumbered for personal study and education.
          </span>
        </div>
      </div>
    </div>
  );
};
