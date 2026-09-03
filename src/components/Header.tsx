import React from 'react';
import { BookOpen, Sparkles, BrainCircuit, Library, Languages, GraduationCap, Bookmark, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'solve' | 'teach' | 'ingest' | 'library' | 'reader';
  setActiveTab: (tab: 'solve' | 'teach' | 'ingest' | 'library' | 'reader') => void;
  language: 'urdu-roman' | 'urdu' | 'en';
  setLanguage: (lang: 'urdu-roman' | 'urdu' | 'en') => void;
  totalBooksCount: number;
  userBooksCount: number;
  bookmarksCount?: number;
  onOpenBookmarks?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  totalBooksCount,
  userBooksCount,
  bookmarksCount = 0,
  onOpenBookmarks
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#0b0f19]/90 border-b border-amber-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-4">
          
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500/20 via-amber-600/10 to-transparent border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold tracking-tight text-stone-100 font-['Cinzel',serif]">
                    Kitab-e-Hikmat
                  </h1>
                  <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/25">
                    200M+ Codex
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  {language === 'urdu-roman' && 'Azal se aaj tak ki tamam kitabon ka zinda ilm'}
                  {language === 'urdu' && 'زمین کی ابتدا سے آج تک کی تمام کتابوں کا زندہ علم'}
                  {language === 'en' && 'The Living Synthesis of Earth\'s Literature & Wisdom'}
                </p>
              </div>
            </div>

            {/* Language switch on mobile */}
            <div className="flex md:hidden items-center gap-1 bg-stone-900/80 border border-stone-800 rounded-lg p-1 text-xs">
              <button
                id="lang-roman-mob"
                onClick={() => setLanguage('urdu-roman')}
                className={`px-2 py-1 rounded font-medium ${language === 'urdu-roman' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
              >
                Roman
              </button>
              <button
                id="lang-urdu-mob"
                onClick={() => setLanguage('urdu')}
                className={`px-2 py-1 rounded font-medium ${language === 'urdu' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
              >
                اردو
              </button>
              <button
                id="lang-en-mob"
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-medium ${language === 'en' ? 'bg-amber-600 text-white' : 'text-stone-400'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav className="flex items-center gap-1 bg-stone-900/70 p-1.5 rounded-xl border border-stone-800/80 w-full md:w-auto overflow-x-auto">
            {/* Clean Manual Reader Tab */}
            <button
              id="tab-reader"
              onClick={() => setActiveTab('reader')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'reader'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>
                {language === 'urdu-roman' && 'Kitab Khana (Mutala)'}
                {language === 'urdu' && 'کتاب خانہ (مطالعہ)'}
                {language === 'en' && 'Read Books (Codex)'}
              </span>
            </button>

            <button
              id="tab-solve"
              onClick={() => setActiveTab('solve')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'solve'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'urdu-roman' && 'Masla Ka Hal'}
                {language === 'urdu' && 'مسئلے کا حل'}
                {language === 'en' && 'Solve from Books'}
              </span>
            </button>

            <button
              id="tab-teach"
              onClick={() => setActiveTab('teach')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'teach'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>
                {language === 'urdu-roman' && 'Dars (Masterclass)'}
                {language === 'urdu' && 'سیکھیں (علم حاصل کریں)'}
                {language === 'en' && 'Learn from Masters'}
              </span>
            </button>

            <button
              id="tab-library"
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'library'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>
                {language === 'urdu-roman' && 'Kutub Khana'}
                {language === 'urdu' && 'کتب خانہ'}
                {language === 'en' && '200M+ Library'}
              </span>
            </button>

            <button
              id="tab-ingest"
              onClick={() => setActiveTab('ingest')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === 'ingest'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:text-stone-100 hover:bg-stone-800/60'
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              <span>
                {language === 'urdu-roman' && 'Sikhayein'}
                {language === 'urdu' && 'سکھائیں'}
                {language === 'en' && 'Teach System'}
              </span>
              {userBooksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-stone-950 font-bold">
                  {userBooksCount}
                </span>
              )}
            </button>
          </nav>

          {/* Desktop Controls (Bookmarks + Language) */}
          <div className="hidden md:flex items-center gap-2">
            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 text-xs font-semibold transition-all"
                title="Saved Bookmarks"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Bookmarks</span>
                {bookmarksCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            )}

            <div className="flex items-center gap-1.5 bg-stone-900 border border-stone-800 rounded-lg p-1 text-xs">
              <Languages className="w-3.5 h-3.5 text-amber-400 ml-1.5" />
              <button
                id="lang-roman"
                onClick={() => setLanguage('urdu-roman')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'urdu-roman' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Roman
              </button>
              <button
                id="lang-urdu"
                onClick={() => setLanguage('urdu')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'urdu' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                اردو
              </button>
              <button
                id="lang-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                EN
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
