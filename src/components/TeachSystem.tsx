import React, { useState } from 'react';
import { IngestedBook } from '../types';
import { BrainCircuit, BookPlus, Sparkles, Check, CheckCircle2, Bookmark, ArrowRight, BookOpen } from 'lucide-react';

interface TeachSystemProps {
  language: 'urdu-roman' | 'urdu' | 'en';
  userBooks: IngestedBook[];
  onBookIngested: (newBook: IngestedBook) => void;
  onSelectBookForProblem: (bookTitle: string) => void;
}

export const TeachSystem: React.FC<TeachSystemProps> = ({
  language,
  userBooks,
  onBookIngested,
  onSelectBookForProblem,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('Philosophy & Stoicism');
  const [era, setEra] = useState('Contemporary Wisdom');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    setError(null);
    setReflection(null);

    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author: author || 'Wise Contributor',
          category,
          era,
          content
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kitab ko memory me dakhil na kiya ja saka.');
      }

      onBookIngested(data.book);
      setReflection(data.reflection);
      setTitle('');
      setAuthor('');
      setContent('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error ingesting knowledge into the system.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="rounded-2xl bg-gradient-to-b from-stone-900/90 to-stone-950/80 border border-amber-500/20 p-6 md:p-8 space-y-3 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold uppercase tracking-wider">
          <BrainCircuit className="w-3.5 h-3.5" />
          {language === 'urdu-roman' && 'Zinda Memory Me Kitab Shamil Karein'}
          {language === 'urdu' && 'سسٹم کی زندہ یادداشت میں نئی کتاب یا علم شامل کریں'}
          {language === 'en' && 'Ingest Knowledge into the Codex Memory'}
        </div>

        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-stone-100 font-['Cinzel',serif]">
          {language === 'urdu-roman' && 'System Ko Koi Nayi Kitab Ya Sabaq Sikhayein'}
          {language === 'urdu' && 'سسٹم کو کوئی نئی کتاب، بیاض یا حکمت سکھائیں'}
          {language === 'en' && 'Teach the Living System a New Book or Manuscript'}
        </h2>

        <p className="text-stone-300 text-sm md:text-base max-w-3xl leading-relaxed">
          {language === 'urdu-roman' && (
            'Yeh system sirf pehle se mojood kitabein nahi parhta, balkay naye uloom aur sabaq bhi jazb karta hai. Koi bhi kitaab, khandaani tajarba, diary ke asbaaq ya tehqeeq yahan darj karein. System isay apni zinda memory me save karega aur aainda aane wale tamam insano ke masail ke hal me is kitab se hawalay dega!'
          )}
          {language === 'urdu' && (
            'آپ جو کتاب یا فلسفہ یہاں فیڈ کریں گے، سسٹم اسے اپنی مستقل یادداشت میں شامل کر کے آئندہ نسلوں اور لوگوں کے مسائل کے حل میں اس کے اصول لاگو کرے گا۔'
          )}
          {language === 'en' && (
            'The system continuously expands its eternal memory. Feed it any regional manuscript, family treatise, or personal compilation. It will dissect axioms and integrate it into future problem-solving.'
          )}
        </p>
      </div>

      {/* Ingestion Form & Success Reflection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Panel */}
        <div className="lg:col-span-7 rounded-2xl bg-stone-900/70 border border-stone-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-stone-100 flex items-center gap-2">
            <BookPlus className="w-4 h-4 text-amber-400" />
            <span>{language === 'urdu-roman' ? 'Nayi Kitab / Maloomat Ka Indiraj' : 'Register New Knowledge'}</span>
          </h3>

          <form onSubmit={handleIngest} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  {language === 'urdu-roman' ? 'Kitab Ka Naam *' : 'Book Title *'}
                </label>
                <input
                  id="book-title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Asbaaq-e-Zindagi / The Way of Peace"
                  className="w-full rounded-lg bg-stone-950 border border-stone-700/80 focus:border-amber-500 text-stone-100 px-3.5 py-2 text-sm placeholder-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  {language === 'urdu-roman' ? 'Musannif (Author)' : 'Author / Sage'}
                </label>
                <input
                  id="book-author-input"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Baba Bulleh Shah / Elder of Qalat"
                  className="w-full rounded-lg bg-stone-950 border border-stone-700/80 focus:border-amber-500 text-stone-100 px-3.5 py-2 text-sm placeholder-stone-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  {language === 'urdu-roman' ? 'Shoba / Category' : 'Category'}
                </label>
                <select
                  id="book-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg bg-stone-950 border border-stone-700/80 text-stone-200 px-3 py-2 text-xs focus:border-amber-500"
                >
                  <option value="Philosophy & Stoicism">Philosophy & Stoicism</option>
                  <option value="Medicine & Health">Medicine & Health</option>
                  <option value="Strategy & Leadership">Strategy & Leadership</option>
                  <option value="Psychology & Mind">Psychology & Mind</option>
                  <option value="Economics & Wealth">Economics & Wealth</option>
                  <option value="Science & Cosmos">Science & Cosmos</option>
                  <option value="Literature, Soul & Poetry">Literature, Soul & Poetry</option>
                  <option value="User Contributed">User Contributed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  {language === 'urdu-roman' ? 'Zamana / Context' : 'Era / Context'}
                </label>
                <input
                  id="book-era-input"
                  type="text"
                  value={era}
                  onChange={(e) => setEra(e.target.value)}
                  placeholder="e.g. 19th Century Punjab / 2026 Practical Field Guide"
                  className="w-full rounded-lg bg-stone-950 border border-stone-700/80 focus:border-amber-500 text-stone-100 px-3.5 py-2 text-sm placeholder-stone-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                {language === 'urdu-roman'
                  ? 'Kitab Ka Matan, Khas Asbaaq ya Hikmat *'
                  : 'Manuscript Content, Core Lessons, Chapters or Excerpts *'}
              </label>
              <textarea
                id="book-content-input"
                required
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  language === 'urdu-roman'
                    ? 'Kitab ke ahem sabaq, aqwaal, aur naseehatein yahan likhein taakay system isay achi tarah samajh kar index kar sakay...'
                    : 'Paste or write the core axioms, life principles, case studies, or wisdom from this book...'
                }
                className="w-full rounded-lg bg-stone-950 border border-stone-700/80 focus:border-amber-500 text-stone-100 p-3.5 text-sm placeholder-stone-500 resize-none"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-800 text-red-200 text-xs">
                {error}
              </div>
            )}

            <button
              id="ingest-submit-btn"
              type="submit"
              disabled={loading || !title.trim() || !content.trim()}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                loading || !title.trim() || !content.trim()
                  ? 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  : 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 hover:from-amber-500 hover:to-amber-400 active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'urdu-roman' ? 'System Kitab Ko Jazb Kar Raha Hai...' : 'Internalizing Knowledge...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{language === 'urdu-roman' ? 'System Ko Yeh Kitab Sikhayein (Teach System)' : 'Teach System This Book'}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Live Feedback / Ingestion Status */}
        <div className="lg:col-span-5 space-y-4">
          {reflection && (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-950/30 via-stone-900 to-stone-900 border border-emerald-500/40 p-5 space-y-3 shadow-lg animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? 'System Ne Kamyaabi Se Seekh Liya!' : 'Successfully Internalized!'}</span>
              </div>
              <h4 className="text-base font-bold text-stone-100 font-['Cinzel',serif]">
                {language === 'urdu-roman' ? 'Kitab-e-Hikmat Ka Paygham:' : 'The Living Codex Message:'}
              </h4>
              <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3.5 rounded-lg border border-stone-800">
                {reflection}
              </p>
              <div className="text-[11px] text-emerald-300/80">
                ✓ {language === 'urdu-roman' ? 'Yeh kitab ab "Masla Ka Hal" me citation ke tor par mustamil hogi.' : 'This book is now actively linked to future problem queries.'}
              </div>
            </div>
          )}

          {/* User Books List in Memory */}
          <div className="rounded-2xl bg-stone-900/70 border border-stone-800 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <Bookmark className="w-4 h-4" />
                <span>{language === 'urdu-roman' ? 'Users Ki Taraf Se Sikhayi Gayi Kitabein:' : 'User-Taught Memory Bank:'}</span>
              </div>
              <span className="text-xs font-mono text-stone-400">{userBooks.length} Books</span>
            </div>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {userBooks.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800/80 hover:border-amber-500/30 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h5 className="text-xs font-bold text-stone-100">{b.title}</h5>
                      <p className="text-[11px] text-amber-400/80">{b.author} • {b.yearOrEra}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
                      {b.category}
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 line-clamp-2">
                    {b.summary}
                  </p>

                  <div className="text-[11px] text-stone-400 italic bg-stone-900/60 p-2 rounded border border-stone-800/50">
                    "{b.sampleQuote}"
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => onSelectBookForProblem(b.title)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
                    >
                      <span>{language === 'urdu-roman' ? 'Is kitab se masla hal karein' : 'Solve dilemma with this book'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
