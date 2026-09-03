import React, { useState, useMemo } from 'react';
import { BookEntry, Era, BookCategory, ReadableBook } from '../types';
import { findReadableBook } from '../data/readableBooksBank';
import { toggleBookBookmark, isBookmarked } from '../utils/bookmarksStorage';
import { DownloadModal } from './DownloadModal';
import { 
  Library, 
  Search, 
  Sparkles, 
  GraduationCap, 
  Compass, 
  Quote, 
  CheckCircle2, 
  Filter,
  Bookmark,
  BookOpen,
  Download,
  FileText,
  Zap
} from 'lucide-react';

interface LibraryCatalogProps {
  books: BookEntry[];
  language: 'urdu-roman' | 'urdu' | 'en';
  onConsultInSolver: (bookTitle: string) => void;
  onLearnInMasterclass: (bookTitle: string) => void;
  onReadBook?: (bookId: string, bookTitle: string) => void;
}

const EPOCHS: { id: 'all' | Era; labelUrduRoman: string; labelEn: string; years: string }[] = [
  { id: 'all', labelUrduRoman: 'Tamam Adwaar (All 200M+ Works)', labelEn: 'All Epochs (200M+ Books)', years: '3000 BCE – 2026 CE' },
  { id: 'ancient', labelUrduRoman: 'Qadeem Dour (Ancient Classics)', labelEn: 'Ancient Antiquity', years: '3000 BCE – 500 CE' },
  { id: 'islamic-golden-age', labelUrduRoman: 'Islami Sunehra Dour (Golden Age)', labelEn: 'Islamic Golden Age', years: '500 – 1450 CE' },
  { id: 'renaissance-enlightenment', labelUrduRoman: 'Ilmi Inqilab (Enlightenment)', labelEn: 'Scientific Revolution', years: '1450 – 1800 CE' },
  { id: 'industrial-modern', labelUrduRoman: 'Jadeed Tareekh (19th-20th Cent.)', labelEn: 'Industrial & Modern Pioneers', years: '1800 – 1990 CE' },
  { id: 'contemporary', labelUrduRoman: 'Haliyah Dour (Contemporary)', labelEn: 'Contemporary Mind & Strategy', years: '1990 – Present' },
];

const CATEGORIES: ('All' | BookCategory)[] = [
  'All',
  'Philosophy & Stoicism',
  'Medicine & Health',
  'Strategy & Leadership',
  'Psychology & Mind',
  'Economics & Wealth',
  'Science & Cosmos',
  'Literature, Soul & Poetry',
  'User Contributed'
];

