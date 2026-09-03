import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ProblemSolver } from './components/ProblemSolver';
import { LearnMasterclass } from './components/LearnMasterclass';
import { TeachSystem } from './components/TeachSystem';
import { LibraryCatalog } from './components/LibraryCatalog';
import { BookReader } from './components/BookReader';
import { BookmarksModal } from './components/BookmarksModal';
import { INITIAL_BOOKS } from './data/initialBooks';
import { BookEntry, IngestedBook } from './types';
import { getBookmarksCount } from './utils/bookmarksStorage';
import { BookOpen, Sparkles, BrainCircuit, HeartHandshake, ShieldCheck, Bookmark, Download } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'solve' | 'teach' | 'ingest' | 'library' | 'reader'>('reader');
  const [language, setLanguage] = useState<'urdu-roman' | 'urdu' | 'en'>('urdu-roman');
  const [userBooks, setUserBooks] = useState<IngestedBook[]>([]);
  const [prefilledMasterclassTopic, setPrefilledMasterclassTopic] = useState<string>('');
  
  // Reader specific navigation states
  const [readerBookId, setReaderBookId] = useState<string>('meditations-marcus');
  const [readerBookTitle, setReaderBookTitle] = useState<string>('Meditations (Marcus Aurelius)');
  const [readerChapterIndex, setReaderChapterIndex] = useState<number>(0);

  // Bookmarks Modal state
  const [showBookmarksModal, setShowBookmarksModal] = useState<boolean>(false);
  const [bookmarksCount, setBookmarksCount] = useState<number>(0);

  // Sync bookmarks count
  const refreshBookmarksCount = () => {
    setBookmarksCount(getBookmarksCount());
  };

  useEffect(() => {
    refreshBookmarksCount();
  }, [showBookmarksModal, activeTab]);

  // Fetch user-taught books on load
  useEffect(() => {
    fetch('/api/user-books')
      .then((res) => res.json())
      .then((data) => {
        if (data.books) {
          setUserBooks(data.books);
        }
      })
      .catch((err) => console.error('Failed to fetch user books:', err));
  }, []);

  // Combine initial curated canonical books with newly ingested user books
  const allBooks: BookEntry[] = [
    ...userBooks.map((ub) => ({
      id: ub.id,
      title: ub.title,
      author: ub.author,
      yearOrEra: ub.yearOrEra,
      era: 'contemporary' as const,
      category: ub.category as any,
      description: ub.summary,
      keyCoreWisdom: ub.keyTheorems,
      famousQuote: ub.sampleQuote,
      problemItSolves: 'User-taught wisdom for real life situations',
      isUserAdded: true,
    })),
    ...INITIAL_BOOKS,
  ];

  const handleBookIngested = (newBook: IngestedBook) => {
    setUserBooks((prev) => [newBook, ...prev]);
  };

  const handleConsultBookInMasterclass = (bookName: string) => {
    setPrefilledMasterclassTopic(bookName);
    setActiveTab('teach');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConsultProblemWithBook = (bookTitle: string) => {
    setActiveTab('solve');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadBook = (bookId: string, bookTitle: string, chapterIndex: number = 0) => {
    setReaderBookId(bookId);
    setReaderBookTitle(bookTitle);
    setReaderChapterIndex(chapterIndex);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Universal Header with Reader, Bookmarks & Downloads */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        totalBooksCount={allBooks.length}
        userBooksCount={userBooks.length}
        bookmarksCount={bookmarksCount}
        onOpenBookmarks={() => setShowBookmarksModal(true)}
      />

      {/* Main Interactive Screen */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Clean Manual Reader Section (Kitab Khana) */}
        {activeTab === 'reader' && (
          <BookReader
            key={`${readerBookId || 'default'}-${readerBookTitle || 'default'}`}
            initialBookId={readerBookId}
            initialBookTitle={readerBookTitle}
            initialChapterIndex={readerChapterIndex}
            language={language}
            onConsultInSolver={handleConsultProblemWithBook}
            onLearnInMasterclass={handleConsultBookInMasterclass}
            onOpenBookmarks={() => setShowBookmarksModal(true)}
          />
        )}

        {/* Real-life Dilemma Problem Solver */}
        {activeTab === 'solve' && (
          <ProblemSolver
            language={language}
            onConsultBookInMasterclass={handleConsultBookInMasterclass}
            userBooksCount={userBooks.length}
          />
        )}

        {/* Masterclass Teacher */}
        {activeTab === 'teach' && (
          <LearnMasterclass
            language={language}
            prefilledTopic={prefilledMasterclassTopic}
            onClearPrefill={() => setPrefilledMasterclassTopic('')}
            onConsultProblemWithBook={handleConsultProblemWithBook}
          />
        )}

        {/* Teach the Codex New Books */}
        {activeTab === 'ingest' && (
          <TeachSystem
            language={language}
            userBooks={userBooks}
            onBookIngested={handleBookIngested}
            onSelectBookForProblem={handleConsultProblemWithBook}
          />
        )}

        {/* Complete 200M+ Library Catalog */}
        {activeTab === 'library' && (
          <LibraryCatalog
            books={allBooks}
            language={language}
            onConsultInSolver={handleConsultProblemWithBook}
            onLearnInMasterclass={handleConsultBookInMasterclass}
            onReadBook={handleReadBook}
          />
        )}
      </main>

      {/* Bookmarks Modal */}
      {showBookmarksModal && (
        <BookmarksModal
          onClose={() => {
            setShowBookmarksModal(false);
            refreshBookmarksCount();
          }}
          onOpenBook={(bookId, bookTitle, chapterIndex) => {
            handleReadBook(bookId, bookTitle, chapterIndex || 0);
          }}
          language={language}
        />
      )}

      {/* Sub-Footer / Codex Philosophy */}
      <footer className="border-t border-amber-900/20 bg-stone-950/80 py-8 mt-12 text-stone-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-stone-300">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span className="font-['Cinzel',serif] font-bold text-stone-200">
              Kitab-e-Hikmat (The Living Codex of 200,000,000+ Books)
            </span>
          </div>

          <div className="flex items-center gap-6 text-[11px] text-stone-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {language === 'urdu-roman' ? '20 Crore+ Kutub Indexed' : '200M+ Books Indexed'}
            </span>
            <span className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-amber-400" />
              {language === 'urdu-roman' ? 'Word & PDF Downloads' : 'Word & PDF Downloads'}
            </span>
            <span className="flex items-center gap-1">
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              {language === 'urdu-roman' ? 'Zati Bookmarks' : 'Persistent Bookmarks'}
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {language === 'urdu-roman' ? 'Masail Ka Hal' : 'Problem Solving'}
            </span>
          </div>

          <div className="text-stone-400 font-mono text-[11px]">
            {language === 'urdu-roman'
              ? 'Azal se aaj tak ke uloom ka markaz'
              : 'Synthesizing human literature across millennia'}
          </div>
        </div>
      </footer>
    </div>
  );
}
