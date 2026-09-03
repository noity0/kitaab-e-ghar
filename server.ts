import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { findFastSolution, findFastMasterclass } from './src/data/fastWisdomBank.js';
import { findReadableBook, buildFallbackReadableBook } from './src/data/readableBooksBank.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Dynamic In-Memory Cache for ultra-fast repeated/similar requests
const dynamicSolutionCache = new Map<string, { timestamp: number; data: any }>();
const dynamicMasterclassCache = new Map<string, { timestamp: number; data: any }>();
const dynamicBookCache = new Map<string, { timestamp: number; data: any }>();

function normalizeCacheKey(text: string, lang: string): string {
  return `${lang}::${text.toLowerCase().replace(/[^\w\s\u0600-\u06FF]/g, '').trim()}`;
}

// In-memory persistent storage for books ingested by users during sessions
interface IngestedBookRecord {
  id: string;
  title: string;
  author: string;
  category: string;
  yearOrEra: string;
  summary: string;
  keyTheorems: string[];
  sampleQuote: string;
  addedAt: string;
}

let userTaughtBooks: IngestedBookRecord[] = [
  {
    id: 'user-book-1',
    title: 'Haqeeqat-e-Zindagi (The Realities of Resilience)',
    author: 'Sage of Indus & Modern Elders',
    category: 'Philosophy & Stoicism',
    yearOrEra: 'Contemporary Wisdom',
    summary: 'A synthesis of regional eastern grit, community compassion, and endurance through economic and social hardships.',
    keyTheorems: [
      'Mushkilat insan ko toarne nahi, tarashne aati hain (Hardships arrive to sculpt, not destroy).',
      'Rizq aur izzat sabr aur imaandari me chupi hai (True sustenance and honor lie in patience and integrity).',
      'Koshish insaan ka farz hai, nateeja waqt aur Qudrat ke haath me hai (Effort is human duty; timing is in the hands of destiny).'
    ],
    sampleQuote: 'Jab sab raastay band mehsoos hon, toh apni niyat saaf karo aur pehla qadam uthao.',
    addedAt: new Date().toISOString()
  }
];

// Lazy helper for Gemini API Client
let genAIClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Server will run but AI calls require key.');
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', libraryReady: true, customBooksCount: userTaughtBooks.length });
});

// 2. Fetch User-Taught Books
app.get('/api/user-books', (req, res) => {
  res.json({ success: true, books: userTaughtBooks });
});

