export type Era = 
  | 'ancient' 
  | 'islamic-golden-age' 
  | 'renaissance-enlightenment' 
  | 'industrial-modern' 
  | 'contemporary';

export type BookCategory = 
  | 'Philosophy & Stoicism'
  | 'Medicine & Health'
  | 'Strategy & Leadership'
  | 'Psychology & Mind'
  | 'Economics & Wealth'
  | 'Science & Cosmos'
  | 'Literature, Soul & Poetry'
  | 'User Contributed';

export interface BookEntry {
  id: string;
  title: string;
  author: string;
  yearOrEra: string;
  era: Era;
  category: BookCategory;
  description: string;
  keyCoreWisdom: string[];
  famousQuote: string;
  problemItSolves: string;
  isUserAdded?: boolean;
}

export interface BookCitation {
  bookTitle: string;
  author: string;
  chapterOrSection?: string;
  quote: string;
  reasoning: string;
}

export interface SolutionResponse {
  problemSummary: string;
  rootCauseAnalysis: string;
  citations: BookCitation[];
  actionSteps: {
    step: number;
    title: string;
    description: string;
    bookReference: string;
  }[];
  philosophicalVerdict: string;
  dailyPrescription: string;
}

export interface TeachModule {
  topic: string;
  authorOrBook: string;
  overview: string;
  keyPrinciples: {
    title: string;
    explanation: string;
    historicalContext: string;
  }[];
  socraticQuestion: string;
  practicalExercise: string;
}

export interface IngestedBook {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  yearOrEra: string;
  summary: string;
  keyTheorems: string[];
  sampleQuote: string;
  addedAt: string;
}

export interface BookChapter {
  number: number;
  title: string;
  titleUrdu?: string;
  summary: string;
  content: string;
  contentUrdu?: string;
  contentRoman?: string;
  keyPassage: string;
}

export interface ReadableBook {
  id: string;
  title: string;
  author: string;
  yearOrEra: string;
  category: BookCategory;
  era: Era;
  originalLanguage?: string;
  totalChapters: number;
  preface: string;
  prefaceUrdu?: string;
  prefaceRoman?: string;
  chapters: BookChapter[];
  famousQuotes: string[];
  summary: string;
  sourceArchive?: string;
}

export interface BookmarkItem {
  id: string;
  bookId: string;
  bookTitle: string;
  author: string;
  chapterIndex: number;
  chapterTitle: string;
  quoteOrText: string;
  note?: string;
  createdAt: string;
  type: 'book' | 'chapter' | 'quote';
}

export interface ReaderSettings {
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  theme: 'dark' | 'sepia' | 'light' | 'midnight';
  fontFamily: 'serif' | 'sans' | 'nastaliq';
  maxWidth: 'compact' | 'standard' | 'wide';
  language: 'urdu-roman' | 'urdu' | 'en';
}
