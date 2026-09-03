import { BookmarkItem } from '../types';

const STORAGE_KEY = 'kitab_hikmat_bookmarks_v1';

export function getBookmarks(): BookmarkItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse bookmarks:', e);
    return [];
  }
}

export function getBookmarksCount(): number {
  return getBookmarks().length;
}

export function saveBookmark(item: Omit<BookmarkItem, 'id' | 'createdAt'>): BookmarkItem {
  const bookmarks = getBookmarks();
  
  // Check if exact item already exists
  const existingIdx = bookmarks.findIndex(
    b => b.bookId === item.bookId && b.chapterIndex === item.chapterIndex && b.type === item.type
  );

  const newBookmark: BookmarkItem = {
    ...item,
    id: `${item.bookId}_${item.chapterIndex}_${item.type}_${Date.now()}`,
    createdAt: new Date().toISOString()
  };

  if (existingIdx >= 0) {
    // Replace with updated note/quote
    bookmarks[existingIdx] = newBookmark;
  } else {
    bookmarks.unshift(newBookmark);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to save bookmark:', e);
  }

  return newBookmark;
}

export function removeBookmark(id: string): BookmarkItem[] {
  const bookmarks = getBookmarks().filter(b => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  } catch (e) {
    console.error('Failed to update bookmarks:', e);
  }
  return bookmarks;
}

export function isBookmarked(bookId: string, chapterIndex = 0, type: 'book' | 'chapter' | 'quote' = 'book'): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.bookId === bookId && b.chapterIndex === chapterIndex && b.type === type);
}

export function toggleBookBookmark(bookId: string, bookTitle: string, author: string): boolean {
  if (isBookmarked(bookId, 0, 'book')) {
    const bookmarks = getBookmarks().filter(b => !(b.bookId === bookId && b.type === 'book'));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    return false; // Removed
  } else {
    saveBookmark({
      bookId,
      bookTitle,
      author,
      chapterIndex: 0,
      chapterTitle: 'Full Book',
      quoteOrText: bookTitle,
      type: 'book'
    });
    return true; // Added
  }
}
