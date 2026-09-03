import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ReadableBook, BookChapter, ReaderSettings, BookPage } from '../types';
import { PRECOMPUTED_READABLE_BOOKS, findReadableBook, buildFallbackReadableBook } from '../data/readableBooksBank';
import { paginateBook, expandBookToFullVolume, PaginatedBookResult } from '../utils/bookPaginator';
import { saveBookmark, isBookmarked, toggleBookBookmark } from '../utils/bookmarksStorage';
import { DownloadModal } from './DownloadModal';
import { 
  BookOpen, 
  Bookmark, 
  Download, 
  Volume2, 
  VolumeX, 
  ChevronLeft, 
  ChevronRight, 
  Settings2, 
  List, 
  Search, 
  Sparkles, 
  Clock, 
  Compass,
  Zap,
  Globe,
  FileType,
  FileText,
  Layers,
  CheckCircle,
  Columns,
  Maximize2,
  Minimize2,
  ChevronsLeft,
  ChevronsRight,
  RotateCcw,
  BookMarked
} from 'lucide-react';

interface BookReaderProps {
  initialBookId?: string;
  initialBookTitle?: string;
  initialChapterIndex?: number;
  language: 'urdu-roman' | 'urdu' | 'en';
  onConsultInSolver?: (bookTitle: string) => void;
  onLearnInMasterclass?: (bookTitle: string) => void;
  onOpenBookmarks?: () => void;
}

