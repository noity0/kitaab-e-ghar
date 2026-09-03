import React, { useState, useEffect, useRef } from 'react';
import { ReadableBook, BookChapter, ReaderSettings } from '../types';
import { PRECOMPUTED_READABLE_BOOKS, findReadableBook, buildFallbackReadableBook } from '../data/readableBooksBank';
import { INITIAL_BOOKS } from '../data/initialBooks';
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
  Maximize2, 
  Minimize2, 
  List, 
  Search, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Compass,
  Zap,
  Globe,
  FileType,
  FileText
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
  const [loadingBook, setLoadingBook] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [speedStats, setSpeedStats] = useState<{ timeTakenMs?: number; source?: string } | null>({
    timeTakenMs: 0,
    source: 'instant-bank'
  });

  // Reader Customization Settings
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 'base',
    theme: 'sepia',
    fontFamily: 'serif',
    maxWidth: 'standard',
    language: parentLanguage
  });

  const [showSettingsDrawer, setShowSettingsDrawer] = useState<boolean>(false);
  const [showChapterDrawer, setShowChapterDrawer] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [copiedQuote, setCopiedQuote] = useState<boolean>(false);
  const [bookmarkedBook, setBookmarkedBook] = useState<boolean>(false);
  const [bookmarkedChapter, setBookmarkedChapter] = useState<boolean>(false);

  const contentContainerRef = useRef<HTMLDivElement>(null);

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

  // Load a book with 0ms instant display + background deep enhancement
  const loadBook = async (bookIdentifier: string, titleHint?: string) => {
    stopSpeaking();
    
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

  // Toggle book bookmark
  const handleToggleBookBookmark = () => {
    const isNow = toggleBookBookmark(activeBook.id, activeBook.title, activeBook.author);
    setBookmarkedBook(isNow);
  };

  // Toggle chapter bookmark
  const handleToggleChapterBookmark = () => {
    const ch = activeBook.chapters[currentChapterIndex] || activeBook.chapters[0];
    if (bookmarkedChapter) {
      // Remove
      toggleBookBookmark(activeBook.id, activeBook.title, activeBook.author);
      setBookmarkedChapter(false);
    } else {
      saveBookmark({
        bookId: activeBook.id,
        bookTitle: activeBook.title,
        author: activeBook.author,
        chapterIndex: currentChapterIndex,
        chapterTitle: ch.title,
        quoteOrText: ch.keyPassage || ch.title,
        type: 'chapter'
      });
      setBookmarkedChapter(true);
    }
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
    const ch = activeBook.chapters[currentChapterIndex] || activeBook.chapters[0];
    const isUrdu = settings.language === 'urdu';
    const isRoman = settings.language === 'urdu-roman';

    const textToRead = isUrdu 
      ? (ch.contentUrdu || ch.content) 
      : isRoman 
      ? (ch.contentRoman || ch.content) 
      : ch.content;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
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

  const activeChapter: BookChapter = activeBook.chapters[currentChapterIndex] || activeBook.chapters[0] || {
    number: 1,
    title: 'Chapter 1',
    summary: 'Introductory passage',
    keyPassage: activeBook.famousQuotes[0] || '',
    content: activeBook.preface
  };

  const isUrdu = settings.language === 'urdu';
  const isRoman = settings.language === 'urdu-roman';

  const chapterTitle = (isUrdu && activeChapter.titleUrdu) ? activeChapter.titleUrdu : activeChapter.title;
  const chapterContent = (isUrdu && activeChapter.contentUrdu) 
    ? activeChapter.contentUrdu 
    : (isRoman && activeChapter.contentRoman) 
    ? activeChapter.contentRoman 
    : activeChapter.content;

  const paragraphs = chapterContent.split('\n\n').filter(p => p.trim());

  return (
    <div className="space-y-6">
      {/* 200,000,000+ Books Top Universal Search & Browse Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-amber-500/30 p-4 md:p-6 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 border border-amber-500/30 text-amber-300 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                Kitab Khana (Clean Manual Reader)
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                200,000,000+ Universal Books Indexed
              </span>
              {speedStats && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-stone-800 text-stone-300 border border-stone-700">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {speedStats.timeTakenMs}ms
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-stone-100 font-['Cinzel',serif]">
              {settings.language === 'urdu-roman' && 'Zameen Ki Tamam Kitabon Ka Saaf wa Pur-Sukoon Mutala'}
              {settings.language === 'urdu' && 'زمین کی تمام کتابوں کا صاف ستھرا اور پرسکون مطالعہ'}
              {settings.language === 'en' && 'Read Any Book on Earth Manually, Cleanly & Distraction-Free'}
            </h2>
          </div>

          {/* Quick Bookmarks & Downloads access */}
          <div className="flex items-center gap-2 shrink-0">
            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 transition-all shadow-sm"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Bookmarks</span>
              </button>
            )}

            <button
              onClick={() => setShowDownloadModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 hover:brightness-110 transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Book (Word / PDF)</span>
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
                  ? "20 Crore+ kitabon me se kisi bhi kitaab ya musannif ka naam likhein (e.g. Crime and Punishment, Kimiya-e-Saadat, The Prince)..."
                  : "Search any book or author among 200,000,000+ universal works to read immediately..."
              }
              className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-stone-950/80 border border-stone-800 focus:border-amber-500/60 text-stone-100 text-xs md:text-sm focus:outline-none placeholder:text-stone-500"
            />
            {searchQuery && (
              <button
                onClick={() => loadBook(searchQuery.trim())}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
              >
                Read Book
              </button>
            )}
          </div>

          {/* Preset Quick Select for Classics */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs text-stone-400 whitespace-nowrap hidden sm:inline">Classic Picks:</span>
            {PRECOMPUTED_READABLE_BOOKS.map((b) => (
              <button
                key={b.id}
                onClick={() => loadBook(b.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all border ${
                  activeBook.id === b.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
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
          {/* Chapter Drawer Toggle & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChapterDrawer(!showChapterDrawer)}
              className="p-2 rounded-lg hover:bg-black/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Table of Contents"
            >
              <List className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Chapters ({activeBook.chapters.length})</span>
            </button>

            <div className="h-4 w-px bg-current opacity-20" />

            <div>
              <h3 className="font-bold text-xs md:text-sm truncate max-w-[200px] sm:max-w-xs md:max-w-md font-['Cinzel',serif]">
                {activeBook.title}
              </h3>
              <p className="text-[11px] opacity-70">
                Chapter {activeChapter.number}: {chapterTitle}
              </p>
            </div>
          </div>

          {/* Reader Action Controls */}
          <div className="flex items-center gap-1.5">
            {/* Audio Voice Narration */}
            <button
              onClick={toggleSpeech}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                isSpeaking ? 'bg-amber-500/20 text-amber-700 font-bold animate-pulse' : 'hover:bg-black/10'
              }`}
              title={isSpeaking ? 'Stop Audio' : 'Listen to Chapter'}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4 text-amber-600" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden md:inline">{isSpeaking ? 'Stop' : 'Listen'}</span>
            </button>

            {/* Bookmark Chapter */}
            <button
              onClick={handleToggleChapterBookmark}
              className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium ${
                bookmarkedChapter ? 'text-amber-600 font-bold' : 'hover:bg-black/10'
              }`}
              title={bookmarkedChapter ? 'Chapter Bookmarked' : 'Bookmark this Chapter'}
            >
              <Bookmark className={`w-4 h-4 ${bookmarkedChapter ? 'fill-amber-500 text-amber-600' : ''}`} />
              <span className="hidden lg:inline">{bookmarkedChapter ? 'Saved' : 'Bookmark'}</span>
            </button>

            {/* Bookmark Full Book */}
            <button
              onClick={handleToggleBookBookmark}
              className={`p-2 rounded-lg transition-colors text-xs ${
                bookmarkedBook ? 'text-amber-600' : 'opacity-70 hover:opacity-100 hover:bg-black/10'
              }`}
              title="Bookmark Full Book"
            >
              <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-black/10">
                {bookmarkedBook ? '★ Book in Shelf' : '+ Shelf'}
              </span>
            </button>

            {/* Download Modal */}
            <button
              onClick={() => setShowDownloadModal(true)}
              className="p-2 rounded-lg hover:bg-black/10 transition-colors flex items-center gap-1 text-xs font-medium"
              title="Download Book in Word / PDF"
            >
              <Download className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">Download</span>
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

        {/* Chapter Table of Contents Drawer */}
        {showChapterDrawer && (
          <div className={`p-4 md:p-6 border-b animate-fadeIn space-y-3 ${themeInnerClasses[settings.theme]}`}>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm uppercase tracking-wider opacity-80">
                Table of Contents ({activeBook.chapters.length} Chapters)
              </h4>
              <button
                onClick={() => setShowChapterDrawer(false)}
                className="text-xs opacity-70 hover:opacity-100 underline"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
              {activeBook.chapters.map((ch, idx) => (
                <button
                  key={ch.number}
                  onClick={() => {
                    setCurrentChapterIndex(idx);
                    setShowChapterDrawer(false);
                    if (contentContainerRef.current) {
                      contentContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    idx === currentChapterIndex
                      ? 'border-amber-600 bg-black/15 font-bold'
                      : 'border-transparent bg-black/5 hover:bg-black/10'
                  }`}
                >
                  <div className="text-[10px] uppercase font-mono opacity-70">
                    Chapter {ch.number}
                  </div>
                  <div className="font-semibold text-xs mt-0.5 truncate">
                    {isUrdu && ch.titleUrdu ? ch.titleUrdu : ch.title}
                  </div>
                  <p className="text-[11px] opacity-70 line-clamp-1 mt-1">
                    {ch.summary}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Reading Progress Indicator */}
        <div className="w-full h-1 bg-black/10">
          <div 
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ 
              width: `${((currentChapterIndex + 1) / Math.max(activeBook.chapters.length, 1)) * 100}%` 
            }}
          />
        </div>

        {/* Book Content Body (Clean & Distraction-Free Manual Reading) */}
        <div 
          ref={contentContainerRef}
          className={`p-6 sm:p-10 md:p-14 overflow-y-auto max-h-[75vh] ${settings.theme === 'sepia' ? 'selection:bg-amber-900/20' : ''}`}
        >
          {loadingBook ? (
            <div className="py-20 text-center space-y-3 animate-pulse">
              <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500">
                <Sparkles className="w-6 h-6 animate-spin" />
              </div>
              <h4 className="font-bold text-lg font-['Cinzel',serif]">
                Opening from 200,000,000+ Universal Books Repository...
              </h4>
              <p className="text-xs opacity-70">
                Formatting manuscript chapters, authentic passages, and translations.
              </p>
            </div>
          ) : (
            <article 
              className={`mx-auto space-y-8 ${widthClasses[settings.maxWidth]} ${fontClasses[settings.fontFamily]} ${sizeClasses[settings.fontSize]} ${
                isUrdu ? 'text-right' : 'text-left'
              }`}
              dir={isUrdu ? 'rtl' : 'ltr'}
            >
              {/* Book Chapter Header */}
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
                  {chapterTitle}
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
                      onClick={() => {
                        saveBookmark({
                          bookId: activeBook.id,
                          bookTitle: activeBook.title,
                          author: activeBook.author,
                          chapterIndex: currentChapterIndex,
                          chapterTitle: chapterTitle,
                          quoteOrText: activeChapter.keyPassage,
                          type: 'quote'
                        });
                        setCopiedQuote(true);
                        setTimeout(() => setCopiedQuote(false), 2000);
                      }}
                      className="text-xs opacity-75 hover:opacity-100 flex items-center gap-1 font-sans not-italic font-medium"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                      <span>{copiedQuote ? 'Saved to Bookmarks!' : 'Bookmark Maxim'}</span>
                    </button>
                  </div>
                </blockquote>
              )}

              {/* Chapter Body Paragraphs */}
              <div className="space-y-6">
                {paragraphs.map((p, i) => (
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
                  {currentChapterIndex + 1} / {activeBook.chapters.length}
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

              {/* Quick Actions at end of Chapter */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-3 not-italic font-sans">
                {onConsultInSolver && (
                  <button
                    onClick={() => onConsultInSolver(activeBook.title)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 hover:bg-amber-500/25 text-amber-800 dark:text-amber-300 border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Solve Real Problem with this Book</span>
                  </button>
                )}

                {onLearnInMasterclass && (
                  <button
                    onClick={() => onLearnInMasterclass(activeBook.title)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-black/10 hover:bg-black/15 transition-all flex items-center gap-1.5"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Deep Masterclass Discussion</span>
                  </button>
                )}

                <button
                  onClick={() => setShowDownloadModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-black/10 hover:bg-black/15 transition-all flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Book</span>
                </button>
              </div>
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