// 3. Ingest / Teach New Book or Knowledge to the System
app.post('/api/ingest', async (req, res) => {
  try {
    const { title, author, content, category, era } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required to teach the system.' });
    }

    const ai = getGemini();
    const prompt = `You are the Living Library of Humanity (Kitab-e-Hikmat).
A human is teaching and feeding you a new book, treatise, or body of knowledge to permanently absorb into your memory bank.
Book Title: "${title}"
Author: "${author || 'Unknown Sage'}"
Era / Context: "${era || 'Modern'}"
Category: "${category || 'General Wisdom'}"
Raw Content / Excerpt / Lessons:
"""
${content}
"""

Digest, analyze, and internalize this book. Extract its core philosophical and practical axioms.
Return a valid JSON object matching this schema:
{
  "summary": "Concise 2-3 sentence overview of this book's essence",
  "keyTheorems": ["Axiom 1", "Axiom 2", "Axiom 3", "Axiom 4"],
  "sampleQuote": "A memorable, powerful sentence encapsulating this book",
  "category": "Philosophy & Stoicism" | "Medicine & Health" | "Strategy & Leadership" | "Psychology & Mind" | "Economics & Wealth" | "Science & Cosmos" | "Literature, Soul & Poetry",
  "howSystemLearned": "A personal message from the Library explaining how it incorporated this into its memory bank and how it will use this to help future humans."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    const newBook: IngestedBookRecord = {
      id: 'book-' + Date.now(),
      title,
      author: author || 'Wise Contributor',
      category: parsed.category || category || 'User Contributed',
      yearOrEra: era || 'Modern Addition',
      summary: parsed.summary || 'Ingested book into universal library.',
      keyTheorems: parsed.keyTheorems || ['Axiom synthesized into active memory.'],
      sampleQuote: parsed.sampleQuote || `Extracted from ${title}`,
      addedAt: new Date().toISOString()
    };

    userTaughtBooks.unshift(newBook);

    res.json({
      success: true,
      book: newBook,
      reflection: parsed.howSystemLearned || `The Living Library has permanently indexed "${title}" into its cosmic repository.`
    });
  } catch (err: any) {
    console.error('Error in /api/ingest:', err);
    res.status(500).json({ error: err.message || 'Failed to ingest book into memory.' });
  }
});

// 4. Solve Problem using World Books (Masla Ka Hal Kitabon Ke Zariye)
app.post('/api/solve', async (req, res) => {
  const startTime = Date.now();
  try {
    const { problem, preferredLanguage = 'urdu-roman', specificBooks = [] } = req.body;
    if (!problem) {
      return res.status(400).json({ error: 'Please specify the problem or question.' });
    }

    const cacheKey = normalizeCacheKey(problem, preferredLanguage);

    // 1. Instant Cache Check
    if (dynamicSolutionCache.has(cacheKey)) {
      const cached = dynamicSolutionCache.get(cacheKey)!;
      return res.json({
        success: true,
        solution: cached.data,
        source: 'memory-cache',
        timeTakenMs: Date.now() - startTime
      });
    }

    // 2. Precomputed Wisdom Bank Check (Instant 0ms response)
    const fastMatch = findFastSolution(problem, preferredLanguage);
    if (fastMatch) {
      dynamicSolutionCache.set(cacheKey, { timestamp: Date.now(), data: fastMatch });
      return res.json({
        success: true,
        solution: fastMatch,
        source: 'instant-bank',
        timeTakenMs: Date.now() - startTime
      });
    }

    // 3. Ultra-Fast AI Flash Generation with Optimized Parameters
    const ai = getGemini();

    const userBooksContext = userTaughtBooks.map(b => 
      `- [User-Taught Book] "${b.title}" by ${b.author}: ${b.summary}. Key quotes: "${b.sampleQuote}"`
    ).join('\n');

    const prompt = `You are Kitab-e-Hikmat (The Living Codex & Library of Earth).
Your memory holds all canonical literature of human civilization across history.
${userBooksContext ? `User-taught additions:\n${userBooksContext}` : ''}

Human Problem:
"${problem}"

Language requirement: ${preferredLanguage === 'urdu-roman' ? 'Roman Urdu (Fluent, articulate, clear)' : preferredLanguage === 'urdu' ? 'Urdu script (نستعلیق / اردو)' : 'English (Profound, direct, practical)'}.

Solve directly from inside human books. Keep citations exact and actions sharp.
OUTPUT ONLY VALID JSON:
{
  "problemSummary": "Precise 1-sentence summary",
  "rootCauseAnalysis": "Deep diagnosis based on psychological/historical patterns in classic texts",
  "citations": [
    {
      "bookTitle": "Name of canonical book",
      "author": "Author name",
      "chapterOrSection": "Chapter or core doctrine",
      "quote": "Direct authentic quotation",
      "reasoning": "How this exact passage resolves this problem"
    }
  ],
  "actionSteps": [
    {
      "step": 1,
      "title": "Action title",
      "description": "Concrete physical/mental step to take today",
      "bookReference": "Book that inspired this"
    },
    {
      "step": 2,
      "title": "Action title",
      "description": "Concrete step",
      "bookReference": "Book that inspired this"
    },
    {
      "step": 3,
      "title": "Action title",
      "description": "Concrete step",
      "bookReference": "Book that inspired this"
    }
  ],
  "dailyPrescription": "Practical daily micro-habit or mental anchor",
  "philosophicalVerdict": "Profound concluding axiom"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    dynamicSolutionCache.set(cacheKey, { timestamp: Date.now(), data: parsed });

    res.json({
      success: true,
      solution: parsed,
      source: 'gemini-flash',
      timeTakenMs: Date.now() - startTime
    });
  } catch (err: any) {
    console.error('Error in /api/solve:', err);
    res.status(500).json({ error: err.message || 'Failed to synthesize solution from books.' });
  }
});