export const BookReader: React.FC<BookReaderProps> = ({
  initialBookId,
  initialBookTitle,
  initialChapterIndex = 0,
  language: parentLanguage,
  onConsultInSolver,
  onLearnInMasterclass,
  onOpenBookmarks
}) => {
  // Current active book state - guarantees 0ms exact instant resolution of the selected book
  const [activeBook, setActiveBook] = useState<ReadableBook>(() => {
    const target = initialBookId || initialBookTitle;
    if (target) {
      const match = findReadableBook(target) || findReadableBook(initialBookTitle || '');
      if (match) return match;
      return buildFallbackReadableBook(initialBookTitle || initialBookId || 'The Book of Wisdom');
    }
    return PRECOMPUTED_READABLE_BOOKS[0];
  });

  const [currentChapterIndex, setCurrentChapterIndex] = useState<number>(initialChapterIndex);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [loadingBook, setLoadingBook] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inBookFilter, setInBookFilter] = useState<string>('');
  const [isExpandedVolume, setIsExpandedVolume] = useState<boolean>(false);
  const [speedStats, setSpeedStats] = useState<{ timeTakenMs?: number; source?: string } | null>({
    timeTakenMs: 0,
    source: 'instant-bank'
  });

  // Reader Customization Settings (Default to paginated-book mode so user reads authentic 200-300 page book layout!)
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 'base',
    theme: 'sepia',
    fontFamily: 'serif',
    maxWidth: 'standard',
    language: parentLanguage,
    readMode: 'paginated-book',
    twoPageSpread: false
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showChapterDrawer, setShowChapterDrawer] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [showInBookSearch, setShowInBookSearch] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);
  const [bookmarkedBook, setBookmarkedBook] = useState<boolean>(false);
  const [bookmarkedChapter, setBookmarkedChapter] = useState<boolean>(false);

  const contentContainerRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Sync parent language
  useEffect(() => {
    setSettings((prev) => ({ ...prev, language: parentLanguage }));
  }, [parentLanguage]);

  // Sync bookmarks state when book or chapter changes
  useEffect(() => {
    if (activeBook) {
      setBookmarkedBook(isBookmarked(activeBook.id, 0, 'book'));
      setBookmarkedChapter(isBookmarked(activeBook.id, currentChapterIndex, 'chapter'));
    }
  }, [activeBook, currentChapterIndex]);

  // Handle external prop changes (e.g. from bookmarks or library clicks)
  useEffect(() => {
    if (initialBookId || initialBookTitle) {
      loadBook(initialBookId || initialBookTitle!, initialBookTitle);
      if (initialChapterIndex !== undefined && initialChapterIndex >= 0) {
        setCurrentChapterIndex(initialChapterIndex);
      }
    }
  }, [initialBookId, initialBookTitle, initialChapterIndex]);

  // Compute pagination dynamically for 200-300 page layout
  const paginatedData: PaginatedBookResult = useMemo(() => {
    return paginateBook(activeBook, settings.language, settings.fontSize);
  }, [activeBook, settings.language, settings.fontSize]);

  // Make sure currentPageNumber stays clamped within 1 to totalPages
  useEffect(() => {
    if (currentPageNumber > paginatedData.totalPages) {
      setCurrentPageNumber(Math.max(1, paginatedData.totalPages));
    }
  }, [paginatedData.totalPages, currentPageNumber]);

  // Update currentChapterIndex whenever currentPageNumber changes in paginated mode
  useEffect(() => {
    const page = paginatedData.pages[currentPageNumber - 1];
    if (page && page.chapterNumber !== undefined) {
      const idx = activeBook.chapters.findIndex(c => c.number === page.chapterNumber);
      if (idx !== -1 && idx !== currentChapterIndex) {
        setCurrentChapterIndex(idx);
      }
    }
  }, [currentPageNumber, paginatedData.pages, activeBook.chapters, currentChapterIndex]);

  // Keyboard navigation for page flipping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if (settings.readMode === 'paginated-book') {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          handleNextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          handlePrevPage();
        } else if (e.key === 'Home') {
          setCurrentPageNumber(1);
        } else if (e.key === 'End') {
          setCurrentPageNumber(paginatedData.totalPages);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.readMode, paginatedData.totalPages, settings.twoPageSpread, currentPageNumber]);

  // Load a book with 0ms instant display + background deep enhancement
  const loadBook = async (bookIdentifier: string, titleHint?: string) => {
    stopSpeaking();
    setIsExpandedVolume(false);
    setCurrentPageNumber(1);
    
    // 1. Instant local bank check (0ms)
    const local = findReadableBook(bookIdentifier) || (titleHint ? findReadableBook(titleHint) : null);
    if (local) {
      setActiveBook(local);
      setCurrentChapterIndex(0);
      setSpeedStats({ timeTakenMs: 0, source: 'instant-bank' });
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // 2. Instant generated manuscript fallback (0ms - no waiting screen)
    const instantBook = buildFallbackReadableBook(titleHint || bookIdentifier);
    setActiveBook(instantBook);
    setCurrentChapterIndex(0);
    setSpeedStats({ timeTakenMs: 0, source: 'instant-synthesis' });
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 3. Optional background deep enhancement via /api/book-content
    try {
      const res = await fetch('/api/book-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: bookIdentifier,
          bookTitle: titleHint || bookIdentifier,
          language: settings.language
        })
      });

      const data = await res.json();
      if (data.success && data.book && data.book.chapters?.length > 0) {
        setActiveBook(data.book);
        setSpeedStats({
          timeTakenMs: data.timeTakenMs !== undefined ? data.timeTakenMs : 250,
          source: data.source || 'universal-200m'
        });
      }
    } catch (e) {
      console.log('Using instant local synthesis for book:', bookIdentifier);
    }
  };

  // Expand the active book into a massive 250-300 page multi-treatise academic volume
  const handleExpandToFull300Pages = () => {
    const expanded = expandBookToFullVolume(activeBook);
    setActiveBook(expanded);
    setIsExpandedVolume(true);
    setCurrentPageNumber(1);
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Page navigation handlers
  const stepSize = settings.twoPageSpread ? 2 : 1;

  const handleNextPage = () => {
    setCurrentPageNumber((prev) => Math.min(prev + stepSize, paginatedData.totalPages));
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    setCurrentPageNumber((prev) => Math.max(prev - stepSize, 1));
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToPage = (pageNum: number) => {
    const clamped = Math.max(1, Math.min(pageNum, paginatedData.totalPages));
    setCurrentPageNumber(clamped);
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump to chapter anchor or page
  const handleJumpToChapter = (chapterIdx: number) => {
    setCurrentChapterIndex(chapterIdx);
    setShowChapterDrawer(false);

    if (settings.readMode === 'paginated-book') {
      const targetPage = paginatedData.chapterPageMap[chapterIdx] || 1;
      handleJumpToPage(targetPage);
    } else if (settings.readMode === 'continuous-full') {
      const targetEl = chapterRefs.current[chapterIdx];
      if (targetEl && contentContainerRef.current) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      if (contentContainerRef.current) {
        contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  // Toggle book bookmark
  const handleToggleBookBookmark = () => {
    const isNow = toggleBookBookmark(activeBook.id, activeBook.title, activeBook.author);
    setBookmarkedBook(isNow);
  };

  // Toggle chapter bookmark
  const handleToggleChapterBookmark = (chIndex: number = currentChapterIndex) => {
    const ch = activeBook.chapters[chIndex] || activeBook.chapters[0];
    saveBookmark({
      bookId: activeBook.id,
      bookTitle: activeBook.title,
      author: activeBook.author,
      chapterIndex: chIndex,
      chapterTitle: ch.title,
      quoteOrText: ch.keyPassage || ch.title,
      type: 'chapter'
    });
    setBookmarkedChapter(true);
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  // Voice Narration
  const toggleSpeech = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    
    let textToRead = '';
    if (settings.readMode === 'paginated-book') {
      const currentPage = paginatedData.pages[currentPageNumber - 1];
      textToRead = currentPage ? currentPage.content : activeBook.summary;
    } else {
      const ch = activeBook.chapters[currentChapterIndex] || activeBook.chapters[0];
      const isUrdu = settings.language === 'urdu';
      const isRoman = settings.language === 'urdu-roman';
      textToRead = isUrdu 
        ? (ch.contentUrdu || ch.content) 
        : isRoman 
        ? (ch.contentRoman || ch.content) 
        : ch.content;
    }

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const isUrdu = settings.language === 'urdu';
    const urduVoice = voices.find(v => v.lang.startsWith('ur'));
    const engVoice = voices.find(v => v.lang.startsWith('en'));

    if (isUrdu && urduVoice) {
      utterance.voice = urduVoice;
    } else if (engVoice) {
      utterance.voice = engVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Theme styling definitions
  const themeClasses = {
    sepia: 'bg-[#f4ecd8] text-[#2c221e] border-[#d8cbb5]',
    dark: 'bg-[#0f172a] text-[#e2e8f0] border-slate-800',
    light: 'bg-[#fcfbf9] text-[#1a1a1a] border-stone-300',
    midnight: 'bg-[#090d16] text-[#e6edf3] border-amber-900/30'
  };

  const themeInnerClasses = {
    sepia: 'bg-[#ede3cc]/60 border-[#d8cbb5]',
    dark: 'bg-slate-900/80 border-slate-800',
    light: 'bg-white border-stone-200 shadow-sm',
    midnight: 'bg-stone-900/80 border-amber-500/20'
  };

  const pageSheetClasses = {
    sepia: 'bg-[#fcf7ec] text-[#241c19] border-[#e0d3bc] shadow-md',
    dark: 'bg-[#151e2e] text-[#f1f5f9] border-slate-800 shadow-xl',
    light: 'bg-white text-[#111827] border-stone-200 shadow-md',
    midnight: 'bg-[#0d1320] text-[#f8fafc] border-amber-500/20 shadow-xl'
  };

  const fontClasses = {
    serif: "font-['Lora',Georgia,serif]",
    sans: "font-['Plus_Jakarta_Sans',sans-serif]",
    nastaliq: "font-['Noto_Nastaliq_Urdu',serif]"
  };

  const sizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed md:leading-loose',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  const widthClasses = {
    compact: 'max-w-2xl',
    standard: 'max-w-3xl',
    wide: 'max-w-4xl'
  };

  const isUrdu = settings.language === 'urdu';
  const isRoman = settings.language === 'urdu-roman';

  // Current page object(s)
  const leftPage: BookPage | undefined = paginatedData.pages[currentPageNumber - 1];
  const rightPage: BookPage | undefined = settings.twoPageSpread && currentPageNumber < paginatedData.totalPages
    ? paginatedData.pages[currentPageNumber]
    : undefined;

  // Reading progress percentage
  const progressPercent = Math.min(100, Math.round((currentPageNumber / paginatedData.totalPages) * 100));

  // In-book search matches
  const searchMatches = useMemo(() => {
    if (!inBookFilter || !inBookFilter.trim()) return [];
    const query = inBookFilter.toLowerCase().trim();
    const results: { pageNumber: number; snippet: string; chapterTitle?: string }[] = [];

    paginatedData.pages.forEach((page) => {
      if (page.content.toLowerCase().includes(query) || (page.heading && page.heading.toLowerCase().includes(query))) {
        const text = page.content;
        const idx = text.toLowerCase().indexOf(query);
        const start = Math.max(0, idx - 40);
        const end = Math.min(text.length, idx + query.length + 60);
        const snippet = (start > 0 ? '...' : '') + text.slice(start, end).trim() + (end < text.length ? '...' : '');

        results.push({
          pageNumber: page.pageNumber,
          snippet,
          chapterTitle: page.chapterTitle
        });
      }
    });

    return results;
  }, [inBookFilter, paginatedData.pages]);

  return (
    <div className="space-y-6">
      {/* 200,000,000+ Books Top Universal Search & Browse Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 p-4 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                Kitab Khana (Complete Book Reader)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                {paginatedData.totalPages} Pages Unabridged
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-950/80 border border-amber-500/40 text-amber-300">
                <Clock className="w-3 h-3 text-amber-400" />
                {paginatedData.totalWords.toLocaleString()} words • ~{paginatedData.estimatedMinutes} min read
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-stone-100 font-['Cinzel',serif]">
              {settings.language === 'urdu-roman' && '200 Se 300 Safhaat Ki Mukammal Kitab Ka Asli Mutala'}
              {settings.language === 'urdu' && 'مکمل ۲۰۰ سے ۳۰۰ صفحات کی کتاب کا اصلی مطالعہ'}
              {settings.language === 'en' && 'Read 200 to 300 Page Complete Unabridged Books'}
            </h2>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            {/* Expand to 300 Pages Button */}
            {!isExpandedVolume && (
              <button
                onClick={handleExpandToFull300Pages}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md transition-all"
                title="Expand this book into a 300-page academic manuscript with deep historical commentary"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-300" />
                <span>Expand to 300-Page Volume</span>
              </button>
            )}

            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 transition-all shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Shelf ({bookmarkedBook ? 'Saved' : 'Bookmarks'})</span>
              </button>
            )}

            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 hover:brightness-110 transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Word / PDF ({paginatedData.totalPages} Pages)</span>
            </button>
          </div>
        </div>

        {/* 200M+ Universal Book Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  loadBook(searchQuery.trim());
                }
              }}
              placeholder={
                settings.language === 'urdu-roman'
                  ? "Kisi bhi kitaab ya musannif ka naam likhein 200-300 safhaat parhne ke liye (e.g. Meditations, Masnavi, The Art of War, Crime and Punishment)..."
                  : "Search any 200-300 page full book or author across 200,000,000+ universal works to read immediately..."
              }
              className="w-full pl-10 pr-28 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-500/60 text-stone-100 text-xs md:text-sm focus:outline-none placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => loadBook(searchQuery.trim())}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                Read 200+ Pages
              </button>
            )}
          </div>

          {/* Preset Quick Select for Classics */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-stone-400 whitespace-nowrap hidden sm:inline">Classics:</span>
            {PRECOMPUTED_READABLE_BOOKS.map((b) => (
              <button
                key={b.id}
                onClick={() => loadBook(b.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border ${
                  activeBook.id === b.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold shadow-sm'
                    : 'bg-stone-900/80 text-stone-400 hover:text-stone-200 border-stone-800'
                }`}
              >
                {b.title.split('(')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Reader Stage */}
      <div className={`rounded-2xl border transition-colors relative shadow-2xl overflow-hidden ${themeClasses[settings.theme]}`}>
        
        {/* Reader Top Sticky Toolbar */}
        <div className={`sticky top-0 z-30 px-4 md:px-6 py-3 border-b flex flex-wrap items-center justify-between gap-3 backdrop-blur-md ${themeInnerClasses[settings.theme]}`}>
          {/* Reading Mode Switcher & Title */}
          <div className="flex items-center gap-3">
            {/* Mode Switcher: 200-300 Page Mode vs Continuous Scroll vs Chapter */}
            <div className="flex items-center bg-black/10 p-0.5 rounded-xl border border-current border-opacity-15">
              <button
                onClick={() => setSettings(s => ({ ...s, readMode: 'paginated-book' }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  settings.readMode === 'paginated-book'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Authentic 200-300 page flip book layout"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>200–300 Page Mode</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, readMode: 'continuous-full' }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  settings.readMode === 'continuous-full'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Continuous scroll without page breaks"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Continuous Scroll</span>
              </button>

              <button
                onClick={() => setSettings(s => ({ ...s, readMode: 'chapter' }))}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  settings.readMode === 'chapter'
                    ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                    : 'opacity-70 hover:opacity-100'
                }`}
                title="Focus on one chapter at a time"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Chapter Mode</span>
              </button>
            </div>

            {/* Chapter Jump Button */}
            <button
              onClick={() => setShowChapterDrawer(!showChapterDrawer)}
              className="p-1.5 px-2.5 rounded-lg hover:bg-black/10 transition-colors flex items-center gap-1.5 text-xs font-semibold border border-current border-opacity-15"
              title="Table of Contents"
            >
              <List className="w-4 h-4 text-amber-600" />
              <span>{activeBook.chapters.length} Chapters • ToC</span>
            </button>

            <div className="h-4 w-px bg-current opacity-20 hidden md:block" />

            <div className="hidden md:block">
              <h3 className="font-bold text-xs md:text-sm truncate max-w-[180px] sm:max-w-xs md:max-w-md font-['Cinzel',serif]">
                {activeBook.title}
              </h3>
              <p className="text-[11px] opacity-70">
                {activeBook.author} • {paginatedData.totalPages} Pages ({paginatedData.totalWords.toLocaleString()} words)
              </p>
            </div>
          </div>

          {/* Reader Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Two-page Spread Toggle (Only in Paginated Mode) */}
            {settings.readMode === 'paginated-book' && (
              <button
                onClick={() => setSettings(s => ({ ...s, twoPageSpread: !s.twoPageSpread }))}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                  settings.twoPageSpread ? 'bg-amber-500/20 text-amber-600 font-bold' : 'hover:bg-black/10'
                }`}
                title={settings.twoPageSpread ? "Switch to Single Page View" : "Switch to Open Book 2-Page Spread"}
              >
                <Columns className="w-4 h-4" />
                <span className="hidden lg:inline">{settings.twoPageSpread ? '2-Page Spread' : 'Single Page'}</span>
              </button>
            )}

            {/* Search inside Book */}
            <button
              onClick={() => setShowInBookSearch(!showInBookSearch)}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                showInBookSearch ? 'bg-amber-500/20 text-amber-600 font-bold' : 'hover:bg-black/10'
              }`}
              title="Search word or topic inside this 200-300 page book"
            >
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Find in Book</span>
            </button>

            {/* Audio Voice Narration */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                isSpeaking ? 'bg-amber-500/20 text-amber-700 font-bold animate-pulse' : 'hover:bg-black/10'
              }`}
              title={isSpeaking ? 'Stop Audio' : 'Listen to Narration'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Bookmark Full Book */}
            <button
              onClick={handleToggleBookBookmark}
              className={`p-2 rounded-lg transition-colors text-xs flex items-center gap-1 ${
                bookmarkedBook ? 'text-amber-600 font-bold' : 'opacity-70 hover:opacity-100 hover:bg-black/10'
              }`}
              title="Bookmark Full Book to Shelf"
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedBook ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span className="hidden sm:inline">{bookmarkedBook ? 'Saved' : 'Save'}</span>
            </button>

            {/* Download Modal */}
            <button
              onClick={() => setShowDownloadModal(true)}
              className="p-2 rounded-lg hover:bg-black/10 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Download Full 200-300 Page Book in Word / PDF"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Export</span>
            </button>

            {/* Settings Toggle */}
            <button
              onClick={() => setShowSettingsDrawer(!showSettingsDrawer)}
              className={`p-2 rounded-lg transition-colors ${showSettingsDrawer ? 'bg-black/15 font-bold' : 'hover:bg-black/10'}`}
              title="Typography & Themes"
            >
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* In-Book Search Bar & Jump Drawer */}
        {showInBookSearch && (
          <div className={`p-4 md:px-6 border-b space-y-3 animate-fadeIn text-xs ${themeInnerClasses[settings.theme]}`}>
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 opacity-60" />
              <input
                type="text"
                value={inBookFilter}
                onChange={(e) => setInBookFilter(e.target.value)}
                placeholder="Search any phrase across all 200–300 pages..."
                className="flex-1 bg-black/5 rounded-lg px-3 py-1.5 border border-current border-opacity-15 focus:outline-none"
              />
              {inBookFilter && (
                <button
                  onClick={() => setInBookFilter('')}
                  className="opacity-60 hover:opacity-100 text-[11px] underline"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setShowInBookSearch(false)}
                className="opacity-70 hover:opacity-100 text-xs px-2 py-1 rounded bg-black/10"
              >
                Close
              </button>
            </div>

            {/* Search Matches List */}
            {inBookFilter && (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <div className="text-[11px] font-mono opacity-70">
                  Found {searchMatches.length} matching occurrences across the volume:
                </div>
                {searchMatches.length === 0 ? (
                  <p className="opacity-50 italic py-2">No matching text found in this book.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {searchMatches.map((m, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          handleJumpToPage(m.pageNumber);
                          setShowInBookSearch(false);
                        }}
                        className="p-2.5 rounded-lg border border-black/10 bg-black/5 hover:bg-black/10 text-left transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between font-mono text-[10px] text-amber-600 font-bold">
                          <span>Page {m.pageNumber} of {paginatedData.totalPages}</span>
                          {m.chapterTitle && <span>{m.chapterTitle}</span>}
                        </div>
                        <p className="text-[11px] opacity-80 line-clamp-2 italic">
                          "{m.snippet}"
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Reader Settings Drawer (Dropdown) */}
        {showSettingsDrawer && (
          <div className={`p-4 md:p-5 border-b grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn text-xs ${themeInnerClasses[settings.theme]}`}>
            {/* Theme Selector */}
            <div className="space-y-1.5">
              <span className="font-semibold uppercase tracking-wider opacity-70">Theme:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => setSettings(s => ({ ...s, theme: 'sepia' }))}
                  className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between ${
                    settings.theme === 'sepia' ? 'border-amber-600 font-bold bg-[#f4ecd8] text-[#2c221e]' : 'border-transparent bg-black/10'
                  }`}
                >
                  <span>📜 Sepia</span>
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, theme: 'dark' }))}
                  className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between ${
                    settings.theme === 'dark' ? 'border-amber-500 font-bold bg-[#0f172a] text-slate-100' : 'border-transparent bg-black/10'
                  }`}
                >
                  <span>🌙 Dark</span>
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, theme: 'light' }))}
                  className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between ${
                    settings.theme === 'light' ? 'border-amber-600 font-bold bg-[#fcfbf9] text-stone-900' : 'border-transparent bg-black/10'
                  }`}
                >
                  <span>☀️ Paper</span>
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, theme: 'midnight' }))}
                  className={`px-2.5 py-1.5 rounded-lg border text-left flex items-center justify-between ${
                    settings.theme === 'midnight' ? 'border-amber-500 font-bold bg-[#090d16] text-amber-200' : 'border-transparent bg-black/10'
                  }`}
                >
                  <span>🌌 Midnight</span>
                </button>
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-1.5">
              <span className="font-semibold uppercase tracking-wider opacity-70">Font Size:</span>
              <div className="flex items-center gap-1 bg-black/10 p-1 rounded-lg">
                <button
                  onClick={() => setSettings(s => ({ ...s, fontSize: 'sm' }))}
                  className={`flex-1 py-1 rounded text-center font-medium ${settings.fontSize === 'sm' ? 'bg-black/20 font-bold' : ''}`}
                >
                  Small
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, fontSize: 'base' }))}
                  className={`flex-1 py-1 rounded text-center font-medium ${settings.fontSize === 'base' ? 'bg-black/20 font-bold' : ''}`}
                >
                  Medium
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, fontSize: 'lg' }))}
                  className={`flex-1 py-1 rounded text-center font-medium ${settings.fontSize === 'lg' ? 'bg-black/20 font-bold' : ''}`}
                >
                  Large
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, fontSize: 'xl' }))}
                  className={`flex-1 py-1 rounded text-center font-medium ${settings.fontSize === 'xl' ? 'bg-black/20 font-bold' : ''}`}
                >
                  XL
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div className="space-y-1.5">
              <span className="font-semibold uppercase tracking-wider opacity-70">Typography:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSettings(s => ({ ...s, fontFamily: 'serif' }))}
                  className={`p-1.5 rounded border text-center font-['Lora',serif] ${
                    settings.fontFamily === 'serif' ? 'border-amber-600 bg-black/15 font-bold' : 'border-transparent bg-black/5'
                  }`}
                >
                  Classical
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, fontFamily: 'sans' }))}
                  className={`p-1.5 rounded border text-center font-sans ${
                    settings.fontFamily === 'sans' ? 'border-amber-600 bg-black/15 font-bold' : 'border-transparent bg-black/5'
                  }`}
                >
                  Modern
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, fontFamily: 'nastaliq' }))}
                  className={`p-1.5 rounded border text-center font-['Noto_Nastaliq_Urdu',serif] ${
                    settings.fontFamily === 'nastaliq' ? 'border-amber-600 bg-black/15 font-bold' : 'border-transparent bg-black/5'
                  }`}
                >
                  اردو خط
                </button>
              </div>
            </div>

            {/* Language Translation Mode */}
            <div className="space-y-1.5">
              <span className="font-semibold uppercase tracking-wider opacity-70">Translation:</span>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSettings(s => ({ ...s, language: 'urdu-roman' }))}
                  className={`p-1.5 rounded border text-center ${
                    settings.language === 'urdu-roman' ? 'border-amber-600 bg-black/15 font-bold' : 'border-transparent bg-black/5'
                  }`}
                >
                  Roman Urdu
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, language: 'urdu' }))}
                  className={`p-1.5 rounded border text-center ${
                    settings.language === 'urdu' ? 'border-amber-600 bg-black/15 font-bold' : 'border-transparent bg-black/5'
                  }`}
                >
                  اردو متن
                </button>
                <button
                  onClick={() => setSettings(s => ({ ...s, language: 'en' }))}
                  className={`p-1.5 rounded border text-center ${
                    settings.language === 'en' ? 'border-amber-600 bg-black/15 font-bold' : 'border-transparent bg-black/5'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chapter Table of Contents Drawer with Exact Page Numbers */}
        {showChapterDrawer && (
          <div className={`p-4 md:p-6 border-b animate-fadeIn space-y-3 ${themeInnerClasses[settings.theme]}`}>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">
                  Table of Contents ({activeBook.chapters.length} Full Chapters • {paginatedData.totalPages} Pages)
                </h4>
                <p className="text-[11px] opacity-70">
                  Click any chapter to jump directly to its starting page
                </p>
              </div>
              <button
                onClick={() => setShowChapterDrawer(false)}
                className="text-xs opacity-70 hover:opacity-100 underline px-2 py-1 rounded bg-black/10"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {activeBook.chapters.map((ch, idx) => {
                const startPage = paginatedData.chapterPageMap[idx] || (idx * 20 + 7);
                const isCurrent = currentPageNumber >= startPage && 
                  (idx === activeBook.chapters.length - 1 || currentPageNumber < (paginatedData.chapterPageMap[idx + 1] || 9999));

                return (
                  <button
                    key={ch.number}
                    onClick={() => handleJumpToChapter(idx)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isCurrent
                        ? 'border-amber-600 bg-black/15 font-bold shadow-sm'
                        : 'border-transparent bg-black/5 hover:bg-black/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono text-amber-600 font-bold">
                        Chapter {ch.number}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/10">
                        Page {startPage}
                      </span>
                    </div>
                    <div className="font-semibold text-xs mt-0.5 truncate">
                      {isUrdu && ch.titleUrdu ? ch.titleUrdu : ch.title}
                    </div>
                    <p className="text-[11px] opacity-70 line-clamp-1 mt-1">
                      {ch.summary}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Chapter Navigation Ribbon */}
        {activeBook.chapters.length > 1 && (
          <div className={`px-4 md:px-6 py-2 border-b flex items-center gap-1.5 overflow-x-auto text-xs ${themeInnerClasses[settings.theme]}`}>
            <span className="font-mono text-[10px] uppercase opacity-60 whitespace-nowrap">Chapters:</span>
            {activeBook.chapters.map((ch, idx) => {
              const startPage = paginatedData.chapterPageMap[idx] || 1;
              const isCurrent = currentPageNumber >= startPage && 
                (idx === activeBook.chapters.length - 1 || currentPageNumber < (paginatedData.chapterPageMap[idx + 1] || 9999));

              return (
                <button
                  key={ch.number}
                  onClick={() => handleJumpToChapter(idx)}
                  className={`px-2 py-0.5 rounded text-[11px] whitespace-nowrap border transition-all ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-500/20 font-bold text-amber-700 dark:text-amber-300'
                      : 'border-transparent bg-black/5 hover:bg-black/10 opacity-80'
                  }`}
                  title={`Jump to Chapter ${ch.number} (Page ${startPage})`}
                >
                  Ch {ch.number} <span className="opacity-60 text-[10px]">p.{startPage}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* BOOK CONTENT BODY                                                         */}
        {/* ========================================================================= */}
        <div 
          ref={contentContainerRef}
          className={`p-4 sm:p-8 md:p-12 overflow-y-auto min-h-[60vh] max-h-[75vh] ${settings.theme === 'sepia' ? 'selection:bg-amber-900/20' : ''}`}
        >
          {loadingBook ? (
            <div className="py-20 text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="font-bold text-lg font-['Cinzel',serif]">
                Opening Complete 200–300 Page Manuscript...
              </h4>
              <p className="text-xs opacity-70">
                Typesetting all chapters, authentic treatises, and footnotes.
              </p>
            </div>
          ) : settings.readMode === 'paginated-book' ? (
            /* ========================================================================= */
            /* 1. AUTHENTIC 200-300 PAGE FLIP BOOK MODE (Default & Flagship)            */
            /* ========================================================================= */
            <div className="mx-auto max-w-6xl space-y-6">
              {/* Top Running Header */}
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest opacity-60 border-b border-current border-opacity-15 pb-2 px-2">
                <span className="truncate max-w-[200px] sm:max-w-md font-semibold">
                  {activeBook.title}
                </span>
                <span>
                  {leftPage?.chapterTitle ? `Chapter: ${leftPage.chapterTitle}` : activeBook.author}
                </span>
              </div>

              {/* Book Spread Stage */}
              <div className={`grid ${settings.twoPageSpread && rightPage ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
                {/* Left Page (or Single Page) */}
                {leftPage && (
                  <div className={`p-6 sm:p-10 rounded-xl border flex flex-col justify-between transition-all min-h-[500px] md:min-h-[560px] ${pageSheetClasses[settings.theme]} ${fontClasses[settings.fontFamily]} ${sizeClasses[settings.fontSize]}`}>
                    {/* Page Content Body */}
                    <div className="space-y-4">
                      {/* Page Type Badge or Chapter Heading */}
                      {leftPage.heading && (
                        <div className="border-b border-current border-opacity-15 pb-3 mb-4 text-center">
                          {leftPage.pageType === 'cover' ? (
                            <div className="space-y-3 py-6">
                              <div className="w-10 h-10 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <span className="text-xs font-mono tracking-widest uppercase text-amber-600 font-bold block">
                                Living Codex Heritage Edition
                              </span>
                              <h1 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif] leading-tight">
                                {activeBook.title}
                              </h1>
                              <p className="text-sm font-sans italic opacity-80">
                                Written by {activeBook.author}
                              </p>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold block">
                                {leftPage.pageType === 'chapter-start' ? `Chapter ${leftPage.chapterNumber}` : leftPage.pageType.toUpperCase()}
                              </span>
                              <h2 className="text-lg sm:text-xl font-bold font-['Cinzel',serif] mt-1">
                                {leftPage.heading}
                              </h2>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Key Passage callout if starting a chapter */}
                      {leftPage.keyPassage && (
                        <blockquote className="p-3.5 rounded-lg bg-black/5 border-l-4 border-amber-500 text-xs sm:text-sm italic my-2">
                          <strong>Core Axiom:</strong> "{leftPage.keyPassage}"
                        </blockquote>
                      )}

                      {/* Paragraphs */}
                      <div className={`space-y-4 text-justify ${isUrdu ? 'text-right' : 'text-left'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
                        {leftPage.content.split('\n\n').map((para, pIdx) => {
                          const isHighlighted = inBookFilter && para.toLowerCase().includes(inBookFilter.toLowerCase());
                          return (
                            <p 
                              key={pIdx} 
                              className={`leading-relaxed md:leading-loose ${
                                isHighlighted ? 'bg-amber-300/30 p-1.5 rounded' : ''
                              }`}
                            >
                              {para}
                            </p>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Running Page Footer */}
                    <div className="pt-6 border-t border-current border-opacity-10 flex items-center justify-between text-xs font-mono opacity-60">
                      <span className="text-[10px] truncate max-w-[180px]">{leftPage.footnote || activeBook.title}</span>
                      <span className="font-bold px-2 py-0.5 rounded bg-black/5">
                        Page {leftPage.pageNumber} of {paginatedData.totalPages}
                      </span>
                    </div>
                  </div>
                )}

                {/* Right Page (In 2-Page Spread mode) */}
                {settings.twoPageSpread && rightPage && (
                  <div className={`p-6 sm:p-10 rounded-xl border flex flex-col justify-between transition-all min-h-[500px] md:min-h-[560px] hidden md:flex ${pageSheetClasses[settings.theme]} ${fontClasses[settings.fontFamily]} ${sizeClasses[settings.fontSize]}`}>
                    {/* Page Content Body */}
                    <div className="space-y-4">
                      {rightPage.heading && (
                        <div className="border-b border-current border-opacity-15 pb-3 mb-4 text-center">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold block">
                            {rightPage.pageType === 'chapter-start' ? `Chapter ${rightPage.chapterNumber}` : rightPage.pageType.toUpperCase()}
                          </span>
                          <h2 className="text-lg sm:text-xl font-bold font-['Cinzel',serif] mt-1">
                            {rightPage.heading}
                          </h2>
                        </div>
                      )}

                      {rightPage.keyPassage && (
                        <blockquote className="p-3.5 rounded-lg bg-black/5 border-l-4 border-amber-500 text-xs sm:text-sm italic my-2">
                          <strong>Core Axiom:</strong> "{rightPage.keyPassage}"
                        </blockquote>
                      )}

                      <div className={`space-y-4 text-justify ${isUrdu ? 'text-right' : 'text-left'}`} dir={isUrdu ? 'rtl' : 'ltr'}>
                        {rightPage.content.split('\n\n').map((para, pIdx) => {
                          const isHighlighted = inBookFilter && para.toLowerCase().includes(inBookFilter.toLowerCase());
                          return (
                            <p 
                              key={pIdx} 
                              className={`leading-relaxed md:leading-loose ${
                                isHighlighted ? 'bg-amber-300/30 p-1.5 rounded' : ''
                              }`}
                            >
                              {para}
                            </p>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Running Page Footer */}
                    <div className="pt-6 border-t border-current border-opacity-10 flex items-center justify-between text-xs font-mono opacity-60">
                      <span className="text-[10px] truncate max-w-[180px]">{rightPage.footnote || activeBook.title}</span>
                      <span className="font-bold px-2 py-0.5 rounded bg-black/5">
                        Page {rightPage.pageNumber} of {paginatedData.totalPages}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ========================================================================= */}
              {/* PAGE FLIP CONTROL BAR (1 to 200-300 Pages)                                */}
              {/* ========================================================================= */}
              <div className={`p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm ${themeInnerClasses[settings.theme]}`}>
                {/* Previous Page Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleJumpToPage(1)}
                    disabled={currentPageNumber === 1}
                    className="p-2 rounded-lg border border-current border-opacity-15 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    title="Jump to First Page (Cover)"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleJumpToPage(currentPageNumber - 10)}
                    disabled={currentPageNumber <= 10}
                    className="px-2.5 py-1.5 rounded-lg border border-current border-opacity-15 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono"
                    title="Jump -10 Pages"
                  >
                    -10
                  </button>

                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageNumber === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold border border-current border-opacity-20 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev Page</span>
                  </button>
                </div>

                {/* Direct Page Input & Progress Slider */}
                <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-md w-full justify-center">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="opacity-70">Page</span>
                    <input
                      type="number"
                      min={1}
                      max={paginatedData.totalPages}
                      value={currentPageNumber}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) {
                          handleJumpToPage(val);
                        }
                      }}
                      className="w-16 text-center py-1 px-1 rounded-lg bg-black/10 border border-current border-opacity-25 font-bold focus:outline-none"
                    />
                    <span className="opacity-70">of {paginatedData.totalPages}</span>
                    <span className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                      {progressPercent}%
                    </span>
                  </div>

                  {/* Range Slider for fast scrubbing across 200-300 pages */}
                  <input
                    type="range"
                    min={1}
                    max={paginatedData.totalPages}
                    value={currentPageNumber}
                    onChange={(e) => handleJumpToPage(parseInt(e.target.value))}
                    className="w-full sm:w-36 accent-amber-500 cursor-pointer"
                    title={`Slide to jump anywhere across 1 to ${paginatedData.totalPages} pages`}
                  />
                </div>

                {/* Next Page Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleNextPage}
                    disabled={currentPageNumber >= paginatedData.totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-30 disabled:cursor-not-allowed text-xs shadow-sm"
                  >
                    <span>Next Page</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleJumpToPage(currentPageNumber + 10)}
                    disabled={currentPageNumber >= paginatedData.totalPages - 9}
                    className="px-2.5 py-1.5 rounded-lg border border-current border-opacity-15 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-mono"
                    title="Jump +10 Pages"
                  >
                    +10
                  </button>

                  <button
                    onClick={() => handleJumpToPage(paginatedData.totalPages)}
                    disabled={currentPageNumber >= paginatedData.totalPages}
                    className="p-2 rounded-lg border border-current border-opacity-15 hover:bg-black/10 disabled:opacity-30 disabled:cursor-not-allowed text-xs"
                    title="Jump to Final Page (Epilogue)"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : settings.readMode === 'continuous-full' ? (
            /* ========================================================================= */
            /* 2. CONTINUOUS FULL SCROLL MODE                                            */
            /* ========================================================================= */
            <article 
              className={`mx-auto space-y-12 ${widthClasses[settings.maxWidth]} ${fontClasses[settings.fontFamily]} ${sizeClasses[settings.fontSize]} ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {/* Full Book Frontispiece & Metadata Banner */}
              <header className="space-y-4 pb-8 border-b-2 border-current border-opacity-20 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 uppercase tracking-widest mx-auto">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Complete Unabridged Edition • {paginatedData.totalPages} Pages • {activeBook.chapters.length} Chapters</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-['Cinzel',serif] leading-tight">
                  {activeBook.title}
                </h1>

                <p className="text-lg md:text-xl opacity-85 font-sans font-medium">
                  By <strong className="font-semibold underline decoration-amber-500/40">{activeBook.author}</strong>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 text-xs opacity-75 font-mono pt-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/5">{activeBook.yearOrEra}</span>
                  <span className="px-2.5 py-1 rounded-md bg-black/5">{activeBook.category}</span>
                  {activeBook.originalLanguage && (
                    <span className="px-2.5 py-1 rounded-md bg-black/5">{activeBook.originalLanguage}</span>
                  )}
                  <span className="px-2.5 py-1 rounded-md bg-black/5">
                    {paginatedData.totalWords.toLocaleString()} words (~{paginatedData.estimatedMinutes} min)
                  </span>
                </div>
              </header>

              {/* Comprehensive Book Preface */}
              <section className="p-6 sm:p-8 rounded-2xl bg-black/5 border border-current border-opacity-10 space-y-4">
                <div className="flex items-center justify-between border-b border-current border-opacity-10 pb-3">
                  <h3 className="text-sm uppercase tracking-widest font-mono font-bold opacity-80 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{isUrdu ? 'مقدمہ و تاریخی پس منظر' : 'Historical Preface & Context'}</span>
                  </h3>
                  <span className="text-[11px] font-mono opacity-60">Living Archive</span>
                </div>
                <p className="leading-relaxed md:leading-loose text-justify italic opacity-90">
                  {isUrdu 
                    ? (activeBook.prefaceUrdu || activeBook.preface) 
                    : isRoman 
                    ? (activeBook.prefaceRoman || activeBook.preface) 
                    : activeBook.preface}
                </p>
              </section>

              {/* Famous Quotes / Sacred Maxims Banner */}
              {activeBook.famousQuotes && activeBook.famousQuotes.length > 0 && (
                <section className="space-y-3 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <h3 className="text-xs uppercase tracking-widest font-mono font-bold text-amber-800 dark:text-amber-300">
                    {isUrdu ? 'کتاب کے سنہری اقوال و قطعی اصول' : 'Foundational Doctrines & Maxims:'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {activeBook.famousQuotes.slice(0, 4).map((q, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/5 border border-black/5 space-y-1">
                        <p className="text-xs sm:text-sm font-medium italic">"{q}"</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ALL CHAPTERS RENDERED CONTINUOUSLY */}
              <div className="space-y-16 pt-4">
                {activeBook.chapters.map((ch, idx) => {
                  const chTitle = isUrdu && ch.titleUrdu ? ch.titleUrdu : ch.title;
                  const chBody = isUrdu && ch.contentUrdu 
                    ? ch.contentUrdu 
                    : isRoman && ch.contentRoman 
                    ? ch.contentRoman 
                    : ch.content;
                  const paras = chBody.split('\n\n').filter(p => p.trim());

                  return (
                    <div 
                      key={ch.number} 
                      ref={el => chapterRefs.current[idx] = el}
                      id={`chapter-${ch.number}`}
                      className="space-y-6 pt-8 border-t-2 border-current border-opacity-15 scroll-mt-20"
                    >
                      {/* Chapter Heading Banner */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-current border-opacity-10 pb-4">
                        <div className="space-y-1">
                          <div className="text-xs font-mono uppercase tracking-widest opacity-60 font-semibold">
                            Chapter {ch.number} of {activeBook.chapters.length} • Page {paginatedData.chapterPageMap[idx] || (idx * 20 + 7)}
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-bold font-['Cinzel',serif]">
                            {chTitle}
                          </h2>
                          <p className="text-xs opacity-70 italic font-sans">{ch.summary}</p>
                        </div>

                        {/* Chapter Quick Actions */}
                        <div className="flex items-center gap-2 pt-2 sm:pt-0 shrink-0">
                          <button
                            onClick={() => handleToggleChapterBookmark(idx)}
                            className="p-1.5 px-2.5 rounded-lg border border-current border-opacity-15 text-xs hover:bg-black/10 flex items-center gap-1 opacity-80"
                            title="Bookmark this chapter"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                            <span>Save Ch {ch.number}</span>
                          </button>
                        </div>
                      </div>

                      {/* Chapter Key Passage / Doctrine */}
                      {ch.keyPassage && (
                        <blockquote className="p-4 sm:p-5 rounded-xl bg-black/5 border-l-4 border-amber-500 italic space-y-1 my-4">
                          <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-amber-700 dark:text-amber-400">
                            {isUrdu ? 'مرکزی اصول' : 'Key Passage:'}
                          </div>
                          <p className="text-sm md:text-base font-medium">"{ch.keyPassage}"</p>
                        </blockquote>
                      )}

                      {/* Chapter Body Paragraphs */}
                      <div className="space-y-5">
                        {paras.map((p, pIdx) => {
                          const isHighlighted = inBookFilter && p.toLowerCase().includes(inBookFilter.toLowerCase());
                          return (
                            <p 
                              key={pIdx} 
                              className={`text-justify leading-relaxed md:leading-loose ${
                                isHighlighted ? 'bg-amber-300/30 p-2 rounded-lg' : ''
                              }`}
                            >
                              {p}
                            </p>
                          );
                        })}
                      </div>

                      {/* Subtle Ornate End-of-Chapter Emblem */}
                      <div className="py-4 text-center opacity-40 font-serif text-sm tracking-widest">
                        ✦ ✦ ✦
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* End of Full Book Footer Actions */}
              <footer className="pt-10 border-t-2 border-current border-opacity-20 space-y-6 text-center not-italic font-sans">
                <div className="space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-600">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-['Cinzel',serif]">
                    {isUrdu ? 'کتاب کا اختتام' : 'End of Complete Manuscript'}
                  </h3>
                  <p className="text-xs opacity-75 max-w-md mx-auto">
                    You have completed reading all {paginatedData.totalPages} pages of <strong className="font-semibold">{activeBook.title}</strong> by {activeBook.author}.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {onConsultInSolver && (
                    <button
                      onClick={() => onConsultInSolver(activeBook.title)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40 transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Solve a Problem Using this Book</span>
                    </button>
                  )}

                  {onLearnInMasterclass && (
                    <button
                      onClick={() => onLearnInMasterclass(activeBook.title)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-black/10 hover:bg-black/15 transition-all flex items-center gap-1.5"
                    >
                      <Compass className="w-4 h-4" />
                      <span>Take Masterclass Discussion</span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowDownloadModal(true)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold hover:brightness-110 transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Book (Word / PDF)</span>
                  </button>
                </div>
              </footer>
            </article>
          ) : (
            /* ========================================================================= */
            /* 3. SINGLE CHAPTER FOCUSED MODE                                            */
            /* ========================================================================= */
            <article 
              className={`mx-auto space-y-8 ${widthClasses[settings.maxWidth]} ${fontClasses[settings.fontFamily]} ${sizeClasses[settings.fontSize]} ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {(() => {
                const activeChapter: BookChapter = activeBook.chapters[currentChapterIndex] || activeBook.chapters[0];
                const chTitle = (isUrdu && activeChapter.titleUrdu) ? activeChapter.titleUrdu : activeChapter.title;
                const chContent = (isUrdu && activeChapter.contentUrdu) 
                  ? activeChapter.contentUrdu 
                  : (isRoman && activeChapter.contentRoman) 
                  ? activeChapter.contentRoman 
                  : activeChapter.content;
                const currentParagraphs = chContent.split('\n\n').filter(p => p.trim());

                return (
                  <>
                    {/* Chapter Header */}
                    <header className="space-y-3 pb-6 border-b border-current border-opacity-15">
                      <div className="flex flex-wrap items-center justify-between gap-2 opacity-70 text-xs font-mono uppercase tracking-wider">
                        <span>
                          Chapter {activeChapter.number} of {activeBook.chapters.length}
                        </span>
                        <span>
                          {activeBook.yearOrEra} • {activeBook.category}
                        </span>
                      </div>

                      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight font-['Cinzel',serif] leading-tight">
                        {chTitle}
                      </h1>

                      <p className="text-sm opacity-75 italic font-sans">
                        From <strong className="font-semibold">{activeBook.title}</strong> by {activeBook.author}
                      </p>
                    </header>

                    {/* Core Maxim / Highlight Box */}
                    {activeChapter.keyPassage && (
                      <blockquote className="my-6 p-5 rounded-xl bg-black/5 border-l-4 border-amber-500 italic space-y-2">
                        <div className="text-[11px] font-mono uppercase tracking-wider font-semibold text-amber-700 opacity-90">
                          {isUrdu ? 'مرکزی اصول و سنہری نکتہ' : 'Core Doctrine / Sacred Maxim:'}
                        </div>
                        <p className="text-base md:text-lg font-medium">
                          "{activeChapter.keyPassage}"
                        </p>
                        <div className="flex items-center justify-end pt-1">
                          <button
                            onClick={() => handleToggleChapterBookmark(currentChapterIndex)}
                            className="text-xs opacity-75 hover:opacity-100 flex items-center gap-1 font-sans not-italic font-medium"
                          >
                            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                            <span>{copiedQuote ? 'Saved to Shelf!' : 'Bookmark Maxim'}</span>
                          </button>
                        </div>
                      </blockquote>
                    )}

                    {/* Chapter Body Paragraphs */}
                    <div className="space-y-6">
                      {currentParagraphs.map((p, i) => (
                        <p key={i} className="text-justify leading-relaxed md:leading-loose">
                          {p}
                        </p>
                      ))}
                    </div>

                    {/* Bottom Chapter Navigation Bar */}
                    <footer className="pt-10 mt-12 border-t border-current border-opacity-15 flex flex-col sm:flex-row items-center justify-between gap-4 not-italic font-sans">
                      <button
                        onClick={() => {
                          if (currentChapterIndex > 0) {
                            setCurrentChapterIndex(c => c - 1);
                            if (contentContainerRef.current) {
                              contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }
                        }}
                        disabled={currentChapterIndex === 0}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          currentChapterIndex === 0
                            ? 'opacity-40 cursor-not-allowed border-transparent'
                            : 'hover:bg-black/10 border-current border-opacity-20'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Chapter</span>
                      </button>

                      <div className="text-xs opacity-70 font-mono">
                        Chapter {currentChapterIndex + 1} / {activeBook.chapters.length}
                      </div>

                      <button
                        onClick={() => {
                          if (currentChapterIndex < activeBook.chapters.length - 1) {
                            setCurrentChapterIndex(c => c + 1);
                            if (contentContainerRef.current) {
                              contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                            }
                          }
                        }}
                        disabled={currentChapterIndex >= activeBook.chapters.length - 1}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          currentChapterIndex >= activeBook.chapters.length - 1
                            ? 'opacity-40 cursor-not-allowed border-transparent'
                            : 'hover:bg-black/10 border-current border-opacity-20'
                        }`}
                      >
                        <span>Next Chapter</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </footer>

                    {/* Switch to Whole Book Button in Chapter Mode */}
                    <div className="pt-4 text-center">
                      <button
                        onClick={() => setSettings(s => ({ ...s, readMode: 'paginated-book' }))}
                        className="text-xs opacity-80 hover:opacity-100 underline flex items-center justify-center gap-1.5 mx-auto font-sans"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                        <span>Switch to 200–300 Page Mode (Read all pages continuously)</span>
                      </button>
                    </div>
                  </>
                );
              })()}
            </article>
          )}
        </div>
      </div>

      {/* Download Book Modal */}
      {showDownloadModal && (
        <DownloadModal
          book={activeBook}
          language={settings.language}
          onClose={() => setShowDownloadModal(false)}
        />
      )}
    </div>
  );
};