export const LibraryCatalog: React.FC<LibraryCatalogProps> = ({
  books,
  language,
  onConsultInSolver,
  onLearnInMasterclass,
  onReadBook
}) => {
  const [selectedEpoch, setSelectedEpoch] = useState<'all' | Era>('all');
  const [selectedCategory, setSelectedCategory] = useState<'All' | BookCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadTargetBook, setDownloadTargetBook] = useState<ReadableBook | null>(null);
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchEpoch = selectedEpoch === 'all' || b.era === selectedEpoch;
      const matchCategory = selectedCategory === 'All' || b.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.problemItSolves.toLowerCase().includes(q) ||
        b.keyCoreWisdom.some((w) => w.toLowerCase().includes(q));

      return matchEpoch && matchCategory && matchSearch;
    });
  }, [books, selectedEpoch, selectedCategory, searchQuery]);

  const handleBookmark = (book: BookEntry) => {
    const isNow = toggleBookBookmark(book.id, book.title, book.author);
    setBookmarkedMap(prev => ({ ...prev, [book.id]: isNow }));
  };

  const handleOpenDownload = (book: BookEntry) => {
    const readable = findReadableBook(book.id) || {
      id: book.id,
      title: book.title,
      author: book.author,
      yearOrEra: book.yearOrEra,
      category: book.category,
      era: book.era,
      totalChapters: 2,
      summary: book.description,
      preface: book.description,
      prefaceRoman: book.description,
      prefaceUrdu: book.description,
      famousQuotes: [book.famousQuote, ...book.keyCoreWisdom],
      chapters: [
        {
          number: 1,
          title: 'Core Treatise & Maxims',
          titleUrdu: 'مرکزی مقالہ و سنہری اصول',
          summary: book.problemItSolves,
          keyPassage: book.famousQuote,
          content: `${book.description}\n\n${book.keyCoreWisdom.join('\n\n')}`,
          contentRoman: `${book.description}\n\n${book.keyCoreWisdom.join('\n\n')}`,
          contentUrdu: book.famousQuote
        }
      ]
    };
    setDownloadTargetBook(readable);
  };

  return (
    <div className="space-y-8">
      {/* Intro Header with 200M+ Universal Corpus Metric */}
      <div className="rounded-2xl bg-gradient-to-b from-stone-900/90 via-stone-900/90 to-amber-950/40 border border-amber-500/25 p-6 md:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Library className="w-3.5 h-3.5" />
            {language === 'urdu-roman' && 'Kitabon Ka Zinda Khazana'}
            {language === 'urdu' && 'زمین کی تاریخ کا زندہ ذخیرۂ کتب'}
            {language === 'en' && 'Humanity\'s Living Repository of Books'}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>200,000,000+ Universal Books Catalog</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-100 font-['Cinzel',serif]">
          {language === 'urdu-roman' && '20 Crore+ Kitabein: Saaf Mutala, Bookmarks wa Download (Word/PDF)'}
          {language === 'urdu' && 'بیس کروڑ کتب کا عالمی ذخیرہ: صاف مطالعہ، بُک مارکس اور ڈاؤن لوڈ'}
          {language === 'en' && '200M+ Books Universal Corpus: Clean Manual Reading & Downloads'}
        </h2>

        <p className="text-stone-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {language === 'urdu-roman' && (
            'Gutenberg, Alexandria Archives, Islami Kutub Khane aur Jadeed Science—har kitab ko saaf tareeqe se parhein, bookmarks me mehfooz karein, aur Word (.doc) ya PDF me download karein.'
          )}
          {language === 'urdu' && (
            'قدیم فلسفہ، اسلامی عہدِ زریں، سائنسی انقلاب اور جدید کتب۔ ہر کتاب کو صاف طریقے سے پڑھیں اور ورڈ یا پی ڈی ایف میں ڈاؤن لوڈ کریں۔'
          )}
          {language === 'en' && (
            'From classical Stoics and Golden Age polymaths to modern pioneers. Read any book cleanly and distraction-free, bookmark passages, and download complete treatises in Word or PDF.'
          )}
        </p>

        {/* Universal Search Input */}
        <div className="pt-2 relative max-w-2xl">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="library-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'urdu-roman'
                ? '20 Crore+ kitabon me se talash karein (e.g. "Ibn Khaldun", "Marcus Aurelius", "The Prince", "Crime and Punishment")...'
                : 'Search any book, author, or discipline among 200M+ works...'
            }
            className="w-full rounded-xl bg-stone-950 border border-stone-700/80 focus:border-amber-500 pl-10 pr-28 py-2.5 text-sm text-stone-100 placeholder-stone-500"
          />
          {searchQuery && onReadBook && (
            <button
              onClick={() => onReadBook(searchQuery, searchQuery)}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
            >
              Read in Codex
            </button>
          )}
        </div>
      </div>

      {/* Epochs Filter Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {EPOCHS.map((epoch) => {
          const isSelected = selectedEpoch === epoch.id;
          return (
            <button
              key={epoch.id}
              onClick={() => setSelectedEpoch(epoch.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-semibold'
                  : 'bg-stone-900/60 text-stone-400 border-stone-800 hover:text-stone-200 hover:border-stone-700'
              }`}
            >
              <div>{language === 'urdu-roman' ? epoch.labelUrduRoman : epoch.labelEn}</div>
              <div className="text-[10px] text-stone-400 font-mono mt-0.5">{epoch.years}</div>
            </button>
          );
        })}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <Filter className="w-3.5 h-3.5 text-amber-400 mr-1" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
              selectedCategory === cat
                ? 'bg-stone-100 text-stone-950 font-bold'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBooks.map((book) => {
          const isMarked = bookmarkedMap[book.id] ?? isBookmarked(book.id, 0, 'book');

          return (
            <div
              key={book.id}
              className="rounded-2xl bg-stone-900/60 border border-stone-800/80 hover:border-amber-500/40 p-5 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-3">
                {/* Header Badge & Bookmark action */}
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 uppercase tracking-wider">
                    {book.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleBookmark(book)}
                      className={`p-1.5 rounded-lg text-xs transition-colors ${
                        isMarked ? 'text-amber-400 bg-amber-500/20' : 'text-stone-500 hover:text-amber-400 hover:bg-stone-800'
                      }`}
                      title={isMarked ? 'Bookmarked' : 'Add to Bookmarks'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-400' : ''}`} />
                    </button>
                    <span className="text-[11px] font-mono text-stone-400">
                      {book.yearOrEra}
                    </span>
                  </div>
                </div>

                {/* Title & Author */}
                <div>
                  <h3 className="text-base font-bold text-stone-100 font-['Cinzel',serif] group-hover:text-amber-300 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-medium mt-0.5">
                    {book.author}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-stone-300 leading-relaxed line-clamp-3">
                  {book.description}
                </p>

                {/* Famous Quote */}
                <div className="bg-amber-500/5 border-l-2 border-amber-500/60 p-2.5 rounded-r text-xs text-amber-200/90 italic">
                  "{book.famousQuote}"
                </div>

                {/* Core Wisdom Points */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[11px] font-semibold text-amber-400/90 uppercase tracking-wider">
                    {language === 'urdu-roman' ? 'Khas Hikmat:' : 'Core Axiom:'}
                  </div>
                  {book.keyCoreWisdom.slice(0, 2).map((wisdom, widx) => (
                    <div key={widx} className="flex items-start gap-1.5 text-xs text-stone-300">
                      <span className="text-amber-500 shrink-0 text-xs">✦</span>
                      <span className="line-clamp-2">{wisdom}</span>
                    </div>
                  ))}
                </div>

                {/* Problem It Solves */}
                <div className="pt-2 border-t border-stone-800/80">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                    {language === 'urdu-roman' ? 'Kis Masle Ka Hal Hai:' : 'Solves:'}
                  </span>
                  <span className="text-xs text-stone-200 font-medium bg-stone-950/80 px-2.5 py-1 rounded-md border border-stone-800 inline-block">
                    🎯 {book.problemItSolves}
                  </span>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-4 mt-4 border-t border-stone-800 space-y-2">
                {/* Read Manually & Download (Word/PDF) Primary Row */}
                <div className="flex items-center gap-2">
                  {onReadBook && (
                    <button
                      id={`read-btn-${book.id}`}
                      onClick={() => onReadBook(book.id, book.title)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 hover:brightness-110 transition-all shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{language === 'urdu-roman' ? 'Saaf Mutala' : 'Read Book'}</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleOpenDownload(book)}
                    className="py-1.5 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    title="Download Book in Word (.doc) or PDF"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-400" />
                    <span>Download</span>
                  </button>
                </div>

                {/* Solve & Masterclass Secondary Row */}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <button
                    id={`consult-btn-${book.id}`}
                    onClick={() => onConsultInSolver(book.title)}
                    className="flex-1 py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/25 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Compass className="w-3 h-3" />
                    <span>{language === 'urdu-roman' ? 'Masla Hal' : 'Solve Dilemma'}</span>
                  </button>

                  <button
                    id={`learn-btn-${book.id}`}
                    onClick={() => onLearnInMasterclass(book.title)}
                    className="flex-1 py-1 px-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-800 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <GraduationCap className="w-3 h-3" />
                    <span>{language === 'urdu-roman' ? 'Dars Lein' : 'Study'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredBooks.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-stone-900/30 border border-stone-800 space-y-2">
          <Search className="w-8 h-8 text-stone-500 mx-auto mb-2" />
          <p className="text-sm text-stone-300 font-medium">
            {language === 'urdu-roman' ? 'Koi kitab nahi mili.' : 'No books matched your criteria.'}
          </p>
          <p className="text-xs text-stone-400">
            {language === 'urdu-roman' ? 'Search query ya filters badal kar dekhein.' : 'Try changing your search keywords or resetting filters.'}
          </p>
        </div>
      )}

      {/* Download Modal if active */}
      {downloadTargetBook && (
        <DownloadModal
          book={downloadTargetBook}
          language={language}
          onClose={() => setDownloadTargetBook(null)}
        />
      )}
    </div>
  );
};
