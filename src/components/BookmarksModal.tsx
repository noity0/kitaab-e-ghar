import React, { useState, useEffect } from 'react';
import { BookmarkItem } from '../types';
import { getBookmarks, removeBookmark } from '../utils/bookmarksStorage';
import { 
  Bookmark, 
  X, 
  Trash2, 
  BookOpen, 
  Quote, 
  ExternalLink, 
  Clock, 
  FolderHeart,
  Compass
} from 'lucide-react';

interface BookmarksModalProps {
  onClose: () => void;
  onOpenBook: (bookId: string, bookTitle: string, chapterIndex?: number) => void;
  language: 'urdu-roman' | 'urdu' | 'en';
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  onClose,
  onOpenBook,
  language
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'book' | 'quote'>('all');

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const handleRemove = (id: string) => {
    const updated = removeBookmark(id);
    setBookmarks(updated);
  };

  const filtered = bookmarks.filter(b => {
    if (activeFilter === 'all') return true;
    return b.type === activeFilter;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-amber-500/30 p-6 md:p-8 shadow-2xl space-y-6 max-h-[85vh] flex flex-col"
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
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Bookmark className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {language === 'urdu-roman' ? 'Aap Ke Mehfooz Shuda Asbaaq' : 'Personal Bookmarks & Shelf'}
          </div>
          <h3 className="text-2xl font-bold text-stone-100 font-['Cinzel',serif]">
            {language === 'urdu-roman' && 'Kitab Khana: Mehfooz Kutub wa Aqwaal'}
            {language === 'urdu' && 'محفوظ شدہ کتب اور سنہری اقتباسات'}
            {language === 'en' && 'Saved Treatises & Sacred Passages'}
          </h3>
          <p className="text-xs text-stone-400">
            {language === 'urdu-roman' 
              ? 'Yahan aapki mefooz karda kitabein aur aham asbaaq mehfooz rehte hain.' 
              : 'Access your saved readings and passages across reading sessions.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All Items ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveFilter('book')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'book'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Books ({bookmarks.filter(b => b.type === 'book').length})
          </button>
          <button
            onClick={() => setActiveFilter('quote')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'quote'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Quotes & Passages ({bookmarks.filter(b => b.type === 'quote').length})
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-stone-800/80 border border-stone-700 flex items-center justify-center text-stone-500">
                <FolderHeart className="w-6 h-6" />
              </div>
              <p className="text-sm text-stone-400">
                {language === 'urdu-roman' 
                  ? 'Abhi tak koi kitab ya iqtibas mehfooz nahi kiya gaya.' 
                  : 'No bookmarks saved yet. Click the bookmark icon on any book or passage to save it here.'}
              </p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-stone-950/70 border border-stone-800/80 hover:border-amber-500/30 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        item.type === 'book' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                      }`}>
                        {item.type === 'book' ? 'BOOK' : 'PASSAGE'}
                      </span>
                      <h4 className="text-stone-100 font-semibold text-sm">
                        {item.bookTitle}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-400">
                      By {item.author} {item.chapterTitle && item.chapterTitle !== 'Full Book' ? `• ${item.chapterTitle}` : ''}
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        onClose();
                        onOpenBook(item.bookId, item.bookTitle, item.chapterIndex);
                      }}
                      className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors text-xs flex items-center gap-1.5 font-medium"
                      title="Read"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 rounded-lg text-stone-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {item.quoteOrText && item.quoteOrText !== item.bookTitle && (
                  <div className="p-2.5 rounded-lg bg-stone-900/80 border-l-2 border-amber-500 text-xs italic text-stone-300">
                    "{item.quoteOrText}"
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