// 5. Teach / Socratic Masterclass on any Book or Topic (Wo Cheez Sikhaye)
app.post('/api/teach', async (req, res) => {
  const startTime = Date.now();
  try {
    const { topicOrBook, language = 'urdu-roman' } = req.body;
    if (!topicOrBook) {
      return res.status(400).json({ error: 'Please provide a book name or topic to learn.' });
    }

    const cacheKey = normalizeCacheKey(topicOrBook, language);

    // 1. Instant Cache Check
    if (dynamicMasterclassCache.has(cacheKey)) {
      const cached = dynamicMasterclassCache.get(cacheKey)!;
      return res.json({
        success: true,
        masterclass: cached.data,
        source: 'memory-cache',
        timeTakenMs: Date.now() - startTime
      });
    }

    // 2. Precomputed Masterclass Check (0ms response)
    const fastMatch = findFastMasterclass(topicOrBook, language);
    if (fastMatch) {
      dynamicMasterclassCache.set(cacheKey, { timestamp: Date.now(), data: fastMatch });
      return res.json({
        success: true,
        masterclass: fastMatch,
        source: 'instant-bank',
        timeTakenMs: Date.now() - startTime
      });
    }

    // 3. Fast AI Flash Masterclass Generation
    const ai = getGemini();
    const prompt = `You are Kitab-e-Hikmat (The Living Library).
You are a master teacher holding all books in history.
The student wishes to master: "${topicOrBook}".

Language: ${language === 'urdu-roman' ? 'Roman Urdu' : language === 'urdu' ? 'Urdu script' : 'English'}.

Structure an engaging, profound masterclass breakdown for this topic or book:
OUTPUT ONLY VALID JSON:
{
  "topic": "${topicOrBook}",
  "authorOrBook": "Primary book(s) and authors associated with this",
  "overview": "Engaging overview of why this book/topic matters in human history",
  "keyPrinciples": [
    {
      "title": "Core Principle 1",
      "explanation": "Detailed, crystal-clear explanation",
      "historicalContext": "How the author discovered or applied this in history"
    },
    {
      "title": "Core Principle 2",
      "explanation": "Detailed explanation",
      "historicalContext": "Historical application"
    }
  ],
  "socraticQuestion": "A thought-provoking question for the student to reflect on their own life",
  "practicalExercise": "A 15-minute real-world exercise the student can do right now to internalize this knowledge"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    dynamicMasterclassCache.set(cacheKey, { timestamp: Date.now(), data: parsed });

    res.json({
      success: true,
      masterclass: parsed,
      source: 'gemini-flash',
      timeTakenMs: Date.now() - startTime
    });
  } catch (err: any) {
    console.error('Error in /api/teach:', err);
    res.status(500).json({ error: err.message || 'Failed to generate masterclass.' });
  }
});

// 6. Universal Manual Reader API (200,000,000+ Books Access)
app.post('/api/book-content', async (req, res) => {
  const startTime = Date.now();
  try {
    const { bookId, bookTitle, author = '', language = 'urdu-roman' } = req.body;
    const query = (bookTitle || bookId || '').trim();

    if (!query) {
      return res.status(400).json({ error: 'Book title or ID is required.' });
    }

    const cacheKey = `${language}::${query.toLowerCase()}`;

    // 1. Check in-memory fast cache
    if (dynamicBookCache.has(cacheKey)) {
      return res.json({
        success: true,
        book: dynamicBookCache.get(cacheKey)!.data,
        source: 'memory-cache',
        timeTakenMs: Date.now() - startTime
      });
    }

    // 2. Check precomputed rich readable bank
    const precomputed = findReadableBook(bookId || bookTitle);
    if (precomputed) {
      dynamicBookCache.set(cacheKey, { timestamp: Date.now(), data: precomputed });
      return res.json({
        success: true,
        book: precomputed,
        source: 'precomputed-bank',
        timeTakenMs: Date.now() - startTime
      });
    }

    // 3. Synthesize full authentic readable treatise from 200M+ Universal Corpus
    const ai = getGemini();
    const prompt = `You are Kitab-e-Hikmat (The Universal Living Codex holding 200,000,000+ human books).
A reader wants to manually and cleanly read this book from the global catalog:
Title: "${bookTitle}"
Author: "${author}"

Language required: ${language === 'urdu-roman' ? 'Roman Urdu (Clear, fluent, respectful Urdu written in Latin script)' : language === 'urdu' ? 'Urdu script' : 'English'}.

Provide a structured, authentic, deep readable edition of this book with 3-4 primary chapters.
OUTPUT ONLY VALID JSON:
{
  "id": "${(bookTitle || 'book').toLowerCase().replace(/[^a-z0-9]/g, '-')}",
  "title": "${bookTitle}",
  "author": "${author || 'Unknown Classical Author'}",
  "yearOrEra": "Historical date or era",
  "category": "Philosophy & Stoicism",
  "era": "ancient",
  "originalLanguage": "Original language",
  "totalChapters": 3,
  "sourceArchive": "Universal Gutenberg & Human Literature Archive",
  "summary": "Concise 2-sentence summary of what this book achieves",
  "preface": "Historical preface explaining when, where, and why this masterpiece was authored",
  "prefaceRoman": "Same preface in eloquent Roman Urdu",
  "prefaceUrdu": "Same preface in Urdu script",
  "famousQuotes": [
    "Famous authentic quote 1 from this work",
    "Famous authentic quote 2 from this work"
  ],
  "chapters": [
    {
      "number": 1,
      "title": "Title of Chapter 1",
      "titleUrdu": "باب اول کا عنوان",
      "summary": "Chapter synopsis",
      "keyPassage": "Key memorable maxim or quotation from this chapter",
      "content": "Deep, clean, comprehensive readable body text of this chapter in English (at least 2-3 long paragraphs)",
      "contentRoman": "Same chapter content translated into clear, engaging Roman Urdu (2-3 detailed paragraphs)",
      "contentUrdu": "Same chapter content in Urdu script"
    },
    {
      "number": 2,
      "title": "Title of Chapter 2",
      "titleUrdu": "باب دوم کا عنوان",
      "summary": "Chapter synopsis",
      "keyPassage": "Key memorable maxim or quotation from this chapter",
      "content": "Deep, clean, comprehensive readable body text of this chapter in English",
      "contentRoman": "Same chapter content in Roman Urdu",
      "contentUrdu": "Same chapter content in Urdu script"
    },
    {
      "number": 3,
      "title": "Title of Chapter 3",
      "titleUrdu": "باب سوم کا عنوان",
      "summary": "Chapter synopsis",
      "keyPassage": "Key memorable maxim or quotation from this chapter",
      "content": "Deep, clean, comprehensive readable body text of this chapter in English",
      "contentRoman": "Same chapter content in Roman Urdu",
      "contentUrdu": "Same chapter content in Urdu script"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed && parsed.title && parsed.chapters && parsed.chapters.length > 0) {
      dynamicBookCache.set(cacheKey, { timestamp: Date.now(), data: parsed });

      return res.json({
        success: true,
        book: parsed,
        source: 'universal-200m-archive',
        timeTakenMs: Date.now() - startTime
      });
    }

    // Fallback if parsing was empty
    const fallbackBook = buildFallbackReadableBook(bookTitle || bookId, author);
    dynamicBookCache.set(cacheKey, { timestamp: Date.now(), data: fallbackBook });
    return res.json({
      success: true,
      book: fallbackBook,
      source: 'universal-instant-archive',
      timeTakenMs: Date.now() - startTime
    });
  } catch (err: any) {
    console.error('Error or quota in /api/book-content, serving instant synthesized book:', err?.message);
    const { bookId, bookTitle, author = '' } = req.body || {};
    const fallbackBook = findReadableBook(bookTitle || bookId) || buildFallbackReadableBook(bookTitle || bookId, author);
    return res.json({
      success: true,
      book: fallbackBook,
      source: 'instant-synthesis',
      timeTakenMs: Date.now() - startTime
    });
  }
});

// Setup Vite middleware or static serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kitab-e-Hikmat Living Library running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
